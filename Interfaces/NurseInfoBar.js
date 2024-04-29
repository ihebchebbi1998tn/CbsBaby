import React, { useContext } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./Backend/UserContext";

const NurseInfoBar = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const nurseImageSource = require("../assets/Images/maman1.png"); // Replace with the actual nurse image

  const handleLogout = () => {
    showConfirmationPopup();
  };

  const showConfirmationPopup = () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: () => navigation.navigate("InterfaceLogin"),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Image source={nurseImageSource} style={styles.nurseImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>({user.username})</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" style={styles.logoutIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "visible", // To allow shadow to be visible outside the container
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2, // Positive value for bottom shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nurseImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#163878",
  },
  userUsername: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    marginLeft: "auto",
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 100, // Makes it a circle
  },
  logoutIcon: {
    color: "#163878",
    fontSize: 24,
  },
});


export default NurseInfoBar;
