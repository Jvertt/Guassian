import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

class MainScreen extends Component {
  render() {
    return (
      <ImageBackground source={require('./background.jpeg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.label}>GAUSSIAN</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  signUp = () => {
    this.props.navigation.navigate('Signup');
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 90,
    backgroundColor: 'rgba(12, 27, 58, 0.6)', // add a semi-transparent layer over the background image
  },
  label: {
    color: '#ffffff',
    fontSize: 90,
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    margin: '200px',
    width: '40%',
   height: '40px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FF904D',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 30,
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
  },
});

export default MainScreen;
