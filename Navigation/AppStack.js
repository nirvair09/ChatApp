import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import { Text } from 'react-native-elements';
import AllUser from '../Authenticated/AllUser';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    
    <Stack.Navigator 
    initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="userOfApp" component={AllUser} /> */}
        
    </Stack.Navigator>
  );
}