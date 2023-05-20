import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

class MainScreen extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ImageBackground source={require('./back4.gif')} style={styles.backgroundImage} resizeMode="cover">
          <View style={styles.overlay}>
            <Text style={styles.label}>GAUSSIAN</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
    backgroundColor: 'rgba(12, 27, 58, 0.4)', // add a semi-transparent layer over the background image
  },
  label: {
    color: '#ffffff',
    fontSize: '55vw',
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
    marginBottom: '80%',
  },
  button: {
    marginVertical: '10%',
    width: '50%',
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6vw',
    backgroundColor: 'rgba(211,211,211,0.6)',
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
    fontSize: '18vw',
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
  },
});

MainScreen.navigationOptions = {
  headerShown: false,
};

export default MainScreen;
