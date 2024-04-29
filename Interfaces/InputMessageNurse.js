import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
const InputMessageNurse = ({ sessionId, recieverID , from ,token_key }) => {  
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const { user } = useContext(UserContext);
  const SENDER_ID = user ? user.id : "";
  const handleTyping = (text) => {
    setMessage(text);
    setIsTyping(text.length > 0); 
  };
 
  const handleSendMessage = () => {
    if (message.trim() === "") {
      return;
    }
    const messageTime = new Date().toISOString();
    let url;
 
      url = `${BASE_URL}bebeapp/api/Messaging/send_message.php?session_id=${sessionId}&sender_id=123456789&receiver_id=${recieverID}&type=text&message_text=${encodeURIComponent(message)}&message_time=${encodeURIComponent(messageTime)}&profile_image=https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg&messages_bot=0`;

    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        sendNotification(
          token_key,
          message,
        );
        setMessage('');
      })
      .catch(error => console.error('Error sending message:', error));
  };
  
  
  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        if (result.assets && result.assets.length > 0) {
          setSelectedImage(result.assets[0].uri);
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Display an error message to the user
      alert('Error uploading image. Please try again.');
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage) {
      // Display a message to the user indicating that no image is selected
      alert('Please select an image to send.');
      return;
    }
  
    const formData = new FormData();
    formData.append('session_id', encodeURIComponent(sessionId));
    formData.append('sender_id', "123456789");
    formData.append('receiver_id', encodeURIComponent(recieverID));
    formData.append('type', 'image');
    formData.append('message_time', new Date().toISOString());
    formData.append('profile_image', "https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg");
    formData.append('messages_bot', "0"); // Add message_bot parameter
  
    formData.append('image', {
      uri: selectedImage,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/send_photo.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.ok) {
        // Display a success message to the user
        setSelectedImage(null);
        setModalVisible(false);
      } else {
        // Handle server errors or unexpected response
        console.error('Failed to send image:', response.statusText);
        // Display an error message to the user
        alert('Failed to send image. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      // Display an error message to the user
      alert('Error sending image. Please try again later.');
    }
  };

  const toggleCamera = () => {
    if (!isTyping) {
      handleImageUpload();
    }
  };
  const expandInput = () => {
    setIsTyping(true);
  };
  
  
 

  const sendNotification = async (token_key, messageText) => {
    console.log("Sending push notification...");
  
    // Assuming the sound filename is 'nursenotification.mp3' in the assets directory
    const message = {
      to: `ExponentPushToken[${token_key}]`,
      sound: './assets/nursenotification.mp3', // Include the sound filename
      title: "Assistante CBS",
      body: "a envoyé un message",
    };
  
    console.log(message);
    
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });
  
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to send push notification");
      }
      console.log("Push notification sent successfully");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };
  
  

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={toggleCamera} style={styles.imageUploadButton}>
        {!isTyping && <Ionicons name="camera" size={24} color="#D84374" />}
      </TouchableOpacity>
      <TextInput
        style={[styles.input, isTyping && styles.expandedInput]}
        placeholder="Type a message..."
        value={message}
        onChangeText={handleTyping}
        onFocus={expandInput} 
      />
      <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
        <Ionicons name="send" size={24} color="#ffffff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendImage} style={styles.sendImageButton}>
            <Ionicons name="send" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginRight: 8,
  },
  expandedInput: {
    width: '90%', 
  },
  imageUploadButton: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#D84374',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  selectedImage: {
    width: '90%',
    height: '50%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#D84374',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendImageButton: {
    position: 'absolute',
    top: '70%',  // Position the button at the bottom of the image
    marginTop: 20, // Add margin to separate from the image
    backgroundColor: '#D84374',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InputMessageNurse;
