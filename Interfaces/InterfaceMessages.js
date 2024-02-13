import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@mindinventory/rn-top-navbar";
import { useNavigation } from "@react-navigation/native";

const ChatListPage = ({ navigation }) => {
  const yourImageSource = require("../assets/Images/logotransparent.png");
  const maman1 = require("../assets/Images/maman1.png");
  const maman2 = require("../assets/Images/maman2.png");
  const maman3 = require("../assets/Images/maman3.png");
  const maman4 = require("../assets/Images/maman4.png");
  const maman5 = require("../assets/Images/maman5.png");

  const userList = [
    {
      id: 1,
      name: "Maman 1",
      lastMessage: "Comment puis-je soutenir le développement moteur..",
      image: maman1,
      read: true,
    },
    {
      id: 2,
      name: "Maman 2",
      lastMessage: "Je suis préoccupée par la façon..",
      image: maman2,
      read: false,
    },
    {
      id: 3,
      name: "Maman 3",
      lastMessage: "Il se réveille souvent la nuit..",
      image: maman3,
      read: true,
    },
    {
      id: 4,
      name: "Maman 4",
      lastMessage: "Oui, il a parfois des rougeurs..",
      image: maman4,
      read: false,
    },
    {
      id: 5,
      name: "Maman 5",
      lastMessage: "Je suis préoccupée par la façon..",
      image: maman5,
      read: false,
    },
    {
      id: 6,
      name: "Maman 6",
      lastMessage: "Je suis préoccupée par la façon..",
      image: maman2,
      read: false,
    },
    {
      id: 7,
      name: "Maman 7",
      lastMessage: "Je suis préoccupée par la façon..",
      image: maman2,
      read: false,
    },
    {
      id: 8,
      name: "Maman 8",
      lastMessage: "Je suis préoccupée par la façon..",
      image: maman5,
      read: false,
    },
  ];

  const handleUserPress = (userId) => {
    console.log(`Opening chat with User ${userId}`);
  };

  return (
    <View style={styles.container}>
      <Header style={{ backgroundColor: "#ff3366" }}>
        <Header.Left style={{ backgroundColor: "#ff3366", width: "15%" }}>
          <Ionicons name="arrow-back" style={{ color: "#fff", fontSize: 30 }} />
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
          // ChatListPage component
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("InterfaceCommunication");
            }}
          >
            <Ionicons name="create" style={{ color: "#fff", fontSize: 30 }} />
          </TouchableOpacity>
        </Header.Right>
      </Header>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search..." />
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {userList.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userContainer}
            onPress={() => {
              console.log(navigation); // Log navigation object
              navigation.navigate("InterfaceCommunication");
            }}
          >
            <Image source={user.image} style={styles.userImage} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.lastMessage}>{user.lastMessage}</Text>
            </View>
            <View style={styles.readIndicatorContainer}>
              {user.read ? (
                <Ionicons name="checkmark-done" size={20} color="#4CAF50" />
              ) : (
                <Ionicons name="checkmark-outline" size={20} color="#FF3366" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navbar}>
      <TouchableOpacity
            onPress={() => {
              navigation.navigate("InterfaceHomeClient");
            }}
          >
        <Ionicons name="home" size={24} color="white" style={styles.navIcon} />
        </TouchableOpacity>
        <Ionicons name="mail" size={24} color="white" style={styles.navIcon} />
        <Ionicons
          name="person"
          size={24}
          color="white"
          style={styles.navIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchInput: {
    fontSize: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 16,
    color: "#777",
  },
  readIndicatorContainer: {
    marginLeft: 8,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ff3366",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navIcon: {
    // Add any specific styling for your icons if needed
  },
});

export default ChatListPage;
