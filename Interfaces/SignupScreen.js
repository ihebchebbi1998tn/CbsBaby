import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "./Backend/apiConfig";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

const EcranInscription = () => {
  const [prenomMaman, setPrenomMaman] = useState("");
  const [nomMaman, setNomMaman] = useState("");
  const [telMaman, setTelMaman] = useState("");
  const [ippPatient, setIppPatient] = useState("");
  const [langue, setLangue] = useState("fr");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateNaissance, setDateNaissance] = useState(null); // or useState("");
  console.log(dateNaissance);
  const navigation = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    hideDatePicker();
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setDateNaissance(formattedDate);
  };

  const handleInscription = async () => {
    // Validation
    if (
      !prenomMaman ||
      !nomMaman ||
      !telMaman ||
      !ippPatient ||
      !dateNaissance ||
      !langue
    ) {
      setModalMessage("Veuillez remplir tous les champs.");
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}bebeapp/api/authentification/signup.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            nom_maman: nomMaman,
            prenom_maman: prenomMaman,
            tel_maman: telMaman,
            IPP_Patient: ippPatient,
            langue: langue,
            date_naissance: dateNaissance,
          }).toString(),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setModalMessage(data.message);
      } else {
        setModalMessage(data.message || "Erreur lors de l'inscription.");
      }
      setModalVisible(true);
    } catch (error) {
      setModalMessage("Erreur lors de l'inscription.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#d84374" barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require("../assets/bglogin.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <View style={styles.row}>
              <View
                style={[styles.inputContainer, { flex: 1, marginRight: 5 }]}
              >
                <Ionicons name="person-outline" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  placeholderTextColor="#d84374"
                  value={prenomMaman}
                  onChangeText={(text) => setPrenomMaman(text)}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 5 }]}>
                <Ionicons name="person-outline" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  placeholderTextColor="#d84374"
                  value={nomMaman}
                  onChangeText={(text) => setNomMaman(text)}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                placeholderTextColor="#d84374"
                value={telMaman}
                onChangeText={(text) => setTelMaman(text)}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" style={styles.icon} />
              <TextInput
                style={styles.input}
              placeholder="N° Dossier Patient"
                placeholderTextColor="#d84374"
                value={ippPatient}
                onChangeText={(text) => setIppPatient(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" style={styles.icon} />
              <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                  style={styles.input}
                  placeholder="Date de naissance"
                  placeholderTextColor="#163878"
                  value={dateNaissance}
                  editable={false}
                  onPress={showDatePicker}
                />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                locale="fr-FR"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="globe-outline" style={styles.icon} />
              <Picker
                selectedValue={langue}
                style={styles.picker}
                onValueChange={(itemValue) => setLangue(itemValue)}
              >
                <Picker.Item label="Français" value="fr" />
                <Picker.Item label="عربي" value="ar" />
                <Picker.Item label="English" value="en" />
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleInscription}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.signupButtonText}>Créer un compte</Text>
                <Ionicons name="person-add-outline" style={styles.iconbutton} />
              </View>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("InterfaceLogin")}
              >
                <Text style={styles.signupLink}>Connexion</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: "10%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 1,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  inputContainer: {
    alignItems: "center",
    width: "100%",
    borderColor: "#d84374",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    height: 20,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#163878",
  },
  icon: {
    color: "#d84374",
    fontSize: 24,
    marginLeft: 5,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 15,
    color: "#163878",
  },
  signupButton: {
    backgroundColor: "#163878",
    padding: 13,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    marginRight: 5,
  },
  iconbutton: {
    color: "#90ced3",
    fontSize: 18,
  },
  signupContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    color: "#d84374",
    fontSize: 14,
  },
  signupLink: {
    color: "#163878",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#163878",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#90ced3",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 20,
  },
  textStyle: {
    color: "#d84374",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 0,
    textAlign: "center",
    fontSize: 16,
    color: "#ffffff",
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: "#163878",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});

export default EcranInscription;

