import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuApp from './Menu';



function HomeHeader() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}> 🐼 PandaChat 1.0</Text>
      <MenuApp />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#946aa5', 
  },
  headerText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1, 
    textAlign:"left",
    paddingBottom:5,
  },
});

export default HomeHeader;