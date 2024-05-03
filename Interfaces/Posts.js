import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, TextInput } from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import { useTranslation } from 'react-i18next';
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons
import { useLanguage } from './LanguageContext';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10, // Add horizontal padding
    marginTop: 0, // Add margin top for the text
    marginLeft: 10, // Add margin left
  },
  scrollViewContent: {
    flexGrow: 1, // Allow the content to grow to fill the available space
    justifyContent: 'center', // Align posts to the center vertically
  },
  latestArticlesText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, // Add some space between the text and posts
    marginRight: 15, // Add margin-right
    marginTop: 8, // Add margin top
  },
  postCard: {
    width: 300, // Adjust card width as needed
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    marginHorizontal: 8, // Add horizontal margin
    marginBottom: 16, // Add margin bottom
    height: 280, // Adjusted card height
  },
  postImage: {
    width: "100%",
    height: 150, // Adjust image height as needed
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16, // Decreased title font size
    fontWeight: "bold",
    color: "#000", // Black color for title
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 14,
    color: "#D84374", // Pink color for category
    marginRight: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align to the right
  },
  dateText: {
    fontSize: 12,
    color: "#808080", // Gray color for date
    marginLeft: 4, // Add some space between icon and text
  },
  loadingContainer: {
    width: 300, // Adjust width to match post card width
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f3f5",
    elevation: 3,
    marginHorizontal: 8, // Add horizontal margin
    marginBottom: 16, // Add margin bottom
    height: 280, // Adjusted card height
  },
  loadingImage: {
    width: "100%",
    height: 150, // Adjust image height as needed
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  loadingContent: {
    padding: 16,
  },
  loadingTitle: {
    width: "80%", // Adjust width as needed
    height: 20, // Adjust height to match title font size
    marginBottom: 8,
    backgroundColor: "#d1d5db", // Light gray background color
    borderRadius: 4,
  },
  loadingCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  loadingCategoryText: {
    width: 80, // Adjust width as needed
    height: 14, // Adjust height to match category font size
    marginRight: 8,
    backgroundColor: "#d1d5db", // Light gray background color
    borderRadius: 4,
  },
  loadingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align to the right
  },
  loadingDateText: {
    width: 40, // Adjust width as needed
    height: 12, // Adjust height to match date font size
    marginLeft: 4, // Add some space between icon and text
    backgroundColor: "#d1d5db", // Light gray background color
    borderRadius: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});

const Posts = (props) => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation(); // Access translation function
  const { changeLanguage } = useLanguage();
  const {  searchQuery } = props;

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/get_posts.php`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching posts:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      changeLanguage(user.language);
    }
  }, [user, changeLanguage]);

  const fetchAndSetPosts = useCallback(async () => {
    const data = await fetchPosts();
    setAllPosts(data);
    applyFiltersAndSort(data, searchQuery);
  }, [searchQuery]);

  const applyFiltersAndSort = (posts, query) => {
    const filtered = posts.filter(
      (post) =>
        post.title_post &&
        post.title_post.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPosts(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndSetPosts()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [fetchAndSetPosts]);

  useEffect(() => {
    fetchAndSetPosts();
  }, [fetchAndSetPosts]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAndSetPosts();
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, [fetchAndSetPosts]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFiltersAndSort(allPosts, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.latestArticlesText}>{t('posts.latest')}</Text>
      <ScrollView
        horizontal // Enable horizontal scrolling
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredPosts.length === 0 && (
          <Text style={styles.noPostsText}>{t('posts.noPostsFound')}</Text>
        )}
        {filteredPosts.map((post, index) => (
          <Post
            key={index}
            post={post}
            t={t} // Pass t function as a prop
          />
        ))}
        {/* Placeholder loading */}
        {refreshing && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingImage}></View>
            <View style={styles.loadingContent}>
              <View style={styles.loadingTitle}></View>
              <View style={styles.loadingCategoryContainer}>
                <View style={styles.loadingCategoryText}></View>
              </View>
              <View style={styles.loadingDateContainer}>
                <View style={styles.loadingDateText}></View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Post = ({ post, t }) => {
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate("ViewPost", {
      id_post: post.id_post,
    });
  };

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={styles.postCard}>
        {post.imagelink_post.endsWith(".mp4") ? (
          <Video
            source={{ uri: `${BASE_URL}bebeapp/front/${post.imagelink_post}` }}
            style={styles.postImage}
            resizeMode="cover"
            useNativeControls={true}
          />
        ) : (
          <Image
            source={{ uri: `${BASE_URL}bebeapp/front/${post.imagelink_post}` }}
            style={styles.postImage}
          />
        )}
        <View style={styles.postContent}>
          <View style={styles.categoryContainer}>
            <Ionicons name="albums" size={16} color="#D84374" />
            <Text style={styles.categoryText}>{" "}{post.category_post}</Text>
          </View>
          <Text style={styles.postTitle}>{post.title_post}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar" size={16} color="#808080" />
            <Text style={styles.dateText}>{post.createdat_post.split(" ")[0]}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Posts;
