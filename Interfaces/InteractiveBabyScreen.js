import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const InteractiveBabyScreen = () => {
  const navigation = useNavigation();

  // Handle press for the nose


  // Handle press for the head
  const handleHeadPress = () => {
    // Navigate to a new screen or show tips for the head
    navigation.navigate("TipsScreen", { category: "Head" });
  };

  // Handle press for the clothes
  const handleClothesPress = () => {
    // Navigate to a new screen or show tips for the clothes
    navigation.navigate("TipsScreen", { category: "Clothes" });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Images/baby_image.png")}
        style={styles.babyImage}
      />

      {/* TouchableOpacity for the nose */}
      <TouchableOpacity
        style={[styles.touchableArea, styles.noseArea]}
        onPress={handleNosePress}
      />

      {/* TouchableOpacity for the head */}
      <TouchableOpacity
        style={[styles.touchableArea, styles.headArea]}
        onPress={handleHeadPress}
      />

      {/* TouchableOpacity for the clothes */}
      <TouchableOpacity
        style={[styles.touchableArea, styles.clothesArea]}
        onPress={handleClothesPress}
      />

      {/* Add more touchable areas as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  babyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  touchableArea: {
    position: "absolute",
    backgroundColor: "transparent", // Make the touchable area transparent
  },
  noseArea: {
    top: 120,
    left: 90,
    width: 30,
    height: 30,
    backgroundColor: "black", // Make the touchable area transparent
  },
  headArea: {
    top: 400,
    left: 70,
    width: 80,
    height: 80,
    backgroundColor: "black", // Make the touchable area transparent

  },
  clothesArea: {
    top: 200,
    left: 50,
    width: 100,
    height: 50,
  },
  // Add more styles for additional touchable areas
});

export default InteractiveBabyScreen;
