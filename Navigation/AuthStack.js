import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import { Text } from 'react-native-elements';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
    
    initialRouteName="Login" headerMode="none">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}