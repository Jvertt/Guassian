import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen'
import SignUpScreen from './SignUpScreen'

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <MainScreen />
      <SignUpScreen />
    </NavigationContainer>
  )
}

export default App
