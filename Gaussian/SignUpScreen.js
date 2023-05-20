import React, { Component } from 'react';
import {
StyleSheet,
View,
Text,
TextInput,
TouchableOpacity,
ImageBackground,
Dimensions,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const widthMultiplier = width / 375;
const heightMultiplier = height / 812;

class SignUpScreen extends Component {
signUp = () => {
// Implement sign up logic here

// Navigate to SubmittedScreen when submit button is pressed
const pushAction = StackActions.push('Submitted');
this.props.navigation.dispatch(pushAction);
};

render() {
return (
<ImageBackground source={require('./back4.gif')} style={styles.backgroundImage} resizeMode="cover">
<View style={styles.container}>
<Text style={styles.label}>Sign Up</Text>
<TextInput
style={styles.input}
placeholder="Email"
autoCapitalize="none"
keyboardType="email-address"
onChangeText={text => console.log(text)}
/>
<TextInput
style={styles.input}
placeholder="Username"
onChangeText={text => console.log(text)}
/>
<TextInput
style={styles.input}
placeholder="Interests"
onChangeText={text => console.log(text)}
/>
<TextInput
style={styles.input}
placeholder="Password"
secureTextEntry={true}
onChangeText={text => console.log(text)}
/>
<TouchableOpacity style={styles.button} onPress={this.signUp}>
<Text style={styles.buttonText}>Submit</Text>
</TouchableOpacity>
</View>
</ImageBackground>
);
}
}

const styles = StyleSheet.create({
backgroundImage: {
flex: 1,
resizeMode: 'cover',
},
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 60 * heightMultiplier,
},
label: {
color: '#ffffff',
fontSize: 50 * widthMultiplier,
fontFamily: 'Montserrat-limited/Montserrat-ExtraBold',
fontWeight: 'bold',
marginBottom: 90 * heightMultiplier,
},
input: {
width: '100%',
height: 50 * heightMultiplier,
backgroundColor: '#fff',
borderRadius: 10,
paddingLeft: 20,
marginBottom: 22 * heightMultiplier,
},
button: {
  marginVertical: '10%',
  width: '70%',
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

export default SignUpScreen;