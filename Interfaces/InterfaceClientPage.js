import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";

const InterfaceClientPage = () => {
  const profileImageSource = require("../assets/Images/maman1.png");
  const navigation = useNavigation();

  const [photos, setPhotos] = useState([
    // Your photo data
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedPhoto(item.source);
        setModalVisible(true);
      }}
    >
      <Image source={item.source} style={styles.thumbnail} />
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={{ flex: 1 }}>
        <View style={styles.profileContainer}>
          <Image source={profileImageSource} style={styles.profileImage} />
          <Text style={styles.username}>Aria Belle Miles</Text>
          <Text style={styles.bio}>
            Moments précieux de mon petit ❤️️ 🍼
          </Text>
        </View>

        <FlatList
          data={photos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.imageContainer}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={selectedPhoto}
            style={{ flex: 1, resizeMode: "contain" }}
          />
        </View>
      </Modal>
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#e6acd8",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#163878",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 12,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
  },
});

export default InterfaceClientPage;
