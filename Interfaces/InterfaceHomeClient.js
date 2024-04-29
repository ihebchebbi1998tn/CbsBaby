import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./Backend/UserContext";
import ChatbotPopup from "./ChatbotPopup";
import BottomNavbar from "./BottomNavbar";
import CustomHeader from "./CustomHeader";
import Posts from "./Posts";
import { useLanguage } from './LanguageContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const RedesignedInterfaceHomeClient = () => {
  const { user } = useContext(UserContext);
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    // Change the language to user's preferred language
    if (user) {
      changeLanguage(user.language);
    }
  }, [user, changeLanguage]);

  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <View style={styles.container}>
          <CustomHeader />
          <ScrollView>
            <Posts  />
          </ScrollView>
          <ChatbotPopup />
          <BottomNavbar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default RedesignedInterfaceHomeClient;
