import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { UserContext } from "./Backend/UserContext";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook for translations

const DirectContact = () => {
  const { t } = useTranslation(); // Access translation function
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [sagefemmeDetails, setSagefemmeDetails] = useState(null); // State to store sagefemme details
  const { user } = useContext(UserContext);

  const handleSpecialQuestion = () => {
    setLoading(true);
    setResponseReceived(false);
    setResponseStatus(null);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(!modalVisible);
      setTimeout(() => {
        check_availble();
      }, 5000);
    }, 2000);
  };

  const check_availble = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Nurses/check_availble.php`);
      const data = await response.json();

      setLoading(false);
      setResponseReceived(true);


      setSagefemmeDetails(data);
      const sessionId = await createSession(user.id, data.id_sagefemme);
      if (sessionId !== null) {
        navigation.navigate('UserMessages', { sessionId: sessionId });
      } else {
        console.error("Error: Session ID creation failed.");
      }

    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while fetching data. Please try again later.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const createSession = async (user1, user2) => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/create_sessions.php?user1=${user1}`);
      const data = await response.json();

      if (data.status === "success") {
        return data.session_id; // Return session ID if creation is successful
      } else {
        console.error("Error creating session:", data.message);
        return null; // Return null if creation fails
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.specialQuestionButton} onPress={handleSpecialQuestion}>
        <Text style={styles.specialQuestionText}>{t('directContact.contactPrompt')}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal} // Close modal when back button pressed
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={require('../assets/Images/NurseIcon.jpg')} style={styles.imageStyle} />
            {!responseReceived && <ActivityIndicator size="large" color="#de5983" />}
            {responseReceived && responseStatus === false && (
              <View>
                <Text style={styles.modalText}>{t('directContact.noNurseAvailable')}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                  <FontAwesome name="times" size={20} color="white" style={styles.closeButtonIcon} />
                  <Text style={styles.closeButtonText}>{t('directContact.close')}</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  specialQuestionButton: {
    backgroundColor: "#de5983",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  specialQuestionText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    width: "70%", // Adjust the width as needed
  },
  imageStyle: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    marginBottom: 20, // Add some margin to separate the image from the activity indicator
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333", // Dark gray color
  },
  closeButton: {
    backgroundColor: "#de5983",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row", // Align icon and text horizontally
    justifyContent: "center", // Align icon and text vertically
    alignItems: "center", // Center icon and text
    elevation: 2, // Add elevation for shadow effect
  },
  closeButtonIcon: {
    marginRight: 5, // Add margin between icon and text
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DirectContact;
