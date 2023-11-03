import { StyleSheet, Text, View, Image, Alert,KeyboardAvoidingView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import {db }from "../components/config";
import {ref, set } from "firebase/database";
import uuid from 'react-native-uuid';
import { useState } from "react";

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [about, setAbout] = useState("");
 

  const handleSignUp= async ()=>{
    if(userName&&email&&password&&(password===conpassword)){
      let data={
       id:uuid.v4(),
       name:userName,
       password:password,
       emailId:email,
       about:about,
      };
   
      await set(ref(db, 'users/' + data.name), data);
      navigation.navigate("Login");

    }else{
      Alert.alert("Fill all Information please")
    }

  }

  return (
    <KeyboardAvoidingView style={{backgroundColor:"#CBC3E3"}}>
      <View style={styles.container}>
        <Text style={styles.headding}>SignUp to PandaChat!!</Text>
        <Image
          source={{
            uri: "https://png.pngtree.com/png-clipart/20210530/original/pngtree-panda-vector-flat-illustration-png-image_6363890.jpg",
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
          value={userName}
          onChangeText={(name) => setUsername(name)}
        />
        <TextInput style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(mail) => setEmail(mail)}
        />
        <TextInput style={styles.input}
          placeholder="About"
          value={about}
          onChangeText={(about) => setAbout(about)}
        />
        <TextInput style={styles.input}
          placeholder="Your Password"
          value={password} 
          onChangeText={(text1) => setPassword(text1)}
          secureTextEntry
        />
        <TextInput style={styles.input}
          placeholder="Confirm Your Password"
          value={conpassword} 
          onChangeText={(text2) => setConPassword(text2)}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleSignUp}>
          <View style={styles.signupButton}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
          <View >
            <Text style={styles.dont}>Already have account? {'\n'}Get Back to Login Page</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  signupButton: {
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
    width: '80%', // Added to control width
  },
  dont: {
    fontWeight: "bold", // Changed to 'bold'
    fontSize: 16, // Adjust the font size as needed
    marginTop: 10, // Adjust the margin as needed
    textAlign:"center"
  }
});

export default SignUpScreen;
