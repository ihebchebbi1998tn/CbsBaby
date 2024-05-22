import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";
import ChatbotPopup from "./ChatbotPopup";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import InterfaceListeControle from "./InterfaceListeControle";

const InterfaceConseilClient = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <View style={styles.container}>
          <CustomHeader />
          <InterfaceListeControle />
          <ChatbotPopup />
          <BottomNavbar />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  content: {
    flex: 1,
    marginTop: 0,
    marginBottom: -3,
    padding: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  carouselContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  carouselImage: {
    width: "100%",
    height: 330,
    borderRadius: 5,
    overflow: "hidden",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  touchableArea: {
    position: "absolute",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#D84374",
  },
  eyesArea: {
    top: "18%",
    left: "82%",
  },
  noseArea: {
    top: "10%",
    left: "3%",
  },
  sieges: {
    top: "55%",
    left: "3%",
  },
  Cordon: {
    top: "57%",
    left: "78%",
  },
  noseIcon: {
    width: "100%",
    height: "80%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    width: 100,
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  description: {
    fontSize: 16,
    color: "#666666",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: "#D84374",
  },
  paginationInactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: "#ccc",
  },
  paginationCircles: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  paginationCircle: {
    width: 10,
    height: 10,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: "#D84374",
  },
  arabicText: {
    marginRight: 10, // Adjust as needed
  },
});

export default InterfaceConseilClient;
