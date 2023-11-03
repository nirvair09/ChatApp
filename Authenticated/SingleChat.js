import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { ref, push, onChildAdded, update } from "firebase/database";
import { db } from "../components/config";
import { storage } from "../components/config";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "react-native-image-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";


const SingleChatList = ({ route }) => {
  const { userData } = useSelector((state) => state.User);
  const { receiverData } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const scrollViewSizeChanged = (contentWidth, contentHeight) => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    const chatRef = ref(db, `/messages/${receiverData.roomId}`);
    const onNewMessage = onChildAdded(chatRef, (snapshot) => {
      const newMessage = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      if (onNewMessage) {
        onNewMessage();
      }
    };
  }, [receiverData.roomId]);

  const sendImage = () => {
    ImagePicker.launchImageLibrary({}, async (response) => {
      if (response.uri) {
        try {
          const imageRef = storage.ref(`/images/${Date.now()}.jpg`);
          await imageRef.putFile(response.uri);
          const imageUrl = await imageRef.getDownloadURL();

          const timestamp = new Date().toISOString();

          const newMessage = {
            image: imageUrl, // Store the image URL
            senderId: userData.id,
            receiverId: receiverData.id,
            sendTime: timestamp,
          };

          const newMessageKey = push(ref(db, "messages")).key;
          const updates = {};
          updates[`/messages/${receiverData.roomId}/${newMessageKey}`] =
            newMessage;

          await update(ref(db), updates);
        } catch (error) {
          console.error("Error sending image:", error);
        }
      }
    });
  };

  const sendMsg = () => {
    if (!messageText) {
      return;
    }

    const timestamp = new Date().toISOString();

    const newMessage = {
      message: messageText,
      senderId: userData.id,
      receiverId: receiverData.id,
      sendTime: timestamp,
    };

    const newMessageKey = push(ref(db, "messages")).key;
    const updates = {};
    updates[`/messages/${receiverData.roomId}/${newMessageKey}`] = newMessage;

    update(ref(db), updates)
      .then(() => {
        setMessageText("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const renderMedia = (message) => {
    if (message.image) {
      return (
        <Image
          source={{ uri: message.image }}
          style={{ width: 200, height: 200 }}
        />
      );
    } else if (message.audio) {
      return (
        <TouchableOpacity onPress={() => playAudio(message.audio)}>
          <Text>Play Audio Message</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  // Function to start audio recording
  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      // Handle recording start (e.g., update UI)
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  // Function to stop audio recording and send the audio
  const stopRecordingAndSend = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      const audioUri = result.audioFileURL;

      // Upload the audio to Firebase Storage and get the download URL
      const downloadUrl = await uploadAudioToFirebase(audioUri);

      if (downloadUrl) {
        // Create a message object with the audio URL
        const timestamp = new Date().toISOString();
        const newMessage = {
          audio: downloadUrl, // Store the audio URL
          senderId: userData.id,
          receiverId: receiverData.id,
          sendTime: timestamp,
        };

        // Upload the audio message to Firebase Realtime Database
        const newMessageKey = push(ref(db, "messages")).key;
        const updates = {};
        updates[`/messages/${receiverData.roomId}/${newMessageKey}`] =
          newMessage;

        await update(ref(db), updates);
      }
    } catch (error) {
      console.error("Error sending audio message:", error);
    }
  };

  // Function to upload audio to Firebase Storage
  const uploadAudioToFirebase = async (audioUri) => {
    try {
      const storageRef = storage.ref(`/audio/${Date.now()}.mp3`);
      await storageRef.putFile(audioUri);
      const downloadUrl = await storageRef.getDownloadURL();

      return downloadUrl; // Return the download URL of the uploaded audio
    } catch (error) {
      console.error("Error uploading audio to Firebase Storage:", error);
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>⇦</Text>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Avatar
            source={{
              uri:
                receiverData?.img ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIBFqUJkZcEkno5OXt_se0Pwmex8CEtDigmBAwbslClLUPk6gggIZn1XkQSrXOUEi8tXU&usqp=CAU",
            }}
            rounded
            title={receiverData.name}
            size="medium"
          />
          <Text style={styles.userName}>{receiverData?.name}</Text>
        </View>
      </SafeAreaView>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollViewSizeChanged}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                {
                  alignSelf:
                    item.senderId === userData.id ? "flex-end" : "flex-start",
                },
              ]}
            >
              {renderMedia(item)}
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMsg}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendImage}>
          <Text style={styles.sendButtonText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMsg}>
          <Text style={styles.sendButtonText}>🎙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={startRecording}>
          <Text style={styles.sendButtonText}>Start Recording</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={stopRecordingAndSend}
        >
          <Text style={styles.sendButtonText}>Stop and Send</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

export default SingleChatList;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#D8BFD8",
  },
  backButton: {
    marginRight: 16,
    fontSize: 24,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#946aa5",
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  sendButtonText: {
    color: "white",
  },
  userInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 10,
  },
  userName: {
    marginTop: 8,
    fontWeight: "bold",
    backgroundColor: "lavender",
  },
});
