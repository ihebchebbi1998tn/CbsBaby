import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  FlatList,
  SafeAreaView
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";
import ChatbotPopup from "./ChatbotPopup";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';

const InterfaceConseilClientOnly = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);

  const adviceImages = [
    require("../assets/Images/baby_image.png"),
    require("../assets/Images/conseilmom.png"),
  ];

  const handleCarouselPress = (category) => {
    navigation.navigate("InterfaceConseilsPosts", { category });
  };
  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.carouselContainer}>
      <Image source={item} style={styles.carouselImage} resizeMode="cover" />
      {index === 0 && (
        <>
          <TouchableOpacity
            style={[styles.touchableArea, styles.eyesArea]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchableArea, styles.noseArea]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchableArea, styles.sieges]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchableArea, styles.Cordon]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
      {index === 1 && (
        <>
          <TouchableOpacity
            style={[styles.touchableAreaMom, styles.kerchmaman]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.touchableArea, styles.sieges]}
            onPress={() => handleCarouselPress("default")}
          >
            <Ionicons name="bulb" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
      <View style={styles.paginationCircles}>
        {adviceImages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationCircle,
              { opacity: i === index ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
    </View>
  );

  return (
    <>
    <StatusBar backgroundColor="#D84374" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.heading}>Astuces pour maman</Text>
          <Carousel
            ref={carouselRef}
            data={adviceImages}
            renderItem={renderCarouselItem}
            sliderWidth={350}
            itemWidth={300}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
        </ScrollView>
      </View>
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
    backgroundColor: "rgba(217,66,116, 0.5)",
  },
  touchableAreaMom: {
    position: "absolute",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(217,66,116, 0.5)",
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
  
  kerchmaman: {
    top: "58%",
    left: "53%",
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
});

export default InterfaceConseilClientOnly;
