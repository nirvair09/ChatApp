import { StyleSheet, Text, View,SafeAreaView,TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/native";
const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Text style={styles.arrowText}>⇦</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headText}>Your Profile</Text>
        </View>
      </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems: "center",
    backgroundColor: "#946aa5", 
    paddingVertical: 30,
    borderBottomLeftRadius:9,
    borderBottomRightRadius:9,
    
  },
  arrowText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white", 
    alignItems:"flex-start",
    marginBottom:10,
    marginLeft:12,
  },
  headText:{
    fontSize:20,
    fontWeight:"bold",
    marginLeft:75,
    marginBottom:10,

  }
});