// Import the required libraries and components
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import NurseInfoBar from "./NurseInfoBar";
import { UserContext } from "./Backend/UserContext";
import { StatusBar } from "expo-status-bar";
import HeaderNavbar from "./HeaderNavbar";

const NoMessagesFound = () => {
  return (
    <View style={styles.noMessagesContainer}>
      <Text style={styles.noMessagesText}>
        Aucun message pour le moment. Tous les messages seront reçus ici.
      </Text>
    </View>
  );
};

// Main component for the chat list page
const ChatListPage = () => {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const nurseid = user.id ;
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/bebeapp/api/Messaging/get_sessions_messages_nurse.php`);
      if (!response.ok) {
        console.error("Erreur lors de la récupération des données utilisateur :", response.statusText);
        return;
      }
      const responseData = await response.text();
      if (!responseData.trim() || responseData.trim() === "0 résultats") {
        setUserList([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      const data = JSON.parse(responseData);
      data.sort((a, b) => {
        return new Date(a.last_message.message_time) - new Date(b.last_message.message_time);
      });
      data.reverse();
      setUserList(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 3000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const handleUserPress = async (sessionId, sendby, nurseid, sendto ,token_key) => {
    try {
      // API endpoint to update the user2 field
      const apiUrl = `${BASE_URL}bebeapp/api/Messaging/who_nurse_session.php?session_id=${sessionId}&user2_id=${nurseid}`;
      // Make the API call to update the user2 field
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to update user2 field");
      }
      // If user2 updated successfully, navigate to UserMessagesNurse screen
      navigation.navigate('UserMessagesNurse', { sessionId, sendby, nurseid, sendto, from: "nurse" ,token_key});
    } catch (error) {
      console.error("Error updating user2:", error.message);
      // Handle error condition here, if needed
    }
  };

    const handleRefresh = () => {
      setRefreshing(true);
      fetchUserData();
    };
  
const getTimeDifference = (messageTime, messageStatus) => {
  // If message status is "read", always return green color
  if (messageStatus === "read") {
    return "#006400"; // Dark green color
  }

  const adjustedTime = new Date(messageTime);
  adjustedTime.setHours(adjustedTime.getHours() + 1);
  const currentTime = new Date();
  const timeDifference = Math.abs(currentTime - adjustedTime);
  const minutesDifference = Math.floor(timeDifference / (1000 * 60));

  // Check if the time difference is greater than 60 minutes
  if (minutesDifference >= 60) {
    const hoursDifference = Math.floor(minutesDifference / 60);
    return `il y a ${hoursDifference} heures`; // Translated to French
  } else {
    return `il y a ${minutesDifference} minutes`; // Translated to French
  }
};

  
  const getMessageColor = (messageTime, messageStatus) => {
    // If message status is "read", always return green color
    if (messageStatus === "read") {
      return "#006400"; // Dark green color
    }
  
    // Calculate time difference for other cases
    const adjustedTime = new Date(messageTime);
    adjustedTime.setHours(adjustedTime.getHours() + 1);
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime - adjustedTime);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
  
    if (minutesDifference >= 180) {
      return "red"; // Dark red color for more than 3 hours
    } else if (minutesDifference >= 30) {
      return "orange"; // Dark orange color for more than 1 hour
    } else {
      return "#006400"; // Dark green color for more than 30 minutes
    }
  };
  
  
    // Filter user list based on search query
    const filteredUserList = userList.filter(
      (user) =>
        (user.last_message.sender_name && user.last_message.sender_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.last_message.sender_surname && user.last_message.sender_surname.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.last_message && user.last_message.message_text && user.last_message.message_text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    return (
      <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <HeaderNavbar />
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Recherche par nom ..."
              placeholderTextColor="#888" // Placeholder text color
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#000" style={styles.loader} />
          ) : filteredUserList.length === 0 ? (
            <NoMessagesFound />
          ) : (
            <ScrollView
              style={styles.scrollView}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
              {filteredUserList.map((user) => (
               <TouchableOpacity
               key={user.session_id} 
               style={[styles.userContainer, { borderColor: getMessageColor(user.last_message.message_time, user.last_message.status_message) }]}
               onPress={() => handleUserPress(user.session_id , "123456789" , nurseid , user.sender_info.id , user.sender_info.token_key)}
             >
                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/4478/4478097.png" }}
                    style={styles.userImage}
                  />
                  <View style={styles.messageContainer}>
                    <Text style={styles.userName}>{user.sender_info.name} {user.sender_info.surname}</Text>
                    <Text style={styles.lastMessage} numberOfLines={1}>{user.last_message.messenger} : {user.last_message.message_text}</Text>
                    <Text style={[styles.timePassed, { color: getMessageColor(user.last_message.message_time, user.last_message.status_message) }]}>
                      {getTimeDifference(user.last_message.message_time)}
                    </Text> 
                  </View>
                  <Ionicons
                    name={user.session_status === "active" ? user.last_message.status_message === "read" ? "checkmark-done" : "checkmark-outline" : "cloud-offline"} 
                    size={20}
                    color={user.last_message.status_message === "read" ? "#4CAF50" : "#e6acd8"} // Green color if read
                    style={styles.finishedIcon}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        
      </SafeAreaView>
      </>
    );
  };
  
  // Styles for the components
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    contentContainer: {
      flex: 1,
      paddingTop: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 8,
      backgroundColor: "#f8f8f8",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      paddingVertical: 10, // Adjusting vertical padding
    },
    scrollView: {
      flex: 1,
    },
    userContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "#fff",
      borderRadius: 8,
      marginBottom: 12,
      marginHorizontal: 16,
      elevation: 2,
      borderWidth: 2,
    },
    userImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    messageContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    lastMessage: {
      fontSize: 16,
      color: "#777",
      marginTop: 2,
    },
    timePassed: {
      fontSize: 12,
      marginTop: 2,
    },
    readIndicator: {
      marginLeft: "auto",
    },
    loader: {
      marginTop: 20,
    },
    noMessagesContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noMessagesText: {
      fontSize: 18,
      color: "#777",
      textAlign: "center",
    },
    finishedIcon: {
      marginLeft: "auto",
    },
  });
  
  export default ChatListPage;