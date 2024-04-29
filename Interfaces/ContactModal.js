import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

const ContactModal = ({ isVisible, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" style={styles.closeIcon} />
          </TouchableOpacity>
          <Image
            source={require("../assets/logoclinique.png")}
            style={styles.headerImage}
          />
          <Text style={styles.modalTitle}>{t('contactModal.clinicName')}</Text>
          <View style={styles.infoContainer}>
            <Ionicons name="call" style={[styles.icon, { color: "#D84374" }]} />
            <TouchableOpacity onPress={() => Linking.openURL("tel:70220000")}>
              <Text style={styles.modalText}>70 220 000</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() =>
              Linking.openURL(
                "https://www.google.com/maps/place/Rte+GP1+-+Km+6,+Megrine+2033"
              )
            }
          >
            <Ionicons name="location" style={[styles.icon, { color: "#D84374" }]} />
            <Text style={styles.modalText}>{t('contactModal.address')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() =>
              Linking.openURL("https://www.cliniquebeausejour.tn/")
            }
          >
            <Ionicons name="globe" style={[styles.icon, { color: "#D84374" }]} />
            <Text style={styles.modalText}>www.cliniquebeausejour.tn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.closeModalButton, { backgroundColor: "#D84374" }]} onPress={onClose}>
            <Text style={styles.closeModalText}>{t('contactModal.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  headerImage: {
    width: "80%",
    height: 80,
    marginBottom: 20,
    resizeMode: "contain",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#D84374",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  closeModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  closeModalText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: "#D84374",
  },
});

export default ContactModal;
