import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "./Backend/apiConfig";

const QRCodeIcon = ({ style }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync(); 
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setIsScanning(false); 
    setScannedData(data); 
    console.log(data);
    // Send the scanned data to the backend API
    const response = await fetch(`${BASE_URL}bebeapp/api/authentification/check_maman_qr.php?num_dossier=${data}`);
    const result = await response.json();
    console.log(result);
    if (result.status === "noexist") {
      setModalMessage(t("Sorry, this user does not exist."));
      setModalVisible(true);
    } else if (result.status === false) {
      navigation.navigate('InterfaceLogin', { scannedUsername: result.IPP_Patient });
      /* navigation.navigate('FirstPage', { scannedName: result.nom_maman , scannedId: result.id_maman ,  scannedIPP: result.IPP_Patient  , scannedDN: result.date_naissance }); */
    } else if (result.status === true) {
      navigation.navigate('InterfaceLogin', { scannedUsername: result.IPP_Patient });
    }
  };

  const startScanning = () => {
    setIsScanning(true); 
    setScannedData(null); 
  };

  if (hasPermission === null) {
    return <Text>{t("Requesting for camera permission")}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{t("No access to camera")}</Text>;
  }

  return (
    <View style={styles.container}>
      <Ionicons
        name="qr-code"
        style={[styles.icon, style]}
        onPress={startScanning}
      />
      <Modal
        visible={isScanning}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsScanning(false)}
      >
        <View style={styles.modalContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject} 
          />
          <View style={styles.scanLine}></View> 
        </View>
      </Modal>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#143a7b",
    fontSize: 24,
    position: "absolute",
    right: 10,
    top: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  scanLine: {
    backgroundColor: "rgba(198, 72, 112,0.7)",
    height: 4,
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#143a7b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default QRCodeIcon;
