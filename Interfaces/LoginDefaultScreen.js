import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
const LoginDefaultScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate("InterfaceHomeClient");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <>
    <StatusBar backgroundColor="#c64870" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
    <View style={styles.container}>
      <Image source={require("../assets/loading.gif")} style={styles.gif} />
    </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  gif: {
    width: 60,
    height: 50,
  },
});

export default LoginDefaultScreen;
