import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const InterfaceLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

 

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Images/LogoRose.png")}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        placeholderTextColor="#fff" // Set text color to white
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        placeholderTextColor="#fff" // Set text color to white
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          navigation.navigate("LoginDefaultScreen");
        }}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
          <Ionicons name="arrow-forward" style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d676b0",
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    color: "#fff", // Set text color to white
  },
  loginButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonText: {
    color: "#d676b0",
    fontSize: 16,
  },

  icon: {
    color: "#d676b0",
    fontSize: 15,
    marginLeft: 7, // Adjust the spacing between text and icon
  },
});

export default InterfaceLogin;
