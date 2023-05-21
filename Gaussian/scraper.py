from flask import Flask, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
from typing import List, Dict
from newspaper import Article, ArticleException
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize
from transformers import T5ForConditionalGeneration, T5Tokenizer
import nltk
import ssl
import aiohttp
import asyncio
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

ORGANIZATIONS = [
    # Stocks
    ["Stocks", "MarketWatch", "https://www.marketwatch.com/"],
    ["Stocks", "Investopedia", "https://www.investopedia.com/"],

    # US Laws
    ["US Laws", "SCOTUSblog", "https://www.scotusblog.com/"],
    ["US Laws", "National Law Review", "https://www.natlawreview.com/"],
    ["US Laws", "Above the Law", "https://abovethelaw.com/"],

    # Companies
    ["Companies", "TechCrunch", "https://techcrunch.com/"],
    ["Companies", "VentureBeat", "https://venturebeat.com/"],
    ["Companies", "Wired", "https://www.wired.com/category/science/"],

    # News
    ["News", "The Intercept", "https://theintercept.com/"],
    ["News", "Reason", "https://reason.com/"],
    ["News", "ProPublica", "https://www.propublica.org/"],
]

CONFIG_MAX_URLS = 15
CONFIG_DOWNLOAD_TIMEOUT = 30
CONFIG_SCRAPE_TIMEOUT = 20


async def download_and_parse_article(session, link_url):
    try:
        async with session.get(link_url) as response:
            html = await response.text()
            article = Article(link_url)
            article.set_html(html)
            article.parse()
            return {
                'url': link_url,
                'content': article.text
            }
    except (aiohttp.ClientError, ArticleException, asyncio.TimeoutError) as e:
        print(f"Error downloading {link_url}: {e}")
        return None


def filter_urls(urls: List[str]) -> List[str]:
    blacklisted_words = ['advertising', 'donate', 'join', 'checkout', 'events', 'webinar', 'login', 'signup',
                         'subscribe', 'terms', 'privacy']
    filtered_urls = []
    for url in urls:
        if not any(blacklisted_word in url for blacklisted_word in blacklisted_words):
            filtered_urls.append(url)
    return filtered_urls


def tokenize_sentences(text: str) -> List[str]:
    sentences = sent_tokenize(text)
    return sentences


def summarize_text(text: str, tokenizer, model) -> str:
    inputs = tokenizer.encode("summarize: " + text, return_tensors='pt', max_length=1024, truncation=True)
    outputs = model.generate(inputs, max_length=300, min_length=80, length_penalty=1.5, num_beams=4,
                             early_stopping=True)
    summary = tokenizer.decode(outputs[0])
    return summary


def remove_stopwords(text: str) -> str:
    stop_words = set(stopwords.words('english'))
    words = text.split()
    filtered_text = " ".join([word for word in words if word.lower() not in stop_words])
    return filtered_text


async def scrape_urls(interest: str, base_url: str, max_urls_per_company: int, download_timeout: int) -> List[str]:
    ssl._create_default_https_context = ssl._create_unverified_context
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=download_timeout)) as session:
        try:
            async with session.get(base_url) as response:
                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")
                urls = []
                for link in soup.find_all("a"):
                    url = link.get("href")
                    if url is not None and url.startswith("http"):
                        urls.append(url)
                filtered_urls = filter_urls(urls)
                return filtered_urls[:max_urls_per_company]
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
            print(f"Error scraping {base_url}: {e}")
            return []


def process_articles(articles: List[Dict[str, str]], tokenizer, model) -> List[Dict[str, str]]:
    processed_articles = []
    for article in articles:
        content = article['content']
        sentences = tokenize_sentences(content)
        summarized_sentences = []
        for sentence in sentences:
            summarized_sentence = summarize_text(sentence, tokenizer, model)
            summarized_sentences.append(summarized_sentence)
        summarized_text = " ".join(summarized_sentences)
        filtered_text = remove_stopwords(summarized_text)
        article['content'] = filtered_text
        processed_articles.append(article)
    return processed_articles


@app.route('/')
def index():
    return "Hello, World!"


@app.route('/scrape', methods=['GET'])
def scrape():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    future = asyncio.ensure_future(scrape_async())
    results = loop.run_until_complete(future)
    loop.close()
    return jsonify(results)


async def scrape_async():
    tasks = []
    async with aiohttp.ClientSession() as session:
        for organization in ORGANIZATIONS:
            interest = organization[0]
            base_url = organization[2]
            task = asyncio.ensure_future(scrape_urls(interest, base_url, CONFIG_MAX_URLS, CONFIG_SCRAPE_TIMEOUT))
            tasks.append(task)
        url_lists = await asyncio.gather(*tasks)
        flat_urls = [url for url_list in url_lists for url in url_list]
        flat_urls = list(set(flat_urls))
        tasks = []
        async with aiohttp.ClientSession() as session:
            for url in flat_urls:
                task = asyncio.ensure_future(download_and_parse_article(session, url))
                tasks.append(task)
            articles = await asyncio.gather(*tasks)
            articles = [article for article in articles if article is not None]
            tokenizer = T5Tokenizer.from_pretrained('t5-base')
            model = T5ForConditionalGeneration.from_pretrained('t5-base')
            processed_articles = process_articles(articles, tokenizer, model)
            return processed_articles


if __name__ == "__main__":
    app.run()
