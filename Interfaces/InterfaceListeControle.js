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
import { useTranslation } from "react-i18next";


const InterfaceListeControle = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const { t, i18n } = useTranslation();


  const isArabic = i18n.language === "ar";


  const checklistItems = [
    {
      title: t("Les documents à apporter"),
      description: t("Assurez-vous d'avoir tous les documents nécessaires."),
      image: require("../assets/Images/documents.png"),
    },
    {
      title: t("Votre valise pour le séjour"),
      description: t("Préparez-vous avec des vêtements et vos essentiels."),
      image: require("../assets/Images/valise.png"),
    },
    {
      title: t("Pour votre bébé"),
      description: t("Préparez tous les essentiels de votre bébé."),
      image: require("../assets/Images/pourbebe.png"),
    },
  ];
  const handleChecklistItemPress = (index) => {
    switch (index) {
      case 0:
        navigation.navigate("InterfaceDocumentUser");
        break;
      case 1:
        navigation.navigate("InterfaceValiseUser");
        break;
      case 2:
        navigation.navigate("InterfaceValiseUserBebe");
        break;
      default:
        break;
    }
  };

  const renderChecklistItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleChecklistItemPress(index)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isArabic && styles.arabicText]}>
          {item.title}
        </Text>
        <Text style={[styles.description ,isArabic && styles.arabicText]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <>
    <View style={styles.container}>
      <View style={styles.content}>
          <Text style={[styles.heading, { marginTop: 12 }]}>
          {t("Votre liste de contrôle")}
          </Text>
          <FlatList
            data={checklistItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderChecklistItem}
            scrollEnabled={false}
          />
      </View>
    </View>
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
export default InterfaceListeControle;
