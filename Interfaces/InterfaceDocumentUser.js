import React, { useState, useEffect , useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import CustomHeader from './CustomHeader';
import BottomNavbar from './BottomNavbar';
import { BASE_URL } from './Backend/apiConfig';
import { UserContext } from "./Backend/UserContext";
import { useTranslation } from 'react-i18next';


const InterfaceDocumentUser = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { t, i18n } = useTranslation(); // Access translation function

  const documents = [
    { name: 'Une pièce d’identitéé', translatedName: t('Document.pieceidentite'), icon: 'file-text' },
    { name: 'Prise en charge sécurité sociale et/ou assurance complémentaire convention pré établi', translatedName: t('Document.priseEnCharge'), icon: 'file-text' },
    { name: 'Carte de groupe sanguin', translatedName: t('Document.bloodtype'), icon: 'file-text' },
];


  const [completedDocuments, setCompletedDocuments] = useState([]);
  const progressPercentage = Math.round((completedDocuments.length / documents.length) * 100);

  useEffect(() => {
    checkAllTaskStatus();
  }, []);

  const handleDocumentClick = async (documentName) => {
    const isCompleted = completedDocuments.includes(documentName);
    if (isCompleted) {
      const updatedDocuments = completedDocuments.filter(doc => doc !== documentName);
      setCompletedDocuments(updatedDocuments);
      updateDocumentStatus(documentName, "Uncompleted");
    } else {
      setCompletedDocuments([...completedDocuments, documentName]);
      updateDocumentStatus(documentName, "Completed");
    }
  };

  const updateDocumentStatus = async (documentName, status) => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/todolist_add.php?categorytodo=Les%20documents%20%C3%A0%20apporter&name_todo=${encodeURIComponent(documentName)}&status=${status}&user=${user.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
    }
  };

  const checkAllTaskStatus = async () => {
    try {
      const updatedCompletedDocuments = [];
      for (const document of documents) {
        const taskStatus = await checkTaskStatus(document.name);
        if (taskStatus) {
          updatedCompletedDocuments.push(document.name);
        }
      }
      setCompletedDocuments(updatedCompletedDocuments);
    } catch (error) {
    }
  };

  const checkTaskStatus = async (taskName) => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/get_lists_todo.php?user=${user.id}&task_name=${encodeURIComponent(taskName)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.task_completed;
    } catch (error) {
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: completedDocuments.includes(item.name) ? '#E0E0E0' : '#FFFFFF' },
      ]}
      onPress={() => handleDocumentClick(item.name)}
    >
      <Icon name={item.icon} size={24} color="#d94274" style={styles.icon} />
      <Text style={[styles.documentText, { color: completedDocuments.includes(item.name) ? '#616161' : '#333333' }]}>{item.translatedName}</Text>
      {completedDocuments.includes(item.name) && (
        <View style={styles.completedOverlay}>
          <Text style={styles.completedText}>Complété ✔</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader />
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={30} color="#d94274" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.heading}>
           {t('Document.title')}  
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: '#E91E63',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={documents}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 5 }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop :15,
    color: '#333333',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    padding: 15,
  },
  icon: {
    marginRight: 15,
  },
  documentText: {
    flex: 1,
    fontSize: 18,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(31,54,117 ,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  completedText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBarContainer: {
    backgroundColor: '#dd94274',
    height: 10,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarBackground: {
    backgroundColor: '#BDBDBD',
    height: '100%',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E91E63',
  },
  goBackButton: {
    position: 'absolute',
    top: "13%",
    left: 20,
    zIndex: 1,
  },
});

export default InterfaceDocumentUser;
