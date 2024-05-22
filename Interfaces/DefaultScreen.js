import React, { useEffect, useState, useContext } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "./Backend/UserContext";

const LoadingScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const userData = await AsyncStorage.getItem('userData');
 console.log(userData);
      if (userData) {
        updateUser(userData);

        navigation.navigate("InterfaceHomeClient");
      } else {
        navigation.navigate("InterfaceLogin");
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <StatusBar backgroundColor="#c64870" barStyle="light-content" />
      <Image
        source={require("../assets/splash.png")} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <ActivityIndicator color="#1e3775" size="large" />
        <LoadingText />
      </View>
    </SafeAreaView>
  );
};

const LoadingText = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={styles.loadingText}>
      Chargement{dots}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Default background color
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#1e3775",
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoadingScreen;
