import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";
import SettingsProfile from "./SettingsProfile";
import Gallery from "./Gallery";

const InterfaceClientPage = () => {
  const profileImageSource = require("../assets/Images/maman1.png");

  const [currentSection, setCurrentSection] = useState("gallery");

  const toggleSection = (section) => {
    setCurrentSection(section);
  };

  return (
    <>
    <StatusBar backgroundColor="#D84374" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.profileContainer}>
        <Image source={profileImageSource} style={styles.profileImage} />
        <Text style={styles.username}>Aria Belle Miles</Text>
        <Text style={styles.bio}>Precious moments of my little one ❤️️ 🍼</Text>
      </View>
      <View style={styles.sectionToggleContainer}>
        <TouchableOpacity
          onPress={() => toggleSection("gallery")}
          style={[
            styles.sectionItem,
            currentSection === "gallery" && styles.activeSection,
          ]}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color="#FFFFFF"
            style={styles.sectionText}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleSection("settings")}
          style={[
            styles.sectionItem,
            currentSection === "settings" && styles.activeSection,
          ]}
        >
          <Ionicons
            name="cog-outline"
            size={20}
            color="#FFFFFF"
            style={styles.sectionText}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View
          style={{ display: currentSection === "gallery" ? "flex" : "none" }}
        >
          <Gallery />
        </View>
        <View
          style={{ display: currentSection === "settings" ? "flex" : "none" }}
        >
          <SettingsProfile />
        </View>
      </View>
    </View>
    <BottomNavbar />
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 15,
    margin: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#e6acd8",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#163878",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  sectionToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#163878",
    paddingVertical: 12,
    width: "100%",
  },
  sectionItem: {
    paddingHorizontal: 30,
  },
  sectionText: {
    marginBottom: 10,
    color: "#fff",
  },
  activeSection: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 10, // Increase margin between photos
    marginEnd: 5,
    marginStart: 5,
  },
  thumbnail: {
    width: 120, // Increase thumbnail size
    height: 120, // Increase thumbnail size
    borderRadius: 12,
  },
  photoDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  settingsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
 
  sectionItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center", // Align items horizontally
    marginHorizontal: "15%",
    borderBottomWidth: 3, // Add bottom border
    borderBottomColor: "transparent", // Initially set it to transparent
  },
});

export default InterfaceClientPage;
