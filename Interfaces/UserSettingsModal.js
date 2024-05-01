import React, { useState } from "react";
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const UserSettingsModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation(); // Access translation function

  const [nomMaman, setNomMaman] = useState(t('settings.name')); // Translate initial values
  const [prenomMaman, setPrenomMaman] = useState(t('settings.firstName'));
  const [dateNaissance, setDateNaissance] = useState(t('settings.dob'));
  const [telMaman, setTelMaman] = useState(t('settings.phone'));
  const [numDossier, setNumDossier] = useState(t('settings.fileNumber'));
  const [passwordMaman, setPasswordMaman] = useState(t('settings.password')); 
  const [userName, setUserName] = useState(t('settings.username'));

  const handleSaveSettings = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
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
          <View style={styles.inputContainer}>
            <Ionicons name="person-circle" size={24} color="#D84374" />
            <TextInput
              style={styles.input}
              placeholder={t('settings.username')}
              value={userName}
              onChangeText={setUserName}
            />
          </View>
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
      </TouchableOpacity>
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
