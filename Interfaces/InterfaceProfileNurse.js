import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "./Backend/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./Backend/apiConfig";
import { StatusBar } from "expo-status-bar";
import BottomNavbarNurse from "./BottomNavbarNurse";
import HeaderNavbar from "./HeaderNavbar";

const InterfaceProfileNurse = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [updatedPass, setUpdatedPass] = useState("");
  const [confirmUpdatedPass, setConfirmUpdatedPass] = useState("");
  const [updatedNomprenom, setUpdatedNomprenom] = useState(user.name);
  const [updatedMatricule, setUpdatedMatricule] = useState(user.id);

  const handleUpdate = () => {
    // Check if any of the input fields are empty
    if (!updatedPass || !confirmUpdatedPass || !updatedNomprenom || !updatedMatricule) {
      showAlert("Erreur", "Veuillez remplir tous les champs !");
      return;
    }

    if (updatedPass !== confirmUpdatedPass) {
      showAlert("Erreur", "Les mots de passe ne correspondent pas !");
      return;
    }

    const url = `${BASE_URL}bebeapp/api/Nurses/update_nurseprofile.php?id_sagefemme=${user.id}&pass_sagefemme=${updatedPass}&matricule_sagefemme=${updatedMatricule}&nomprenom_sagefemme=${updatedNomprenom}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Le serveur n'a pas répondu correctement");
        }
        return response.text();
      })
      .then((responseData) => {
        if (responseData.trim() === "Record updated successfully") {
          showAlert("Succès", "Profil mis à jour avec succès !", "green");
        } else {
          showAlert("Erreur", "Échec de la mise à jour du profil !");
        }
      })
      .catch((error) => {
        console.error(error);
        showAlert("Erreur", "Une erreur s'est produite lors de la mise à jour du profil !");
      });
  };

  const showAlert = (title, message, color = "red") => {
    Alert.alert(title, message, [{ text: "OK", style: "cancel", color }]);
  };

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <HeaderNavbar />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Profil</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#8bcbd3" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nouveau Nom et Prénom"
                value={updatedNomprenom}
                onChangeText={setUpdatedNomprenom}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#8bcbd3" style={styles.icon} />
              <TextInput
                style={styles.input}
                value={user.username}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={24} color="#8bcbd3" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nouveau Mot de Passe"
                secureTextEntry
                onChangeText={setUpdatedPass}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={24} color="#8bcbd3" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer Nouveau Mot de Passe"
                secureTextEntry
                onChangeText={setConfirmUpdatedPass}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="document-text" size={24} color="#8bcbd3" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Matricule"
                value={updatedMatricule}
                onChangeText={setUpdatedMatricule}
                editable={false}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Mettre à jour</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomNavbarNurse />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#163878",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#8bcbd3",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    color: "#8bcbd3",
  },
  button: {
    backgroundColor: "#D84374",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default InterfaceProfileNurse;
