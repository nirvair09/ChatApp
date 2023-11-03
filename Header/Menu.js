import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Menu, MenuItem } from "react-native-material-menu";
import { removeUser } from "../Slice/Slice";
import { useDispatch } from 'react-redux'; 
import { useNavigation } from '@react-navigation/native';
import NavigationApp from "../Service/NavigationApp";

const MenuApp = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch(); 
  const navigation = useNavigation();

  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);

  const handleMenuItemPress = (action) => {
    closeMenu(); 
    switch (action) {
      case "profile":
        NavigationApp.navigate("Profile");
        break;
      case "groupMake":
        NavigationApp.navigate("GroupMake");
        break;
      case "searchUser":
        NavigationApp.navigate("usersOfApp");
        break;
      case "settings":
        NavigationApp.navigate("Setting");
        break;
      case "logout":
        dispatch(removeUser());
        navigation.navigate("AppStack", { screen: 'Login' });
        break;
      default:
        break;
    }
  };

  return (
    <View >
      <Menu
        visible={visible}
        anchor={<Text onPress={openMenu}>☰</Text>}
        onRequestClose={closeMenu}
        
      >
        <Pressable
          onPress={(event) => event.target == event.currentTarget && setVisible(false)}
        >
          <MenuItem onPress={() => handleMenuItemPress("profile")} style={styles.menuItem}>
            My Profile
          </MenuItem>
          <MenuItem onPress={() => handleMenuItemPress("groupMake")} style={styles.menuItem}>
            Make Group
          </MenuItem>
          <MenuItem onPress={() => handleMenuItemPress("searchUser")} style={styles.menuItem}>
            Search User
          </MenuItem>
          <MenuItem onPress={() => handleMenuItemPress("settings")} style={styles.menuItem}>
            Settings
          </MenuItem>
          <MenuItem onPress={() => handleMenuItemPress("logout")} style={styles.menuItem}>
            Log Out
          </MenuItem>
        </Pressable>
      </Menu>
    </View>
  );
};

export default MenuApp;

const styles = StyleSheet.create({
  menuItem: {
    marginVertical: 5, 
    color: "purple",  
  },
  icon:{
    fontWeight:"bold",
    fontSize:20,
  }
});


