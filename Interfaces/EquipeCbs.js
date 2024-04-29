import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HeaderNavbar from "./HeaderNavbar";

const EquipeCbs = ({ navigation }) => {
  const [matricule, setMatricule] = useState("");
  const [nomPrenom, setNomPrenom] = useState("");
  const [role, setRole] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [sagefemmes, setSagefemmes] = useState([]); // State to hold sagefemmes data

  const handleAddSagefemme = () => {
    console.log("Matricule:", matricule);
    console.log("Nom et Prénom:", nomPrenom);
    console.log("Role:", role);
    console.log("Créé par:", createdBy);
    
    // Here you can add logic to update the sagefemmes data with the new sagefemme
    
    // Example: 
    const newSagefemme = {
      id: sagefemmes.length + 1,
      matricule: matricule,
      nomPrenom: nomPrenom,
      role: role,
      createdBy: createdBy
    };

    setSagefemmes([...sagefemmes, newSagefemme]);
  };

  // Dummy data for demonstration
  const dummySagefemmes = [
    { id: 1, matricule: "12345", nomPrenom: "Alice Smith", role: "Sage-femme", createdBy: "Admin" },
    { id: 2, matricule: "67890", nomPrenom: "Bob Johnson", role: "Midwife", createdBy: "Supervisor" },
    // Add more dummy data here if needed
  ];

  const handleViewDetails = (sagefemme) => {
    // Handle viewing details of sagefemme
    console.log("View details:", sagefemme);
  };

  const handleDeactivate = (sagefemme) => {
    // Handle deactivating sagefemme
    console.log("Deactivate:", sagefemme);
  };

  const handleModify = (sagefemme) => {
    // Handle modifying sagefemme
    console.log("Modify:", sagefemme);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <HeaderNavbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Your existing content */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Ajouter une Sage-femme</Text>
          <View style={{...styles.inputContainer, marginTop: 20}}> 
            <Ionicons name="document-text" size={24} color="#8bcbd3" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Matricule"
              value={matricule}
              onChangeText={setMatricule}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={24} color="#8bcbd3" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nom et Prénom"
              value={nomPrenom}
              onChangeText={setNomPrenom}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="briefcase" size={24} color="#8bcbd3" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Rôle"
              value={role}
              onChangeText={setRole}
            />
          </View>
          <View style={{...styles.inputContainer, marginBottom: 20}}> 
            <Ionicons name="person" size={24} color="#8bcbd3" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Créé par"
              value={createdBy}
              onChangeText={setCreatedBy}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddSagefemme}>
            <Text style={styles.buttonText}>Ajouter Sage-femme</Text>
          </TouchableOpacity>
        </View>

        {/* Cool Table of Sagefemmes */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Liste des Sage-femmes</Text>
          <FlatList
            data={sagefemmes.length > 0 ? sagefemmes : dummySagefemmes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.matricule}</Text>
                <Text style={styles.cell}>{item.nomPrenom}</Text>
                <Text style={styles.cell}>{item.role}</Text>
                <Text style={styles.cell}>{item.createdBy}</Text>
                <TouchableOpacity onPress={() => handleViewDetails(item)}>
                  <Ionicons name="eye" size={24} color="#8bcbd3" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeactivate(item)}>
                  <Ionicons name="close-circle" size={24} color="#D84374" style={styles.actionIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModify(item)}>
                  <Ionicons name="create" size={24} color="#163878" style={styles.actionIcon} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#163878",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  tableContainer: {
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
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#163878",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  actionIcon: {
    marginHorizontal: 5,
  },
});

export default EquipeCbs;
