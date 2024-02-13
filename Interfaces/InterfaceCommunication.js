import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@mindinventory/rn-top-navbar";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const firebaseConfig = {
  apiKey: "AIzaSyAP9uyg4iso0VmqvAh2SY7tvAe3VcxoMmk",
  authDomain: "maman-a1894.firebaseapp.com",
  databaseURL:
    "https://maman-a1894-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "maman-a1894",
  storageBucket: "maman-a1894.appspot.com",
  messagingSenderId: "163003730876",
  appId: "1:163003730876:web:47f865488fa12dd7e6b9b9",
  measurementId: "G-C3GDFR9FL2",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();

const SENDER_ID = "default_user"; // Constant for sender ID

const InterfaceCommunication = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const chatRef = ref(database, "messages");

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      }
    });

    return () => unsubscribe();
  }, []);

  const predefinedQuestions = [
    "Comment puis-je établir une routine de sommeil saine pour mon bébé?",
    "Comment puis-je m'assurer que mon bébé prend suffisamment de lait maternel?",
    "Quels sont les meilleurs moyens de prendre soin de la peau délicate de mon bébé?",
  ];

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity style={styles.questionButton}>
      <Text style={styles.questionText}>{item}</Text>
    </TouchableOpacity>
  );

  const yourImageSource = require("../assets/Images/logotransparent.png");

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      user: SENDER_ID,
      text: message,
      timestamp: new Date().toISOString(),
    };
    push(ref(database, "messages"), newMessage)
      .then(() => setMessage(""))
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        style={{ backgroundColor: "#ff3366" }}
        statusBarBackground="#008080"
        barStyle="light-content"
      >
        <Header.Left style={{ backgroundColor: "#ff3366", width: "15%" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("InterfaceMessages");
            }}
          >
            <Ionicons
              name="arrow-back"
              style={{ color: "#fff", fontSize: 30 }}
            />
          </TouchableOpacity>
        </Header.Left>
        <Header.Body style={{ backgroundColor: "#ff3366", width: "100%" }}>
          <Image source={yourImageSource} style={{ width: 125, height: 30 }} />
        </Header.Body>
        <Header.Right
          style={{
            backgroundColor: "#ff3366",
            flexDirection: "row",
            width: "15%",
          }}
        >
          <Ionicons name="calendar" style={{ color: "#fff", fontSize: 30 }} />
        </Header.Right>
      </Header>
      <View style={styles.messageContainer}>
        {messages.map((msg) => (
          <View
            key={msg.timestamp}
            style={[
              styles.message,
              msg.user === SENDER_ID
                ? styles.userMessage
                : styles.receiverMessage,
            ]}
          >
            <Text
              style={
                msg.user === SENDER_ID
                  ? styles.messageTextUser
                  : styles.messageTextReceiver
              }
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </View>
      <SafeAreaView style={styles.questionContainer}>
        <FlatList
          data={predefinedQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderQuestionItem}
          horizontal
        />
      </SafeAreaView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("InterfaceHomeClient");
          }}
        >
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="mail" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  questionButton: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    height: 40,
    marginRight: 8,
    backgroundColor: "#5eab4c",
    borderRadius: 10,
  },
  questionText: {
    color: "white",
    fontSize: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  message: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#ff3366",
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  messageTextUser: {
    color: "white",
  },
  messageTextReceiver: {
    color: "#ff3366",
  },

  questionContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#a0d9bf",
    height: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#ff3366",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ff3366",
    height: 60,
  },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InterfaceCommunication;
