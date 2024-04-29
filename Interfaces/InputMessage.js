import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";
import * as ImagePicker from 'expo-image-picker';

const InputMessage = ({ sessionId, recieverID }) => {  
  const [nurseTokens, setNurseTokens] = useState([]);
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
 
  const handleSendMessage = async () => {
    if (message.trim() === "") {
      return;
    }
  
 fetchNurseTokens();
  
    const words = message.trim().split(/\s+/);
  
    words.forEach(word => console.log(word));
  
    const messageTime = new Date().toISOString();
    let url = `${BASE_URL}bebeapp/api/Messaging/send_message.php?session_id=${sessionId}&sender_id=${SENDER_ID}&receiver_id=${recieverID}&type=text&message_text=${encodeURIComponent(message)}&message_time=${encodeURIComponent(messageTime)}&profile_image=https://cdn-icons-png.flaticon.com/512/4478/4478097.png&messages_bot=0`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      sendNotification(
        nurseTokens,
        message,
      );
  
      checkAndSendPredefinedMessages();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
    formData.append('sender_id', encodeURIComponent(SENDER_ID));
    formData.append('receiver_id', encodeURIComponent(recieverID));
    formData.append('type', 'image');
    formData.append('message_time', new Date().toISOString());
    formData.append('profile_image', "https://cdn-icons-png.flaticon.com/512/4478/4478097.png");
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
        
        sendNotification(
          nurseTokens,
          'message',
        );
        
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
  

  useEffect(() => {
    const timer = setTimeout(() => {
      sendPredefinedMessages();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const sendPredefinedMessages = async () => {
    const welcomeMessage = "Bienvenue sur notre application bébé ! 🎉";
    const introMessage = "Je suis votre assistante à la clinique Beau Séjour. Comment puis-je vous aider ? 😊";
    const messageTime = new Date().toISOString();

    try {
      let url = `${BASE_URL}bebeapp/api/Messaging/send_message.php?session_id=${sessionId}&sender_id=123456789&receiver_id=${SENDER_ID}&type=text&message_text=${encodeURIComponent(welcomeMessage)}&message_time=${encodeURIComponent(messageTime)}&profile_image=https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg&messages_bot=1`;
      let response = await fetch(url);
      let data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 4000)); // Delay for 1 second
      url = `${BASE_URL}bebeapp/api/Messaging/send_message.php?session_id=${sessionId}&sender_id=123456789&receiver_id=${SENDER_ID}&type=text&message_text=${encodeURIComponent(introMessage)}&message_time=${encodeURIComponent(messageTime)}&profile_image=https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg&messages_bot=1`;
      response = await fetch(url);
      data = await response.json();
    } catch (error) {
    }
  };
  const checkAndSendPredefinedMessages = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/check_first_user_message.php?session_id=${sessionId}`);
      const data = await response.json();
      console.log(data);
      if (data.can_send_message) {
        setTimeout(async () => {
          await sendResponseMessage();
        }, 3000); // Delay of 3 seconds
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
  const sendResponseMessage = async () => {
    const responseMessage = "Merci pour votre message ! Nous vous répondrons bientôt 💬.";
    const messageTime = new Date().toISOString();
    try {
      const url = `${BASE_URL}bebeapp/api/Messaging/send_message.php?session_id=${sessionId}&sender_id=123456789&receiver_id=${SENDER_ID}&type=text&message_text=${encodeURIComponent(responseMessage)}&message_time=${encodeURIComponent(messageTime)}&profile_image=https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg&messages_bot=1`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("Response Message Sent:", data);
    } catch (error) {
      console.error("Error sending response message:", error);
    }
  };
  
  useEffect(() => {
    const fetchTokensInterval = setInterval(async () => {
      await fetchNurseTokens();
    }, 1000); // Fetch every second
  
    // Clean up the interval on component unmount
    return () => clearInterval(fetchTokensInterval);
  }, []); // Empty dependency array ensures the effect runs only once after the initial render
  
  const fetchNurseTokens = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/get_nurses_token.php`);
      const data = await response.json();
      if (data.success) {
        setNurseTokens(data.tokens);
      } else {
        console.error("Failed to fetch nurse tokens:", data.message);
      }
    } catch (error) {
      console.error("Error fetching nurse tokens:", error);
    }
  };

  const sendNotification = async (tokens, messageType, messageText) => {
    const message = {
      to: tokens.map(token => `ExponentPushToken[${token}]`) ,
      sound: "default",
      title: user.name + " " + user.surname ,
      body: "a envoyé un message" ,
    };

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

export default InputMessage;
