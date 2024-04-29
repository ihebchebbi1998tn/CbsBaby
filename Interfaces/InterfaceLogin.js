import React , { useState, useContext, useEffect } from "react";
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
  Clipboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import { registerForPushNotificationsAsync } from "./Backend/NotificationService"; // Import the function here
import { StatusBar } from "expo-status-bar";
import QRCodeIcon from "./RCodeIcon";
import { useRoute } from "@react-navigation/native";

const InterfaceLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
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
          const expoPushToken = await registerForPushNotificationsAsync(); // Retrieve the Expo push token
          const url = `${BASE_URL}bebeapp/api/authentification/authentification.php?file_number=${encodeURIComponent(
            username
          )}&password=${encodeURIComponent(
            password
          )}&token_key=encodeURIComponent(expoPushToken)`; // Fixed the URL syntax issue
    
          const response = await fetch(url);
          console.log(url);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          console.log(data);
          if (data.success) {
            const userData = data.user_data;
            updateUser(data.user_data);
  
            if (userData && userData.id) {
              if (userData.found_in_table === "maman") {
                if (userData.connection === "0") {
                  // If connection is 0 and found_in_table is maman, navigate to the first page
                  navigation.navigate("InterfaceHomeClient"); // Change to the appropriate page name
                } else {
                  navigation.navigate("InterfaceHomeClient");
                }
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
  
  

  useEffect(() => {
    updateUser(null);
  }, []);


  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
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
                placeholderTextColor="#D84374"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <QRCodeIcon
                style={styles.qrIcon}
                onScan={handleScan}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                placeholderTextColor="#D84374"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#8ccad1" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>
                    Connexion
                  </Text>
                  <Ionicons name="arrow-forward" style={styles.iconbutton} />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Vous avez oublié vos identifiants ?
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.signupLink}>
                  Récupérer
                </Text>
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
                    <Text style={styles.textStyle}>
                      Fermer
                    </Text>
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

// Define component styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: "center",
    width: "80%",
    borderColor: "#D84374",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    position: "relative",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  icon: {
    color: "#D84374",
    fontSize: 24,
    marginLeft: 5,
    marginRight: 5,
  },
  qrIcon: {
    position: "absolute",
    right: "5%", // Adjusted position for LTR languages
    top: "-30%", // Centered vertically
    fontSize: 24, // Adjusted font size
  },
  loginButton: {
    backgroundColor: "#143a7b",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#8ccad1",
    fontSize: 16,
    marginRight: 5,
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: "#D84374",
    marginRight: 5,
    fontSize: 12,
  },
  signupLink: {
    color: "#143a7b",
    fontWeight: "bold",
    fontSize: 12,
  },
  iconbutton: {
    color: "#8ccad1",
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(217,66,116, 0.5)", // Adjusted background color and opacity
    borderRadius: 20,
    padding: 25, // Adjusted padding
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
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10, // Adjusted padding
    paddingHorizontal: 20, // Adjusted padding
    elevation: 2,
    marginTop: 0, // Adjusted margin
  },
  textStyle: {
    color: "#D84374",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16, // Adjusted font size
    color: "#143a7b", // Adjusted text color
  },
});

export default InterfaceLogin;
