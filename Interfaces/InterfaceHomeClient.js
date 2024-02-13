import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '@mindinventory/rn-top-navbar';
import { useNavigation } from "@react-navigation/native";

const InterfaceHomeClient = () => {
  const yourImageSource = require('../assets/Images/logotransparent.png');
  const postImageSource = require('../assets/Images/samplePostImage.png');
  const postImageSource1 = require('../assets/Images/samplePostImage1.jpg');
  const postImageSource2 = require('../assets/Images/samplePostImage2.jpg');
  const navigation = useNavigation();

  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewPostImage(result.uri);
    }
  };

  const handleCreatePost = () => {
    console.log('Creating Post:', { text: newPostText, image: newPostImage });
  };

  return (
    <View style={styles.container}>
      <Header style={{ backgroundColor: '#ff3366' }}>
        <Header.Left style={{ backgroundColor: '#ff3366', width: '15%' }}>
          <Ionicons name='menu' style={{ color: '#fff', fontSize: 30 }} />
        </Header.Left>
        <Header.Body style={{ backgroundColor: '#ff3366', width: '100%' }}>
          <Image source={yourImageSource} style={{ width: 125, height: 30 }} />
        </Header.Body>
        <Header.Right style={{ backgroundColor: '#ff3366', flexDirection: 'row', width: '15%' }}>
          <Ionicons name='send' style={{ color: '#fff', fontSize: 20 }} />
        </Header.Right>
      </Header>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.postContainer}>
          <TextInput
            style={styles.postTextInput}
            placeholder="What's on your mind?"
            value={newPostText}
            onChangeText={(text) => setNewPostText(text)}
          />
          {newPostImage && <Image source={{ uri: newPostImage }} style={styles.newPostImage} />}
          <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
            <Text style={styles.imagePickerButtonText}>Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
            <Text style={styles.createPostButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>

        {/* Existing posts */}
        <View style={styles.postContainer}>
          <Image source={postImageSource} style={styles.postImage} />
          <View style={styles.postInfo}>
            <Text style={styles.postText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non justo eget mauris scelerisque ultrices.
            </Text>
            <View style={styles.postActions}>
              <Ionicons name="heart" size={24} color="#ff3366" style={styles.actionIcon} />
              <Ionicons name="chatbubble" size={24} color="#ff3366" style={styles.actionIcon} />
            </View>
          </View>
        </View>

        <View style={styles.postContainer}>
          <Image source={postImageSource1} style={styles.postImage} />
          <View style={styles.postInfo}>
            <Text style={styles.postText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non justo eget mauris scelerisque ultrices.
            </Text>
            <View style={styles.postActions}>
              <Ionicons name="heart" size={24} color="#ff3366" style={styles.actionIcon} />
              <Ionicons name="chatbubble" size={24} color="#ff3366" style={styles.actionIcon} />
            </View>
          </View>
        </View>

        <View style={styles.postContainer}>
          <Image source={postImageSource2} style={styles.postImage} />
          <View style={styles.postInfo}>
            <Text style={styles.postText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non justo eget mauris scelerisque ultrices.
            </Text>
            <View style={styles.postActions}>
              <Ionicons name="heart" size={24} color="#ff3366" style={styles.actionIcon} />
              <Ionicons name="chatbubble" size={24} color="#ff3366" style={styles.actionIcon} />
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.navbar}>
        <Ionicons name="home" size={24} color="white" style={styles.navIcon} />
        <TouchableOpacity
            onPress={() => {
              navigation.navigate("InterfaceMessages");
            }}
          >
        <Ionicons name="mail" size={24} color="white" style={styles.navIcon} />
        </TouchableOpacity>
        <Ionicons name="person" size={24} color="white" style={styles.navIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  postContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  postInfo: {
    padding: 16,
  },
  postText: {
    fontSize: 16,
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 16,
  },
  postTextInput: {
    fontSize: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  newPostImage: {
    width: '100%',
    height: 200,
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePickerButton: {
    backgroundColor: '#ff3366',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createPostButton: {
    backgroundColor: '#ff3366',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ff3366',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
});

export default InterfaceHomeClient;
