import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import CustomHeader from './CustomHeader';

const HelpTipsPage = () => {
  const posts = [
    {
      id: 1,
      title: 'Comment Garder Vos Plantes en Vie',
      content: 'Apprenez les secrets pour maintenir vos plantes d\'intérieur en pleine santé !',
    },
    
  ];
  const navigation = useNavigation();

  // Function to generate a random image URL
  const getRandomImageUrl = () => {
    const randomId = Math.floor(Math.random() * 1000); // Random ID between 0 and 999
    return `https://picsum.photos/seed/${randomId}/200`; // Generating random image URL
  };

  return (
    <>
    <CustomHeader />
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton}         onPress={() => navigation.goBack()}
>
          <Ionicons name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Aide et Conseils</Text>
      </View>
      {posts.map((item) => (
        <TouchableOpacity key={item.id} style={styles.postContainer}>
          <Image source={{ uri: getRandomImageUrl() }} style={styles.postImage} />
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postText}>{item.content}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f3f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  goBackButton: {
    padding: 10,
  },
  postContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  postImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  postContent: {
    flex: 1,
    padding: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  postText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default HelpTipsPage;
