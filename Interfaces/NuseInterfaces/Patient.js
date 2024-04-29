import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../Backend/apiConfig";
import NurseInfoBar from "../NurseInfoBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HeaderNavbar from "../HeaderNavbar";
import { useNavigation } from "@react-navigation/native";

const Patient = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedBy, setSortedBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortByDate, setSortByDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Nurses/fetch_patients.php`
      );
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const sortPatients = (data, sortBy, order) => {
    const sortedData = [...data].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "birthday") {
        comparison = new Date(a[sortBy]) - new Date(b[sortBy]);
      } else {
        if (a[sortBy] > b[sortBy]) {
          comparison = 1;
        } else if (a[sortBy] < b[sortBy]) {
          comparison = -1;
        }
      }
      return order === "asc" ? comparison : -comparison;
    });
    return sortedData;
  };

  const handleSort = (sortBy) => {
    if (sortBy === "birthday") {
      setSortByDate(true);
    } else {
      setSortByDate(false);
      const newSortOrder =
        sortedBy === sortBy && sortOrder === "asc" ? "desc" : "asc";
      setSortedBy(sortBy);
      setSortOrder(newSortOrder);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.surname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPatients = sortPatients(filteredPatients, sortedBy, sortOrder);

  const renderPatientItem = ({ item }) => {
    if (!item) {
      return null; // or handle the case when item is null
    }

    const handlePatientPress = () => {
      setSelectedPatient(item);
      setModalVisible(true); // Open the modal
    };

    return (
      <TouchableOpacity style={styles.patientCard} onPress={handlePatientPress}>
        <View style={styles.patientInfoContainer}>
          <FontAwesome
            name="user"
            size={24}
            color="#c64870"
            style={styles.patientIcon}
          />
          <Text style={styles.patientName}>
            {item.name} {item.surname}
          </Text>
        </View>
        <Text style={styles.patientInfo}>Phone: {item.phone_number}</Text>
        <Text style={styles.patientInfo}>Birthday: {item.birthday}</Text>
      </TouchableOpacity>
    );
  };
  
  const renderModalContent = () => {
    if (!selectedPatient) {
      return null;
    }

    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {selectedPatient.name} {selectedPatient.surname}
        </Text>
        <Text style={styles.modalText}>Numéro de dossier : {selectedPatient.file_number}</Text>
        <Text style={styles.modalText}>Téléphone : {selectedPatient.phone_number}</Text>
        <Text style={styles.modalText}>Date de naissance : {selectedPatient.birthday}</Text>
        <Text style={styles.modalText}>Pays : {selectedPatient.country}</Text>
        <Text style={styles.modalText}>Adresse : {selectedPatient.address}</Text>
        <Text style={styles.modalText}>Date de création : {selectedPatient.date_created}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c64870" />
      </View>
    );
  }

  const handleGoBack = () => {
    navigation.navigate('InterfaceHomeNurse'); // Navigate back to InterfaceHomeNurse
  };


  return (
    <>
    <StatusBar backgroundColor="#c64870" barStyle="light-content" />
    <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}> 
    <HeaderNavbar />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom ou prénom"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => handleSort("birthday")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={sortByDate ? "arrow-up" : "arrow-down"}
              style={styles.sortIcon}
            />
            <Ionicons
              name="calendar"
              style={[styles.sortIcon, styles.calendarIcon]}
            />
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContentContainer}>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.floatingButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
    </SafeAreaView>
    </>
  );
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sortButton: {
    padding: 10,
    backgroundColor: "#c64870",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  sortIcon: {
    fontSize: 20,
    color: "#fff",
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius:    10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c64870",
    marginBottom: 5,
  },
  patientInfo: {
    fontSize: 16,
    color: "#666",
  },
  flatListContainer: {
    flexGrow: 1,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginLeft: 5,
  },
  patientInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientIcon: {
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#c64870",
    marginBottom: 10,
    textAlign: "center", // Center the modal title
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#c64870",
    paddingVertical: 12, // Increase padding
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: height * 0.02,
    left: width * 0.05,
    backgroundColor: "rgba(199,73,112,0.7)",
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Patient;

