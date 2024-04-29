import React, { useState, useEffect , useContext} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const FirstPage = ({ route }) => {
  const [language, setLanguage] = useState(null);
  const [animateText] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);


  const handleLanguageSelect = async (lang) => {
    const apiUrl = `${BASE_URL}bebeapp/api/authentification/update_langue.php?scannedId=${user.id}&langue=${lang}`;
    
    console.log("API Request:", apiUrl); // Log the request URL
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log("API Response:", data); // Log the response data
      
      // Navigate to SecondPage
      navigation.navigate('SecondPage');
    } catch (error) {
      console.error("API Error:", error); // Log any errors that occur during the fetch operation
    }
  };

  useEffect(() => {
    Animated.timing(animateText, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Images/NurseIcon.jpg")}
          style={styles.logo}
        />
      </View>

      <Animated.View style={[styles.messageBox, { opacity: animateText }]}>
        <Text style={styles.messageText}>
          Bienvenue {user.name}, sur notre application mobile !
        </Text>
      </Animated.View>
      <Text style={styles.userText}>Choisissez votre langue</Text>

      <View style={styles.languageContainer}>
        <TouchableOpacity
          onPress={() => handleLanguageSelect("ar")}
          style={styles.languageButton}
        >
          <Image source={require("../assets/ar.png")} style={styles.flagIcon} />
          <Text style={styles.languageButtonText}>عربي</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLanguageSelect("fr")}
          style={styles.languageButton}
        >
          <Image source={require("../assets/fr.png")} style={styles.flagIcon} />
          <Text style={styles.languageButtonText}>Français</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleLanguageSelect("en")}
          style={styles.languageButton}
        >
          <Image source={require("../assets/en.png")} style={styles.flagIcon} />
          <Text style={styles.languageButtonText}>Anglais</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.indicatorContainer}>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.currentDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: "rgba(217,66,116, 0.7)",
    borderRadius: 18,
    padding: 10,
    width: 230,
    position: "absolute",
    top: "21.5%", // Adjust as needed
    left: "8%",
    right: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
    marginLeft: '10%',
  },
  logo: {
    width: 320,
    height: 170,
  },
  userText: {
    color: "#1d3d7a",
    fontSize: 20,
    marginBottom: 15,
  },
  languageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 25,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(217,66,116, 0.7)",
    marginBottom: 10,
    width: 250,
    justifyContent: "left",
  },
  flagIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  languageButtonText: {
    color: "rgba(217,66,116, 0.9)",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#dcdcdc",
    marginHorizontal: 5,
  },
  currentDot: {
    backgroundColor: "#d94274",
  },
});

export default FirstPage;
