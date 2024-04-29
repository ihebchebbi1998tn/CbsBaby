import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Image } from "react-native";
import { BASE_URL } from "./Backend/apiConfig";
import ProfilePicture from "../assets/Images/nurseimage.jpg";

const SearchNurseHeader = ({ sessionId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nurseData, setNurseData] = useState(null);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sessionId) {
          console.warn("sessionId is undefined");
          return;
        }
        const response = await fetch(
          `${BASE_URL}bebeapp/api/Messaging/check_sage_femme.php?session_id=${sessionId}`
        );
        const dataText = await response.text();
        
        if (dataText === "User2 is not assigned yet") {
          if (!offline) {
            setIsLoading(true);
            setTimeout(() => {
              setOffline(true);
              setIsLoading(false);
            }, 5000);
          }
          return;
        }
        
        const nurseData = JSON.parse(dataText);
        setIsLoading(false);
        setNurseData(nurseData);
        setOffline(false);
      } catch (error) {
      }
    };

    fetchData(); // Initial fetch
  
    const intervalId = setInterval(fetchData, 4000); // Fetch data every 4 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [sessionId, offline]);
  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={offline ? "red" : "#c74970"} />
      ) : error ? (
        <Text style={styles.errorText}>Erreur: {error.message}</Text>
      ) : nurseData ? (
        <View style={styles.profileContainer}>
          <View style={[styles.activeIndicator, { backgroundColor: offline ? "red" : "green" }]} />
          <Image source={ProfilePicture} style={styles.profilePicture} />
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>Nom: {nurseData.nomprenom_sagefemme}</Text>
            <Text style={styles.idText}>ID: {nurseData.matricule_sagefemme}</Text>
          </View>
        </View>
      ) : offline ? (
        <View style={styles.profileContainer}>
        <View style={[styles.activeIndicator, { backgroundColor: offline ? "red" : "green" }]} />
        <Image source={ProfilePicture} style={styles.profilePicture} />
        <View style={styles.textContainer}>
          <Text style={styles.offlineText}>Nous sommes hors ligne.</Text>
        </View>
      </View>
        
      ) : (
        <Text style={styles.offlineText}>Aucun utilisateur trouvé pour le moment. Veuillez patienter.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 15,
    paddingBottom: 7,
    paddingTop: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999, // Ensure it appears above other content
  },
  loader: {
    alignSelf: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  activeIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    position: "absolute",
    top: 5,
    right: 5,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  idText: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    alignSelf: "center",
    color: "red",
  },
  offlineText: {
    alignSelf: "center",
    color: "#666",
    fontStyle: "italic",
  },
});

export default SearchNurseHeader;
