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


async def scrape_urls(interest: str, base_url: str, max_urls_per_company: int, download_timeout: int) -> List[dict]:
    scraped_data = []
    urls_scraped_count = 0

    try:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        connector = aiohttp.TCPConnector(ssl=ssl_context)

        async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=download_timeout),
                                         connector=connector) as session:
            async with session.get(base_url) as response:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                links = soup.find_all('a')

                unfiltered_links = [link.get('href') for link in links if link.get('href') and link.get(
                    'href').startswith('http')]
                filtered_links = filter_urls(unfiltered_links)

                tasks = []

                for i, link_url in enumerate(filtered_links):
                    if urls_scraped_count >= max_urls_per_company:
                        break

                    if link_url and link_url.startswith('http'):
                        print(f"[{i + 1}] Downloading {link_url}...")
                        task = download_and_parse_article(session, link_url)
                        tasks.append(task)
                        urls_scraped_count += 1

                        if urls_scraped_count >= max_urls_per_company:
                            break

                scraped_data = await asyncio.gather(*tasks)
                scraped_data = [data for data in scraped_data if data is not None]
                print(f"Scraped {urls_scraped_count} URLs")

    except aiohttp.ClientError as e:
        print(f"Error downloading {base_url}: {e}")

    return scraped_data


async def scrape_and_process(organizations: List[List[str]], interest: str, max_urls: int, download_timeout: int,
                             scrape_timeout: int, tokenizer, model) -> Dict[str, str]:
    print("Entering scrape_and_process...")
    scraped_urls = {}
    category_contents = {}

    tasks = []
    for category, _, base_url in organizations:
        task = scrape_urls(interest, base_url, max_urls, download_timeout)
        tasks.append(task)

    org_data_list = await asyncio.gather(*tasks)

    for (category, _, _), org_data in zip(organizations, org_data_list):
        if category not in category_contents:
            category_contents[category] = ""
        for data in org_data:
            category_contents[category] += data["content"] + "\n\n"

    category_summaries = {}  # Dictionary to store summaries for each category

    for category, content in category_contents.items():
        filtered_content = remove_stopwords(content)
        summarized_text = summarize_text(filtered_content, tokenizer, model)
        category_summaries[category] = summarized_text
        print(f"Category: {category}")
        print(f"Summary: {summarized_text}")
        print("_____________________________________")

    print("Exiting scrape_and_process...")
    return category_summaries


@app.route("/")
def get_scraped_data():
    with open("user_profile_data.json") as f:
        user_profile_data = json.load(f)
        # Get the interest from the user profile data
        interest = user_profile_data["interest"]
    print(f"Interest: {interest}")

    tokenizer = T5Tokenizer.from_pretrained('t5-base')
    model = T5ForConditionalGeneration.from_pretrained('t5-base')

    scraped_data = asyncio.run(
        scrape_and_process(ORGANIZATIONS, interest, CONFIG_MAX_URLS, CONFIG_DOWNLOAD_TIMEOUT, CONFIG_SCRAPE_TIMEOUT,
                           tokenizer, model))
    return jsonify(scraped_data)


if __name__ == "__main__":
    app.run()
