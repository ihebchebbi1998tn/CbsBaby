import React, { useState, useRef, useContext, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { Camera } from 'expo-camera';
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import * as FileSystem from 'expo-file-system';

const BottomNavbar = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); 
  const { user } = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const closeCamera = () => {
    setIsCameraVisible(false);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsUploading(true); // Set uploading state to true when starting upload
        let photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
        if (photo && photo.uri) {
          closeCamera(); // Close the camera modal regardless of success or failure
          await uploadImage(photo.uri);
          console.log("Photo uploaded:", photo.uri);
        }
      } catch (error) {
        console.log("Error taking picture:", error.message);
      } finally {
        setIsUploading(false); // Set uploading state to false after upload completes or fails
      }
    }
  };

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('userID', user.id);
      formData.append('dateTaken', new Date().toISOString());
  
      // Encode image data as Base64
      const base64ImageData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      formData.append('image', base64ImageData);
  
      const response = await fetch(`${BASE_URL}bebeapp/api/Profile/save_photo_profile.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
      if (data.status === 'success') {
        console.log("Image uploaded successfully");
      } else {
        console.log("Error uploading image:", data.message);
      }
    } catch (error) {
      console.log("Error uploading image:", error.message);
    }
  };
  
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const getActiveRouteName = () => {
    return navigation.getState().routes[navigation.getState().index].name;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.bottomNav}>
          <TabButton
            icon="home-outline"
            activeIcon="home"
            label="tabLabels.Accueil"
            screen="InterfaceHomeClient"
            navigateTo={navigateTo}
            getActiveRouteName={getActiveRouteName}
            t={t}
          />
          <TabButton
            icon="bed-outline"
            activeIcon="bed"
            label="tabLabels.Conseils"
            screen="InterfaceConseilClient"
            navigateTo={navigateTo}
            getActiveRouteName={getActiveRouteName}
            t={t}
          />
          <View style={styles.cameraIconContainer}>
            {isUploading ? (
              <View style={styles.cameraIcon}>
                <ActivityIndicator color="#FFF" size="large" />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => setIsCameraVisible(true)} // Open camera modal when clicked
              >
                <Ionicons name="camera" size={32} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
          <TabButton
            icon="chatbubbles-outline"
            activeIcon="chatbubbles"
            label="tabLabels.Aide"
            screen="InterfaceCommunication5"
            navigateTo={navigateTo}
            getActiveRouteName={getActiveRouteName}
            t={t}
          />
          <TabButton
            icon="person-outline"
            activeIcon="person"
            label="tabLabels.Profil"
            screen="InterfaceClientPage"
            navigateTo={navigateTo}
            getActiveRouteName={getActiveRouteName}
            t={t}
          />
        </View>
      </View>
      <Modal visible={isCameraVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef} />
          <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
            <Ionicons name="camera" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const TabButton = ({ icon, activeIcon, label, screen, navigateTo, getActiveRouteName, t }) => {
  const activeRouteName = getActiveRouteName();
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeRouteName === screen && styles.activeTabButton,
      ]}
      onPress={() => navigateTo(screen)}
    >
      <Ionicons
        name={activeRouteName === screen ? activeIcon : icon}
        size={20}
        color={activeRouteName === screen ? "#D84374" : "#AAA"}
      />
      {activeRouteName === screen && (
        <View style={styles.activeIndicator} />
      )}
      <Text style={styles.tabLabel}>{t(label)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingBottom: 0,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  activeTabButton: {
    backgroundColor: "#FFF",
  },
  tabLabel: {
    fontSize: 12,
    color: "#AAA",
  },
  activeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: "#D84374",
    marginTop:2,
  },
  cameraIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    zIndex: 1,
  },
  cameraIcon: {
    backgroundColor: "#D84374",
    borderRadius: 40,
    padding: 10,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
  },
  takePictureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    zIndex: 2,
  },
});

export default BottomNavbar;
