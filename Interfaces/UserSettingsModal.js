import React, { useState, useContext } from "react";
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { UserContext } from "./Backend/UserContext";
import { BASE_URL } from "./Backend/apiConfig";

const UserSettingsModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  // Initialize state with user's current information
  const [nomMaman, setNomMaman] = useState(user.name);
  const [prenomMaman, setPrenomMaman] = useState(user.surname);
  const [dateNaissance, setDateNaissance] = useState(user.birthday);
  const [telMaman, setTelMaman] = useState(user.phone_number);
  const [numDossier, setNumDossier] = useState(user.IPP_Patient);
  const [passwordMaman, setPasswordMaman] = useState(user.password_maman);
  const [userName, setUserName] = useState(t('settings.username'));

  const handleSaveSettings = () => {
    // Check if user has made any changes
    if (
      telMaman === user.phone_number &&
      passwordMaman === user.password_maman
    ) {
      onClose();
      return;
    }

    Alert.alert(
      t('settings.confirmation'),
      t('settings.confirmUpdateTitle'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.ok'),
          onPress: () => {
            const requestData = {
              user_id: user.id,
              tel_maman: telMaman,
              password_maman: passwordMaman,
            };

            fetch(`${BASE_URL}/bebeapp/api/profile/update_user.php`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData),
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                onClose(); 
              } else {
                alert(data.error); 
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{t('settings.user')}</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person" size={24} color="#D84374" />
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              placeholder={t('settings.name')}
              value={nomMaman}
              onChangeText={setNomMaman}
              editable={false}
            />
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              placeholder={t('settings.firstName')}
              value={prenomMaman}
              onChangeText={setPrenomMaman}
              editable={false}
            />
          </View>

         {/*  <View style={styles.inputContainer}>
            <Ionicons name="person-circle" size={24} color="#D84374" />
            <TextInput
              style={styles.input}
              placeholder={t('settings.username')}
              value={userName}
              onChangeText={setUserName}
            />
          </View>
 */}
          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={24} color="#D84374" />
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              placeholder={t('settings.dob')}
              value={dateNaissance}
              onChangeText={setDateNaissance}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call" size={24} color="#D84374" />
            <TextInput
              style={styles.input}
              placeholder={t('settings.phone')}
              value={telMaman}
              onChangeText={setTelMaman}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="document-text" size={24} color="#D84374" />
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              placeholder={t('settings.fileNumber')}
              value={numDossier}
              onChangeText={setNumDossier}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={24} color="#D84374" />
            <TextInput
              style={styles.input}
              placeholder={t('settings.password')}
              secureTextEntry={true}
              value={passwordMaman}
              onChangeText={setPasswordMaman}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Ionicons name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255, 0.9)",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#FF4081",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default UserSettingsModal;
