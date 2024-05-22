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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../Backend/apiConfig";
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
  const [selectedAction, setSelectedAction] = useState(null);
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

  const handleAction = async (item, action) => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Nurses/status_patient.php?id=${item.id}&action=${action}`);
      const data = await response.text();
      console.log(data);
      if (data === 'Action performed successfully!') {
        // Update the local state based on the action
        if (action === 'delete') {
          setPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.id !== item.id)
          );
        } else if (action === 'confirmer') {
          setPatients((prevPatients) =>
            prevPatients.map((patient) =>
              patient.id === item.id ? { ...patient, status: '1' } : patient
            )
          );
        }
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleDelete = (item) => {
    setSelectedPatient(item);
    setSelectedAction('delete');
    setModalVisible(true);
  };

  const handleValidate = (item) => {
    setSelectedPatient(item);
    setSelectedAction('confirmer');
    setModalVisible(true);
  };

  const handleConfirmAction = () => {
    if (selectedPatient && selectedAction) {
      handleAction(selectedPatient, selectedAction);
      setModalVisible(false);
    }
  };

  const renderPatientItem = ({ item }) => {
    if (!item) return null;

    return (
      <TouchableOpacity style={styles.patientCard}>
        <View style={styles.patientInfoContainer}>
          <View style={styles.patientTextContainer}>
            <FontAwesome name="user" size={24} color="#c64870" style={styles.patientIcon} />
            <Text style={styles.patientName}>
              {item.nom_maman} {item.prenom_maman}
            </Text>
          </View>
          {item.status === '0' && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.validateButton} onPress={() => handleValidate(item)}>
                <Text style={styles.validateButtonText}>Confirmer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                <Ionicons name="trash-bin" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Text style={styles.patientInfo}>Téléphone: {item.tel_maman}</Text>
        <Text style={styles.patientInfo}>Date de naissance: {item.date_naissance}</Text>
        <Text style={styles.patientInfo}>IPP: {item.IPP_Patient}</Text>
        <Text style={styles.patientInfo}>Créé le: {item.created_at}</Text>
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => {
    if (!selectedPatient) {
      return null;
    }

    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>Êtes-vous sûr de vouloir {selectedAction === 'delete' ? 'supprimer' : 'confirmer'} le compte de {selectedPatient.nom_maman} {selectedPatient.prenom_maman} ?</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAction}>
            <Text style={styles.buttonText}>Confirmer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
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
    navigation.navigate('InterfaceHomeNurse');
  };

  return (
    <>
      <StatusBar  barStyle="light-content" />
      <SafeAreaView style={styles.container}>
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
            <Ionicons
              name={sortByDate ? "arrow-up" : "arrow-down"}
              style={styles.sortIcon}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={patients}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#c64870',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortIcon: {
    fontSize: 20,
    color: '#fff',
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  patientInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c64870',
    marginLeft: 10,
  },
  patientInfo: {
    fontSize: 16,
    color: '#666',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  calendarIcon: {
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#cc0000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  validateButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  validateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#cc0000',
    padding: 8,
    borderRadius: 5,
  },
  patientIcon: {
    marginRight: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Patient;
