import React, { useState, useRef , useContext} from "react";
import { TouchableOpacity, View, Text, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { Camera } from 'expo-camera';
import { BASE_URL } from "./Backend/apiConfig";
import { Platform } from 'react-native';
import { UserContext } from "./Backend/UserContext";

const BottomNavbar = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); 
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef(null); // Step 2: Create a ref for the camera
  const { user } = useContext(UserContext);

  const openCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setIsCameraOpen(true);
      } else {
        alert('Camera permission denied');
      }
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };
  
  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const getActiveRouteName = () => {
    return navigation.getState().routes[navigation.getState().index].name;
  };

  const TabButton = ({ icon, activeIcon, label, screen }) => {
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
          size={24}
          color={activeRouteName === screen ? "#D84374" : "#AAA"}
        />
        {activeRouteName === screen && (
          <View style={styles.activeIndicator} />
        )}
        <Text style={styles.tabLabel}>{t(label)}</Text>
      </TouchableOpacity>
    );
  };

  const CameraView = () => {
    return (
      <Modal
        visible={isCameraOpen}
        transparent={true}
        onRequestClose={closeCamera}
      >
        <View style={styles.cameraModal}>
          <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef}> 
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
                <Ionicons name="camera" size={32} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Camera>
          <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
            <Ionicons name="close" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        console.log("Picture taken:", uri);
  
        // Assuming you have userID and dateTaken available here
        const userID = user.id; // Replace with the actual user ID
        const dateTaken = new Date().toISOString(); // Replace with the actual date
  
        // Call uploadImage function with the userID, dateTaken, and uri
        await uploadImage(userID, dateTaken, uri);
        closeCamera(); // Close the camera after taking the picture
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };
  
  const uploadImage = async (userID, dateTaken, uri) => {
    try {
      const formData = new FormData();
      formData.append('userID', userID);
      formData.append('dateTaken', dateTaken);
      formData.append('image', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      
      const response = await fetch(`${BASE_URL}bebeapp/api/Profile/save_photo_profile.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      console.log("Image uploaded:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        <TabButton
          icon="home-outline"
          activeIcon="home"
          label="tabLabels.Accueil"
          screen="InterfaceHomeClient"
        />
        <TabButton
          icon="bulb-outline"
          activeIcon="bulb"
          label="tabLabels.Conseils"
          screen="InterfaceConseilClient"
        />
        <View style={styles.cameraIconContainer}>
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={openCamera} 
          >
            <Ionicons name="camera" size={34} color="#FFF" />
          </TouchableOpacity>
        </View>
        <TabButton
          icon="chatbubbles-outline"
          activeIcon="chatbubbles"
          label="tabLabels.Aide"
          screen="InterfaceCommunication5"
        />
        <TabButton
          icon="person-outline"
          activeIcon="person"
          label="tabLabels.Profil"
          screen="InterfaceClientPage"
        />
      </View>

      {/* Camera View */}
      <CameraView />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingBottom: 0, // Add some padding to prevent the active indicator from getting cut off
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
    paddingTop: 10, // Adjust padding to center icon and text vertically
  },
  activeTabButton: {
    backgroundColor: "#FFF", // Set active background color to white
  },
  tabLabel: {
    fontSize: 12,
    color: "#AAA",
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D84374",
    marginTop: 5, // Adjust margin to position indicator below the text
  },
  cameraIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22, // Move the camera icon container up by 30 to surpass the bottom nav bar by 50%
    zIndex: 1, // Set zIndex to ensure the camera icon container overlaps the bottom nav bar
  },
  cameraIcon: {
    backgroundColor: "#D84374",
    borderRadius: 40, // Make the camera icon container a circle
    padding: 10,
    elevation: 12, // Increase elevation for the camera icon to surpass the bottom nav bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 }, // Adjust shadow offset to match the elevation
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  cameraModal: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#D84374',
    borderRadius: 50,
    padding: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
});

export default BottomNavbar;
