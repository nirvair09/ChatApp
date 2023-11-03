import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./Slice/Slice";
import AuthStack from "./Navigation/AuthStack";
import AppStack from "./Navigation/AppStack";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NavigationApp from "./Service/NavigationApp"
import AuthServices from "./Utils/AuthServices";


const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const {login } = useSelector(state => state.User);
  // console.log("isAuthenticated",login);
  // console.log(userData);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      let data = await AuthServices.getAccount();
      if (data) {
        // console.log(data);
        dispatch(setUser(data));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setLoading(false);
    }
  };
  

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer  ref={(r) => NavigationApp.setTopLevelNavigator(r)} >
      <Stack.Navigator>
        {!login ? (
          <Stack.Screen name="Auth" component={AuthStack}  options={{ headerShown: false }}  />
        ) : (
          <Stack.Screen name="AppStack" component={AppStack}  options={{ headerShown: false }}  />
        )}
      </Stack.Navigator>
   </NavigationContainer>
  
    
  );
}

