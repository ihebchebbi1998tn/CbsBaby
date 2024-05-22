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
import { useLanguage } from "./LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import PostsTips from "./PostsTips";
import PostsTipsScroll from "./PostsTipsScroll";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import FlyersPosts from "./FlyersPosts";
import AdsClinique from "./AdsClinique";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  separator: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D84374",
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#D84374",
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
  },
  line: {
    position: "absolute",
    bottom: -1,
    height: 2,
    backgroundColor: "#D84374",
    width: "50%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
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
    backgroundColor: "#fff",
    color: "#6B7280",
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#D1D5DB",
    color: "#1F2937",
    marginRight: 10,
  },
  goBackContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  goBackText: {
    color: "#D84374",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10, // Adjust as needed
  },
});

const InterfaceHomeClient = () => {
  const { user } = useContext(UserContext);
  const { changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("ARTICLES");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    if (user) {
      changeLanguage(user.language);
    }
  }, [user, changeLanguage]);

  const categories = [
    { translated: t("1_CATEGORY"), nonTranslated: "Pregnancy Tips" },
    { translated: t("2_CATEGORY"), nonTranslated: "Labor & Delivery" },
    { translated: t("3_CATEGORY"), nonTranslated: "Prenatal Care" },
    { translated: t("4_CATEGORY"), nonTranslated: "Postpartum Support" },
    { translated: t("5_CATEGORY"), nonTranslated: "Newborn Care" },
    { translated: t("6_CATEGORY"), nonTranslated: "Breastfeeding Advice" },
    { translated: t("7_CATEGORY"), nonTranslated: "Baby Development" },
    { translated: t("8_CATEGORY"), nonTranslated: "Parenting Essentials" },
    { translated: t("9_CATEGORY"), nonTranslated: "Parental Wellness" },
    { translated: t("10_CATEGORY"), nonTranslated: "Nutrition Advice" },
  ];

  const handleCategoryPress = (category) => {
    setSelectedCategory({
      translated: category.translated,
      nonTranslated: category.nonTranslated,
    });
    setActiveTab("ARTICLES");
  };

  const handleGoBack = () => {
    setSelectedCategory(null);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar backgroundColor="#D84374" barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
          <View style={styles.container}>
            <CustomHeader />
            <View style={styles.separator}>
              <TouchableOpacity
                onPress={() => setActiveTab("ARTICLES")}
                style={[
                  styles.buttonText,
                  activeTab === "ARTICLES" && styles.activeButton,
                ]}
              >
                <Text style={styles.buttonText}>{t("ARTICLES")}</Text>
                {activeTab === "ARTICLES" && (
                  <View style={[styles.line, { left: 0 }]} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("VIDEOS")}
                style={[
                  styles.buttonText,
                  activeTab === "VIDEOS" && styles.activeButton,
                ]}
              >
                <Text style={styles.buttonText}>{t("VIDEOS")}</Text>
                {activeTab === "VIDEOS" && (
                  <View style={[styles.line, { right: 0 }]} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={t("SEARCH_ARTICLES")}
                placeholderTextColor="#6B7280"
                onChangeText={handleSearch} // Call handleSearch when text changes
              />
            </View>
            <View style={styles.categoryContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleCategoryPress(category)}
                  >
                    <Text style={styles.categoryItem}>
                      {category.translated}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.contentContainer}>
              <ScrollView>
                {activeTab === "ARTICLES" && (
                  <>
                    {selectedCategory ? (
                      <View>
                        <TouchableOpacity
                          onPress={handleGoBack}
                          style={styles.goBackContainer}
                        >
                          <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#D84374"
                          />
                          <Text style={styles.goBackText}>{t("GoBack")}</Text>
                        </TouchableOpacity>
           
                        <PostsTipsScroll
                          searchQuery={searchQuery}
                          parameterTranslated={selectedCategory.translated}
                          parameter={selectedCategory.nonTranslated}
                        />
                      </View>
                    ) : (
                      <>
                  <AdsClinique />
                        <Posts searchQuery={searchQuery} />
                        {/* <FlyersPosts /> */}
                        {categories.map((category, index) => (
                          <PostsTips
                            key={index}
                            parameterTranslated={category.translated}
                            parameter={category.nonTranslated}
                            searchQuery={searchQuery}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
                {activeTab === "VIDEOS" && (
                  <>
                    <Videos  searchQuery={searchQuery} />
                  </>
                )}
              </ScrollView>
            </View>
            <ChatbotPopup />
            <BottomNavbar />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default InterfaceHomeClient;
