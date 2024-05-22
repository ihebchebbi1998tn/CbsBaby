import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";

const { width, height } = Dimensions.get("window");

const Gallery = () => {
    const { user } = useContext(UserContext);
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchPhotos = () => {
            if (user && user.id) {
                fetch(`${BASE_URL}bebeapp/api/Profile/get_post.php?userID=${user.id}`)
                    .then((response) => response.text())
                    .then((text) => {
                        try {
                            const data = JSON.parse(text);
                            setPhotos(data);
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                            console.log("Response text:", text);
                        }
                    })
                    .catch((error) => console.error("Error fetching images:", error));
            }
        };
    
        fetchPhotos();
    
        const intervalId = setInterval(fetchPhotos, 10000);
        return () => {
            clearInterval(intervalId);
        };
    }, [user]);
    
    const handlePhotoPress = (photo) => {
        setSelectedPhoto(photo);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => {
        const dateTaken = item.DateTaken.split(" ")[0]; 
        
        return (
          <TouchableOpacity onPress={() => handlePhotoPress(item)}>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: `${BASE_URL}/bebeapp/api/Profile/${item.ImageURL}` }}
                style={styles.thumbnail}
              />
              <Text style={styles.photoDate}>{dateTaken}</Text>
            </View>
          </TouchableOpacity>
        );
    };

    return (
        <>
            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={(item) => item.ImageID.toString()}
                numColumns={3}
                contentContainerStyle={styles.imageContainer}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Image
                        source={{
                            uri: selectedPhoto ? `${BASE_URL}/bebeapp/api/Profile/${selectedPhoto.ImageURL}` : "",
                        }}
                        style={styles.modalImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.photoDate}>
                        {selectedPhoto ? selectedPhoto.DateTaken : ""}
                    </Text>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    photoContainer: {
        alignItems: "center",
        marginBottom: 10,
        marginHorizontal: 5,
    },
    thumbnail: {
        width: 120,
        height: 120,
        borderRadius: 12,
    },
    photoDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        alignItems: "center",
        justifyContent: "center",
    },
    closeButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1,
    },
    modalImage: {
        width: width,
        height: height,
    },
});

export default Gallery;
