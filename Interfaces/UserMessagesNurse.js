import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";
import InputMessage from "./InputMessage";
import { useRoute } from "@react-navigation/native";
import SearchNurseHeader from "./SearchNurseHeader";
import NurseInfoBar from "./NurseInfoBar";
import InputMessageNurse from "./InputMessageNurse";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import HeaderNavbar from "./HeaderNavbar";
import CustomHeader from "./CustomHeader";
import CustomHeaderChatNurse from "./CustomHeaderChatNurse";
import ClientInfo from "./ClientInfo";
import { useEnableTranslation } from './Backend/TranslationContext';

const UserMessagesNurse = ( ) => {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const route = useRoute();
  const SENDER_ID = "123456789";
  const { sessionId, sendby, nurseid, sendto , token_key } = route.params;
  const { enableTranslationsChat } = useEnableTranslation();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1200); 
    return () => clearInterval(interval); 
  }, [enableTranslationsChat]);

  const fetchMessages = async () => {
    try {
      let url;
      url = `${BASE_URL}bebeapp/api/Messaging/get_messages.php?sender_id=${SENDER_ID}&session_id=${sessionId}&output_language=ar&translations=${enableTranslationsChat}`;
    
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
      handleLastMessage(data[data.length - 1]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const handleLastMessage = async (lastMessage) => {
    try {
      if (lastMessage.status_message === "not read" && lastMessage.sender_id !== SENDER_ID) {
        // Mark the last message as read
        const url = `${BASE_URL}bebeapp/api/Messaging/set_message_read.php?message_id=${lastMessage.message_id}`;
        const response = await fetch(url);
        if (response.ok) {

        } else {
        }
      }
    } catch (error) {
      console.error("Error handling last message:", error);
    }
  };
  
  
  const renderMessageItem = ({ item }) => {
    const messageDate = new Date(item.message_time);
    const formattedTime = messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isCurrentUser = item.sender_id === SENDER_ID;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser
            ? styles.userMessageContainer
            : styles.receiverMessageContainer,
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
              alignSelf: isCurrentUser ? "flex-end" : "flex-start",
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
              {item.message_text}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
         <>
    <StatusBar backgroundColor="#D84374" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}> 
     <CustomHeaderChatNurse />
     <ClientInfo receiverID={sendto} />
    <View style={styles.contentContainer}>

          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => index.toString()}
            inverted={true}
          />
        <InputMessageNurse sessionId={sessionId} recieverID={sendto} from="nurse" token_key={token_key}/>
        </View>
      </SafeAreaView>
    </>
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

  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  receiverMessageContainer: {
    alignSelf: "flex-start",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 0,
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
});

export default UserMessagesNurse;
