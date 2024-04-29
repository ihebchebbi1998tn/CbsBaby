import React from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import WebView from "react-native-webview";
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from "./Backend/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HeaderNavbar from "./HeaderNavbar";

const ViewPostsScreen = ({ navigation }) => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#D84374" />
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load content. Please try again later.</Text>
    </View>
  );

  const handleGoBack = () => {
    navigation.navigate('InterfaceHomeNurse'); // Navigate back to InterfaceHomeNurse
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <HeaderNavbar />
      <View style={styles.contentContainer}>
        <WebView
          source={{ uri: `${BASE_URL}bebeapp/front/get_posts_table.php` }}
          style={styles.webview}
          renderLoading={renderLoading}
          renderError={renderError}
          startInLoadingState={true}
        />
        <TouchableOpacity style={styles.floatingButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flex: 1,
    position: "relative", // Necessary for positioning the floating button
  },
  webview: {
    flex: 1,
    marginTop: 0, // Adjust as needed based on your design requirements
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  floatingButton: {
    position: "absolute",
    top: height * 0.02,
    left: width * 0.05,
    backgroundColor: "rgba(199,73,112,0.7)",
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ViewPostsScreen;
