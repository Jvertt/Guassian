import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const [data, setData] = useState("");
  const [expandedWidgets, setExpandedWidgets] = useState([]);
  const [widget3Summary, setWidget3Summary] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.log(error));
  }, []);

  const handleWidgetClick = (index) => {
    setExpandedWidgets(prevExpandedWidgets => {
      const updatedExpandedWidgets = [...prevExpandedWidgets];
      updatedExpandedWidgets[index] = !updatedExpandedWidgets[index];
      return updatedExpandedWidgets;
    });
  };

  const handleButtonClick = () => {
  fetch("http://127.0.0.1:5000")
    .then(response => response.text())  // Expecting text response
    .then(data => {
      setWidget3Summary(data);  // Update the state with the received message
    })
    .catch(error => console.log(error));
};


  return (
    <ImageBackground source={require('./gray.png')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <TouchableOpacity style={[styles.widget, expandedWidgets[0] && styles.widgetExpanded]} onPress={() => handleWidgetClick(0)}>
          <Text style={styles.text}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.widget2, expandedWidgets[1] && styles.widgetExpanded]} onPress={() => handleWidgetClick(1)}>
          <Text style={styles.text}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.widget3, expandedWidgets[2] && styles.widgetExpanded]} onPress={() => handleWidgetClick(2)}>
          <Text style={styles.text}>{widget3Summary}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Click Me!</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '20%',
    paddingHorizontal: '10%',
  },
  widget: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#45D7CA',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 80,
    padding: 20,
    transform: [{ rotateX: '35deg' }, { perspective: 1000 }],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  widget2: {
    width: '110%',
    height: '32%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 80,
    padding: 20,
    transform: [{ rotateX: '35deg' }, { perspective: 1000 }],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  widget3: {
    width: '110%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#F4D4B7',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 80,
    padding: 20,
    transform: [{ rotateX: '35deg' }, { perspective: 1000 }],
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  widgetExpanded: {
    height: '60%',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    padding: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: {
      width: 0,
      height: 8,
    },
    textShadowRadius: 3,
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default HomeScreen;
