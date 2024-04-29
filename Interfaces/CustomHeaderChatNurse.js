import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@mindinventory/rn-top-navbar";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const CustomHeaderChatNurse = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
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
    <View>
      <Header style={styles.headerContainer}>
      <Text style={styles.headerText}>Bonjour, {user.name}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.disconnectIcon}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
      </Header>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#D84374",
    borderBottomWidth: 1,
    borderBottomColor: "#86c8cf",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 0,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  disconnectIcon: {
    marginLeft: "auto", // Push the icon to the right
  },
});

export default CustomHeaderChatNurse;
