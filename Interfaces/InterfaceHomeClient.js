import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./Backend/UserContext";
import ChatbotPopup from "./ChatbotPopup";
import BottomNavbar from "./BottomNavbar";
import CustomHeader from "./CustomHeader";
import Posts from "./Posts";
import Videos from "./Videos"; // Import the Videos component
import { useLanguage } from './LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import PostsTips from "./PostsTips";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5", // Background color for the container
  },
  separator: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D84374",
    paddingBottom: 5,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#D84374",
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  line: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    backgroundColor: '#D84374',
    width: '50%',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#EFF0F6", // Background color for the input
    color: "#6B7280", // Text color for the input
  },
  searchIcon: {
    position: 'absolute',
    right: '13%',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryScrollView: {
    flexDirection: "row",
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#D1D5DB", // Background color for the category item
    color: "#1F2937", // Text color for the category item
    marginRight: 10, // Added marginRight for spacing between categories
  },
});

const InterfaceHomeClient = () => {
  const { user } = useContext(UserContext);
  const { changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("ARTICLES");
  const { t, i18n } = useTranslation(); // Access translation function

  useEffect(() => {
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
          <View style={styles.separator}>
            <TouchableOpacity
              onPress={() => setActiveTab("ARTICLES")}
              style={[styles.buttonText, activeTab === "ARTICLES" && styles.activeButton]}
            >
              <Text style={styles.buttonText}>{t("ARTICLES")}</Text>
              {activeTab === "ARTICLES" && <View style={[styles.line, { left: 0 }]} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("VIDEOS")}
              style={[styles.buttonText, activeTab === "VIDEOS" && styles.activeButton]}
            >
              <Text style={styles.buttonText}>{t("VIDEOS")}</Text>
              {activeTab === "VIDEOS" && <View style={[styles.line, { right: 0 }]} />}
            </TouchableOpacity>
          </View>
          <ScrollView>
            {activeTab === "ARTICLES" && (
              <>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("SEARCH_ARTICLES")}
                    placeholderTextColor="#6B7280"
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                  {/* Render static categories */}
                  <Text style={styles.categoryItem}>{t("BABY_CATEGORY")}</Text>
                  <Text style={styles.categoryItem}>{t("GENERAL_CATEGORY")}</Text>
                  <Text style={styles.categoryItem}>{t("BLOG_CATEGORY")}</Text>
                </ScrollView>
                <Posts />
                <PostsTips />
              </>
            )}
            {activeTab === "VIDEOS" && <>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("SEARCH_VIDEOS")}
                    placeholderTextColor="#6B7280"
                  />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                  {/* Render static categories */}
                  <Text style={styles.categoryItem}>{t("BABY_CATEGORY")}</Text>
                  <Text style={styles.categoryItem}>{t("GENERAL_CATEGORY")}</Text>
                  <Text style={styles.categoryItem}>{t("BLOG_CATEGORY")}</Text>
                </ScrollView>
                <Videos />
              </>}
          </ScrollView>
          <ChatbotPopup />
          <BottomNavbar />
        </View>
      </SafeAreaView>
    </>
  );
};

export default InterfaceHomeClient;
