import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";

const ActifNurse = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Fetch and update nurse status when component mounts
    fetchNurseStatus();
  }, []);

  const fetchNurseStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Nurses/getNurseStatus.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setIsActive(data.isActive);
      } else {
        setIsActive(false); // Set isActive to false by default if status fetch fails
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error fetching nurse status:", error);
      Alert.alert(
        "Error",
        "Failed to fetch nurse status. Please try again later."
      );
    }
  };

  const toggleNurseStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Nurses/toggleNurseStatus.php?id_sagefemme=${user.id}&new_status=${newStatus}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setIsActive(newStatus === 1);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error toggling nurse status:", error);
      Alert.alert(
        "Error",
        "Failed to toggle nurse status. Please try again later."
      );
    }
  };

  const confirmSetActive = () => {
    Alert.alert(
      "Confirmation",
      "Confirmer vous rendra actif et capable de répondre aux messages, acceptez-vous ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            toggleNurseStatus(1);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmSetInactive = () => {
    Alert.alert(
      "Confirmation",
      "Confirmer vous rendra inactif et incapable de répondre aux messages, acceptez-vous ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            toggleNurseStatus(0);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.segmentedControl}>
      <TouchableOpacity
        style={[styles.segment, !isActive ? styles.activeSegment : null]}
        onPress={confirmSetInactive}
      >
        <Text
          style={[
            styles.segmentText,
            !isActive ? styles.activeSegmentText : null,
          ]}
        >
          Inactif
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.segment, isActive ? styles.activeSegment : null]}
        onPress={confirmSetActive}
      >
        <Text
          style={[
            styles.segmentText,
            isActive ? styles.activeSegmentText : null,
          ]}
        >
          Actif
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8bcbd3",
    overflow: "hidden",
    width: "100%",
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  activeSegment: {
    backgroundColor: "#8bcbd3",
  },
  segmentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#163878",
  },
  activeSegmentText: {
    color: "#fff",
  },
});

export default ActifNurse;
