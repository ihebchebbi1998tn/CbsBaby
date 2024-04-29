import React, { useContext } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./Backend/UserContext";

const HeaderNavbar = () => {
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
    <View style={styles.header}>
      <Text style={styles.headerText}>Bonjour, {user.name}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.disconnectIcon}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#D84374",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Center vertically
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

export default HeaderNavbar;
