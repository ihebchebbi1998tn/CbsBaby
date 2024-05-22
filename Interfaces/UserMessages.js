import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  Pressable,
  BackHandler,
} from "react-native";
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";
import InputMessage from "./InputMessage";
import { useRoute } from "@react-navigation/native";
import SearchNurseHeader from "./SearchNurseHeader";
import NurseInfoBar from "./NurseInfoBar";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEnableTranslation } from './Backend/TranslationContext';


const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const route = useRoute();
  const SENDER_ID = user ? user.id : "";
  const { sessionId, sendby, nurseid, sendto } = route.params;
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { enableTranslationsChat } = useEnableTranslation();


  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1200); 
    return () => clearInterval(interval); 
  }, [enableTranslationsChat]);
  
  const fetchMessages = async () => {
    try {
    let url;
    url = `${BASE_URL}bebeapp/api/Messaging/get_messages.php?sender_id=${SENDER_ID}&session_id=${sessionId}&output_language=${user.language}&translations=${enableTranslationsChat}`;
    const response = await fetch(url);
    const data = await response.json();
    setMessages(data);
    handleLastMessage(data[data.length - 1]);
    } catch (error) {}
  };
  const handleLastMessage = async (lastMessage) => {
    try {
      if (
        lastMessage.status_message === "not read" &&
        lastMessage.sender_id !== SENDER_ID
      ) {
        // Mark the last message as read
        const url = `${BASE_URL}bebeapp/api/Messaging/set_message_read.php?message_id=${lastMessage.message_id}`;
        const response = await fetch(url);
        if (response.ok) {
        } else {
        }
      }
    } catch (error) {}
  };

  const handlePostLongPress = (item) => {
    console.log(item);
    if (item.sender_id === SENDER_ID) {
      setSelectedPostId(item.message_id);
      setModalVisible(true);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Messaging/delete_message.php?message_id=${selectedPostId}`,
        {
          method: "PUT", 
        }
      );
      if (response.ok) {
        setModalVisible(false);
      } else {
        console.error("Error updating message status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };


  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.sender_id === SENDER_ID;

    return (
      <TouchableOpacity onLongPress={() => handlePostLongPress(item)}>
        <View
          style={[
            styles.messageContainer,
            isCurrentUser
              ? styles.receiverMessageContainer
              : styles.userMessageContainer,
          ]}
        >
          {!isCurrentUser && (
            <Image
              source={{ uri: item.profile_image || "default_image_url" }}
              style={styles.profilePicture}
              onError={(error) =>
                console.error("Image loading error:", error.nativeEvent.error)
              }
            />
          )}

          <View
            style={[
              styles.messageContent,
              {
                backgroundColor: isCurrentUser
                  ? Colors.messageBackground
                  : Colors.senderBackground,
                alignSelf: isCurrentUser ? "flex-start" : "flex-end",
              },
            ]}
          >
            {item.type === "image" ? (
              <Image
                source={{
                  uri: `${BASE_URL}bebeapp/api/Messaging/${item.message_text}`,
                }}
                style={[styles.messageImage, { aspectRatio: 1 }]}
                onError={(error) =>
                  console.error("Image loading error:", error.nativeEvent.error)
                }
              />
            ) : (
              <Text
                style={[
                  styles.messageText,
                  !isCurrentUser ? { color: Colors.primary } : null,
                ]}
              >
                {item.translated_message}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchNurseHeader sessionId={sessionId} />
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        inverted={true}
      />
      <InputMessage sessionId={sessionId} recieverID="123456789" from="user" />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalDescription}>
            Etes-vous sur de vouloir supprimer ce message?
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteMessage}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Colors = {
  primary: "black",
  background: "#f2f2f2",
  messageBackground: "#D84374",
  senderBackground: "#EFEFEF",
  text: "#fff",
  placeholder: "#757575",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-start",
  },
  receiverMessageContainer: {
    alignSelf: "flex-end",
  },
  profilePicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  messageContent: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    backgroundColor: Colors.messageBackground,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
  },
  messageText: {
    fontSize: 16,
    color: Colors.text, 
  },
  messageDate: {
    fontSize: 12,
    color: Colors.placeholder,
    marginTop: 4,
  },
  messageImage: {
    width: "100%",
    height: undefined,
    borderRadius: 12,
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
});

export default UserMessages;
