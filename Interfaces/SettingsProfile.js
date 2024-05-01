import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Image, I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserSettingsModal from "./UserSettingsModal";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const { width } = Dimensions.get("window");

const SettingsProfile = () => {
  const { t, i18n } = useTranslation(); // Access translation function
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

  const openLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const openUserSettingsModal = () => {
    setIsUserSettingsModalOpen(true);
  };

  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer} onPress={openUserSettingsModal}>
        <Ionicons name={isRTL ? "chevron-back" : "settings"} size={15} color="black" style={styles.icon} />
        <Text style={[styles.buttonText, isRTL && styles.textRTL]}>{t('settings.settings')}</Text>
        <Ionicons name={isRTL ? "settings" : "chevron-forward"} size={15} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={openLanguageModal}>
        <Ionicons name={isRTL ? "chevron-back" : "language"} size={15} color="black" style={styles.icon} />
        <Text style={[styles.buttonText, isRTL && styles.textRTL]}>{t('settings.language')}</Text>
        <Ionicons name={isRTL ? "language" : "chevron-forward"} size={15} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.buttonContainer, styles.disconnectButton]} onPress={() => navigation.navigate("InterfaceLogin")}>
        <Ionicons name={isRTL ? "chevron-back" : "power"} size={15} color="white" style={styles.icon} />
        <Text style={[styles.buttonText, styles.disconnectText, isRTL && styles.textRTL]}>{t('settings.disconnect')}</Text>
        <Ionicons name={isRTL ? "power" : "chevron-forward"} size={15} color="white" style={styles.arrowIcon} />
      </TouchableOpacity>

      <Modal visible={isLanguageModalOpen} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.languageButton}>
              <Image source={require("../assets/ar.png")} style={styles.languageIcon} />
              <Text style={styles.languageText}>العربية</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton}>
              <Image source={require("../assets/fr.png")} style={styles.languageIcon} />
              <Text style={styles.languageText}>Français</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton}>
              <Image source={require("../assets/en.png")} style={styles.languageIcon} />
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeLanguageModal}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <UserSettingsModal isVisible={isUserSettingsModalOpen} onClose={() => setIsUserSettingsModalOpen(false)} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f3f5",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: width * 0.9,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
  },
  textRTL: {
    textAlign: 'right',
  },
  arrowIcon: {
    marginLeft: 10,
  },
  disconnectButton: {
    backgroundColor: "#D84374", // Red color for Disconnect button
  },
  disconnectText: {
    color: "#ffffff", // White color for Disconnect button text
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255, 0.9)",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  languageIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  languageText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#D84374",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SettingsProfile;
