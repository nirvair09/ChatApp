import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import AllUser from '../Authenticated/AllUser';
import SingleChat from '../Authenticated/SingleChat';
import AuthenticatedHome from "../Authenticated/AuthenticatedHome"
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from '../Authenticated/ProfileScreen';
import Setting from '../Authenticated/Setting';
import MakeGroup from '../Authenticated/MakeGroup';


const Stack=createStackNavigator();

const HomeScreen = () => {
  return (    

      <Stack.Navigator
      initialRouteName="AuthHome"
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: 'lavender'},
      }}
    >
      <Stack.Screen name="AuthHome" component={AuthenticatedHome}  options={{ headerShown: false }} />
      <Stack.Screen name="usersOfApp" component={AllUser}  options={{ headerShown: false }}/>
      <Stack.Screen name="SingleChat" component={SingleChat}  options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
      <Stack.Screen name="Setting" component={Setting} options={{headerShown: false}} />
      <Stack.Screen name="GroupMake" component={MakeGroup} options={{headerShown: false}} />
    </Stack.Navigator>

    
   
  )
}

export default HomeScreen

const styles = StyleSheet.create({})