import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

class SignUpScreen extends Component {
  render() {
    return (
      <ImageBackground source={require('./background.jpeg')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.label}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => console.log(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => console.log(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Interests"
            onChangeText={(text) => console.log(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => console.log(text)}
          />
          <TouchableOpacity style={styles.button} onPress={this.signUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  signUp = () => {
    // Implement sign up logic here
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
    padding: 60,
    backgroundColor: 'rgba(12, 27, 58, 0.6)', // add a semi-transparent layer over the background image
  },
  label: {
    color: '#ffffff',
    fontSize: 90,
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
    marginBottom: 90,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 20,
    marginBottom: 22,
  },
  button: {
    marginTop: '30px',
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
    color: '#ffff',
    fontSize: 30,
    fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
