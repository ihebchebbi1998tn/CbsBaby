import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItSupport = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (text) => {
    setProblemDescription(text);
  };

  const handleSubmit = () => {
    // You can handle the submission of the problem description here
    console.log('Submitted problem description:', problemDescription);
    closeModal();
  };

  return (
   <>
      <TouchableOpacity style={styles.popupButton} onPress={openModal}>
        <Ionicons name="help-circle-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Problème technique</Text>
      </TouchableOpacity>
      
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#c74970" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Problème technique</Text>
            <TextInput
              style={styles.input}
              multiline={true}
              placeholder="Description du problème"
              onChangeText={handleInputChange}
              value={problemDescription}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </>
  );
};

const styles = StyleSheet.create({

  popupButton: {
    position: 'absolute',
    bottom: '10%',
    right: 10,
    backgroundColor: 'rgba(199,73,112,0.6)', // More pink color
    borderRadius: 20, // Adjust the border radius for a more rounded appearance
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1, // Ensure the button is on top
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    margin: 20,
    width: "80%",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#c74970',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#c74970',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItSupport;
