import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { db } from "../components/config";
import { ListItem, Avatar } from "react-native-elements";
import HomeHeader from "../Header/HomeHeader";
import NavigationApp from "../Service/NavigationApp";
import { useBackHandler } from "@react-native-community/hooks";
import { Alert, BackHandler } from "react-native";

const AuthenticatedHome = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const { userData } = useSelector((state) => state.User);

  // const backAction=()=>{
  // Alert.alert('','Are You sure to excit LetsApp2.0 ?'),[{
  //   text:'No',
  //   onPress:()=> null,
  //   style: 'cancel'
  // },{
  //   text:'Yes',
  //   onPress:()=> BackHandler.exitApp()
  // }]
  // }

  // useBackHandler(backAction);

  useEffect(() => {
    if (userData && userData.name) {
      getChatList();
    }
  }, [userData]);

  const getChatList = async () => {
    if (!userData || !userData.name) {
      console.error("Invalid userData or userData.name");
      return;
    }

    const chatlistRefAuth = ref(db, `chatlist/${userData.name}`);

    get(chatlistRefAuth).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setChatList(Object.values(snapshot.val()));
      } else {
        setChatList([]);
      }
    });
  };

  const NavigateToSingleChat = (item) => {
    NavigationApp.navigate("SingleChat", { receiverData: item });
  };

  const renderItemOfAuthHome = ({ item }) => {
    return (
      <ListItem onPress={() => NavigateToSingleChat(item)}>
        <Avatar
          source={{
            uri:
              item?.img ||
              "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=",
          }}
          rounded
          title={item.name}
          size="medium"
        />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item?.about}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <>
      <HomeHeader />
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={chatList}
        renderItem={renderItemOfAuthHome}
      />
    </>
  );
};

export default AuthenticatedHome;
