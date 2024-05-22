import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import { registerForPushNotificationsAsync } from "./Backend/NotificationService";
import { StatusBar } from "expo-status-bar";
import QRCodeIcon from "./RCodeIcon";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const InterfaceLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { user, updateUser } = useContext(UserContext);

  const { scannedUsername } = route.params || { scannedUsername: "" };

  useEffect(() => {
    if (scannedUsername) {
      setUsername(scannedUsername);
    }
  }, [scannedUsername]);

  const handleScan = (data) => {
    setUsername(data);
    setScannedData(data);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
  
      if (!username.trim() || !password.trim()) {
        setModalMessage("Please enter your credentials.");
        setModalVisible(true);
        setLoading(false);
        return;
      }
  
      setTimeout(async () => {
        try {
          const expoPushToken = await registerForPushNotificationsAsync();
          const url = `${BASE_URL}bebeapp/api/authentification/authentification.php?file_number=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(password)}&token_key=${encodeURIComponent(expoPushToken)}`;
  
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (data.success) {
            const userData = data.user_data;
            updateUser(userData);
  
            // Save user data in AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
            console.log('User data saved to AsyncStorage:', userData);
  
            if (userData && userData.id) {
              if (userData.found_in_table === "maman") {
                navigation.navigate("InterfaceHomeClient");
              } else if (userData.found_in_table === "sagefemme") {
                navigation.navigate("InterfaceHomeNurse");
              } else {
                setModalMessage("Table not recognized.");
                setModalVisible(true);
              }
            } else {
              setModalMessage("User data is invalid.");
              setModalVisible(true);
            }
          } else {
            setModalMessage(data.message || "Login error.");
            setModalVisible(true);
          }
        } catch (error) {
          console.error("Error:", error);
          setModalMessage("Login error.");
          setModalVisible(true);
        } finally {
          setLoading(false);
        }
      }, 4000);
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("Login error.");
      setModalVisible(true);
    }
  };
  

  return (
    <>
      <StatusBar backgroundColor="#d84374" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../assets/bglogin.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#d84374"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <QRCodeIcon style={styles.qrIcon} onScan={handleScan} />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry={!showPassword}
                placeholderTextColor="#d84374"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#90ced3" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>Connexion</Text>
                  <Ionicons name="arrow-forward" style={styles.iconbutton} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate("SignupScreen")}
            >
              <Text style={styles.signupButtonText}>Créer un compte</Text>
              <Ionicons name="person-add-outline" style={styles.iconbutton} />

            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Vous avez oublié vos identifiants ?
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.signupLink}>Récupérer</Text>
              </TouchableOpacity>
            </View>
         
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  inputContainer: {
    alignItems: "center",
    width: "100%",
    borderColor: "#d84374",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#163878",
  },
  icon: {
    color: "#d84374",
    fontSize: 24,
    marginLeft: 5,
    marginRight: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: '-0%',
    top: "14%",
    padding: 5,
  },
  qrIcon: {
    position: "absolute",
    right: 5,
    top: "1%",
    transform: [{ translateY: -12 }],
    fontSize: 24,
    color: "#d84374",
  },
  loginButton: {
    backgroundColor: "#d84374",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    marginRight: 10,
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
   signupButtonText: {
    color: "#fff",
    fontSize: 18,
    marginRight: 10,
  },
  iconbutton: {
    color: "#90ced3",
    fontSize: 18,
  },
  signupLink: {
    color: "#163878",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
  },
  signupButton: {
    backgroundColor: "#163878",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  iconbutton: {
    color: "#90ced3",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#163878",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#90ced3",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "#d84374",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 0,
    textAlign: "center",
    fontSize: 16,
    color: "#ffffff",
  },
});

export default InterfaceLogin;
