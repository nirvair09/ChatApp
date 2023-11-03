import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { child, ref, get, update } from "firebase/database";
import { db } from "../components/config";
import uuid from "react-native-uuid";
import {
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import { ListItem, Avatar ,Divider} from "react-native-elements";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import NavigationApp from "../Service/NavigationApp";
import { useNavigation } from "@react-navigation/native";


const AllUser = () => {
  const { userData } = useSelector((state) => state.User);

  const [search, setSearch] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [allUserBackup, setAllUserBackup] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    const dbRef = ref(db);
    get(child(dbRef, `users/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const filteredChatList = Object.values(snapshot.val()).filter(
            (item) => {
              return item.id !== userData.id;
            }
          );
          setAllUser(filteredChatList);
          setAllUserBackup(filteredChatList);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createChatList = (data) => {
    if (!userData || !userData.name || !data || !data.name) {
      console.error("Invalid userData or data");
      return;
    }

    const chatlistRef = ref(db, `/chatlist/${userData.name}/${data.name}`);

    get(chatlistRef)
      .then((snapshot) => {
        console.log("User data: ", snapshot.val());
        if (!snapshot.exists()) {
          let roomId = uuid.v4();
          let myData = {
            roomId,
            id: userData.id,
            name: userData.name,
            emailId: userData.emailId,
            lastMsg: "",
          };
          data.lastMsg = "";
          data.roomId = roomId;
          const updates = {};

          updates[`/chatlist/${data.name}/${userData.name}`] = myData;
          updates[`/chatlist/${userData.name}/${data.name}`] = { data };

          update(ref(db), updates)
            .then(() => {
              console.log("Data updated.");
              NavigationApp.navigate("SingleChat", { receiverData: data });
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
        } else {
          NavigationApp.navigate("SingleChat", {
            receiverData: snapshot.val(),
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data from Firebase:", error);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <ListItem onPress={() => createChatList(item)}  containerStyle={styles.listItemContainer}>
          <Avatar
            source={{
              uri:
                item?.img ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIBFqUJkZcEkno5OXt_se0Pwmex8CEtDigmBAwbslClLUPk6gggIZn1XkQSrXOUEi8tXU&usqp=CAU",
            }}
            rounded
            title={item.name}
            size="medium"
          />
          <ListItem.Content>
            <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
            <ListItem.Subtitle> {item?.about}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <Divider style={styles.listItemDivider} />

      </View>
    );
  };

  const searchAppUser = (val) => {
    setSearch(val);
    setAllUser(allUserBackup.filter((it) => it.name.match(val)));
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Text style={styles.arrowText}>⇦</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headText}>Search by Name</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView>
        <StatusBar barStyle="dark-content" backgroundColor="lavender" />
        <SearchBar
          placeholder="Search by name..."
          onChangeText={(val) => searchAppUser(val)}
          value={search}
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
        />
        <FlatList
          renderItem={renderItem}
          data={allUser}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
      </KeyboardAvoidingView>
    </>
  );
};

export default AllUser;

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

  },
  searchContainer: {
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "#f4e4f4",
    borderRadius: 6,
    paddingLeft: 16,
  },
  listItemContainer: {
    backgroundColor: "#f4e4f4", 
    borderBottomWidth: 1, 
    borderBottomColor: "#d0b0d0", 
  },
  listItemTitle: {
    fontWeight: "bold", 
  },
  listItemDivider: {
    height: 1, 
    backgroundColor: "#d0b0d0", 
  },
  list: {
    backgroundColor: "white",
  },
});
