import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./Backend/UserContext";
import ChatbotPopup from "./ChatbotPopup";
import BottomNavbar from "./BottomNavbar";
import CustomHeader from "./CustomHeader";
import Posts from "./Posts";
import PostsConseils from "./PostsConseils";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const InterfaceConseilsPosts = ({ route }) => {
  const { category } = route.params;

  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <View style={styles.container}>
          <CustomHeader />
          <ScrollView>
           <PostsConseils category={category}   />
          </ScrollView>
          <ChatbotPopup />
          <BottomNavbar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default InterfaceConseilsPosts;
