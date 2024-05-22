import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator } from "react-native";
import ProfilePicture from "../assets/Images/momimage.png";
import { BASE_URL } from "./Backend/apiConfig";
const ClientInfo = ({ receiverID }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = `${BASE_URL}bebeapp/api/Nurses/get_infoclient.php?user_id=${receiverID}`;
    fetch(apiUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setClientData(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  });
  
 // Function to format language
 const formatLanguage = (language) => {
  switch (language) {
    case "ar":
      return "Arabe";
    case "fr":
      return "Français";
    case "en":
      return "Anglais";
    default:
      return language;
  }
};

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  if (!clientData) {
    return (
      <View style={styles.container}>
        <Text>Error: Unable to fetch client data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={ProfilePicture} style={styles.profilePicture} />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>Nom : {clientData.nom_maman} {clientData.prenom_maman}</Text>
          <Text style={styles.infoText}>Date de naissance : {clientData.date_naissance}</Text>
          <Text style={styles.infoText}>Numéro de contact : {clientData.tel_maman}</Text>
          <Text style={styles.infoText}>Numéro de dossier : {clientData.IPP_Patient}</Text>
          <Text style={styles.infoText}>Langue : {formatLanguage(clientData.langue)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 15,
    paddingBottom: 7,
    paddingTop: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100, // Adjust the height as needed
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});

export default ClientInfo;
