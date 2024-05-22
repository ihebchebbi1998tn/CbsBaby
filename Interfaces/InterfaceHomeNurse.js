import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./Backend/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./Backend/apiConfig";
import { StatusBar } from "expo-status-bar";
import BottomNavbarNurse from "./BottomNavbarNurse";
import HeaderNavbar from "./HeaderNavbar";
import ItSupport from "./ItSupport";
import StatsHomeNurse from "./StatsHomeNurse";
import ActifNurse from "./ActifNurse";

const InterfaceHomeNurse = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchNurseStatusInterval = setInterval(fetchNurseStatus, 3000);
      const fetchUnreadMessagesInterval = setInterval(fetchUnreadMessages, 2000);

      return () => {
        clearInterval(fetchNurseStatusInterval);
        clearInterval(fetchUnreadMessagesInterval);
      };
    }
  }, [user]);

  const fetchNurseStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Nurses/getNurseStatus.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setIsActive(data.isActive);
      } else {
        setIsActive(false);
        Alert.alert("Erreur", data.message);
      }
    } catch (error) {
      setIsActive(false);
      console.error("Erreur lors de la récupération du statut de l'infirmière :", error);
      Alert.alert("Erreur", "Échec de la récupération du statut de l'infirmière. Veuillez réessayer plus tard.");
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Messaging/not_read_message_user.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setUnreadMessages(data.session_count);
      } else {
        console.error("Échec de la récupération du nombre de messages non lus :", data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre de messages non lus :", error);
    }
  };

  const handleAddArticle = () => {
    navigation.navigate("PostCreationScreen");
  };

  const handleMessagesPress = () => {
    if (isActive) {
      navigation.navigate("InterfaceMessages");
      setUnreadMessages(0); // Réinitialise les messages non lus à 0 lors de la navigation vers les messages
    } else {
      Alert.alert(
        "Inactif",
        "Vous devez être actif pour accéder aux messages.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <HeaderNavbar />
        <ItSupport />
        <ScrollView contentContainerStyle={styles.content}>
          <ActifNurse />
          <StatsHomeNurse />
          <View style={styles.ButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAddArticle}
            >
              <Ionicons name="add-circle-outline" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Ajouter un article</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("ViewPostsScreen")}
            >
              <Ionicons name="eye-outline" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Articles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                !isActive && styles.disabledButton,
              ]}
              onPress={handleMessagesPress}
            >
              <Ionicons
                name="chatbubble-outline"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Messages</Text>
              {unreadMessages > 0 && (
                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadMessages}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("QuestionsCreationScreen")}
            >
              <Ionicons name="settings-outline" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Questions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Patient")}
            >
              <Ionicons name="rose-outline" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Mamans</Text>
            </TouchableOpacity>
            {/* Décommenter si nécessaire
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("EquipeCbs")}
            >
              <Ionicons name="people-circle-outline" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>CBSbébé</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
        <BottomNavbarNurse />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  ButtonsContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "95%",
    alignSelf: "center",
    marginTop: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#c74871",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    position: "relative", // Position relative ajoutée pour le positionnement du badge
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonIcon: {
    color: "#ffffff",
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  badge: {
    backgroundColor: "#ff0000",
    borderRadius: 50,
    paddingHorizontal: 8, // Ajuster le padding
    paddingVertical: 4, // Ajuster le padding
    minWidth: 20, // Assurer une largeur minimale
    alignItems: "center", // Centrer le contenu du badge horizontalement
    justifyContent: "center", // Centrer le contenu du badge verticalement
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default InterfaceHomeNurse;
