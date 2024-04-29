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
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import CustomHeader from "./CustomHeader";

// Component for displaying when no messages are found
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
const InterfaceClientMessages = () => {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);


  // Function to fetch user data from the backend
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/get_sessions_messages_mom.php?user_id=${user.id}`);
      if (!response.ok) {
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
      setUserList(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    }
  }, );

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 3000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const handleUserPress = (sessionId, sendby) => {
    navigation.navigate('UserMessagesOld', { sessionId, sendby });
  };
  // Function to handle refresh event
  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing to true when refresh starts
    await fetchUserData(); // Fetch user data
    setRefreshing(false); // Set refreshing to false when refresh ends
  };
  // Function to calculate time difference and return string in French
  const getTimeDifference = (messageTime) => {
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

  // Function to determine message color based on time difference
  const getMessageColor = (messageTime) => {
    const adjustedTime = new Date(messageTime);
    adjustedTime.setHours(adjustedTime.getHours() + 1);
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime - adjustedTime);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference >= 180) {
      return "#006400"; // Dark red color for more than 3 hours
    } else if (minutesDifference >= 60) {
      return "#006400"; // Dark orange color for more than 1 hour
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
    <SafeAreaView style={styles.container}>
      <CustomHeader />
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} // Pass handleRefresh function
            >
            {filteredUserList.map((user) => (
              <TouchableOpacity
                key={user.session_id}
                style={[styles.userContainer, { borderColor: getMessageColor(user.last_message.message_time) }]}
                onPress={() => handleUserPress(user.session_id, "123456789")}
              >
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/4598/4598770.png" }}
                  style={styles.userImage}
                />
                <View style={styles.messageContainer}>
                <Text style={styles.userName}>CBS bébé : Session {user.last_message.message_time.substring(0, 10)}  </Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>{user.last_message.messenger} : {user.last_message.message_text}</Text>
                  <Text style={[styles.timePassed, { color: getMessageColor(user.last_message.message_time) }]}>
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
    fontSize: 16,
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

export default InterfaceClientMessages;
