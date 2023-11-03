import { StyleSheet, Text, View, TextInput, Image, Alert ,KeyboardAvoidingView} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { db } from "../components/config";
import { useDispatch } from "react-redux";
import AuthServices from "../Utils/AuthServices";
import NavigationApp from "../Service/NavigationApp";
import {ref, get, child } from 'firebase/database';
import { setUser } from "../Slice/Slice";



const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async () => {
    if (name && password) {
      try {
        const dbRef = ref(db, 'users');
        const snapshot = await get(child(dbRef, name));
        
        if (snapshot.exists()) {
          if(password===snapshot.val().password){
            let userData = snapshot.val();
            console.log("user detail is that--", userData);
  
            // Dispatch loginUser action
            dispatch(setUser(userData));
  
            // Store user data in AsyncStorage
            await  AuthServices.setAccount(userData);
            console.log("User data stored in AsyncStorage");
  
            // Navigate to the AppStack component or your desired screen
            NavigationApp.navigate("AppStack");

          }
          else{
            Alert.alert("Wrong Password !! Sorry")
          }
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  return (
    <KeyboardAvoidingView style={{backgroundColor:"#CBC3E3"}}>
      <View style={styles.container}>
        <Text style={styles.headding}>Login To Begin!!</Text>
        <Image
          source={{
            uri: "https://www.pngimages.in/uploads/png-webp/2023/February-2023/panda_Png_Images_Free.webp",
          }}
          style={{
            resizeMode: "contain",
            width: 100,
            height: 100,
            backgroundColor:"transparent"
          }}
        />
        <TextInput style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={(nam) => setName(nam)}
        />
        <TextInput style={styles.input}
          placeholder="Your Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TouchableOpacity>
          <View style={styles.loginButton}>
            <Text onPress={handleLogIn} style={styles.buttonText}>
              Log In
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View>
            <Text onPress={() => navigation.navigate("SignUp")} style={styles.dont}>
              Don't have account? {'\n'}Make one here
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loginButton: {
    backgroundColor: "#946aa5",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  headding : {
    paddingTop:90,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#20232a',
    borderRadius: 3,
    marginTop: 15,
    padding: 10,
    width: '80%', 
  },
  dont: {
    fontWeight: "bold", 
    fontSize: 16, 
    marginTop: 10, 
    textAlign:"center"
  }
});
