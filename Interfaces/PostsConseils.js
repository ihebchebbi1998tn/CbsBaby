import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  Platform,
  Share,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import HTML from "react-native-render-html";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 12,
  },
  line: {
    height: 1,
  },
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#173879",
    marginBottom: 8,
  },
  postDescriptionContainer: {
    maxHeight: 66,
    overflow: "hidden",
    marginBottom: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    marginRight: 6,
    color: "#18387a",
  },
  commenticon: {
    color: "#18387a",
    marginLeft: 10,
  },
  actionText: {
    color: "#D84374",
    fontSize: 14,
    fontWeight: "bold",
  },
  comment_count: {
    color: "#D84374",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  liked: {
    color: "#18387a",
    fontWeight: "bold",
  },
});

const PostsConseils = ( category ) => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(UserContext);
  const windowWidth = useWindowDimensions().width;
  const fetchPosts = async () => {

    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/get_posts_category.php?category=${category}`);
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
  
  const fetchAndSetPosts = async () => {
    const data = await fetchPosts();
    setAllPosts(data);
    applyFiltersAndSort(data, searchQuery);
  };
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
  }, []);

  const checkLike = async (post_id_checklike) => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/check_like_user.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `post_id_checklike=${post_id_checklike}&user_id_checklike=${user.id}`,
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        console.error("Error checking like:", response.statusText);
        return { liked: false };
      }
    } catch (error) {
      console.error("Error checking like:", error);
      return { liked: false };
    }
  };

  const likePost = async (post_id_likepost) => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/like_post.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `post_id_likepost=${post_id_likepost}&user_id_likepost=${user.id}`,
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        fetchAndSetPosts();
        return responseData;
      } else {
        console.error("Error toggling like:", response.statusText);
        return { success: false, action: null };
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      return { success: false, action: null };
    }
  };


  return (
    <ScrollView
      contentContainerStyle={{ width: windowWidth }} // Set width directly
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.line} />
        {filteredPosts.length === 0 && (
          <Text style={styles.noPostsText}>Aucun article trouvé...</Text>
        )}
        {filteredPosts.map((post, index) => (
          <Post
            key={index}
            post={post}
            checkLike={checkLike}
            likePost={likePost}
          />
        ))}
      </View>
    </ScrollView>
  );
};
const Post = ({ post, checkLike, likePost }) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const response = await checkLike(post.id_post);
      setIsLiked(response.liked);
    };
    fetchLikeStatus();
  }, [checkLike, post.id_post]);

  const handleCardPress = () => {
    navigation.navigate("ViewPost", {
      id_post: post.id_post,
    });
  };

  const handleLikePress = async () => {
    const response = await likePost(post.id_post);
    setIsLiked(response.success ? !isLiked : isLiked);
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, "");
  };
  
  const buildShareMessage = () => {
    const descriptionText = stripHtmlTags(post.descri_post);
    return `${post.title_post}\nDescription: ${descriptionText}\n source = L'application mobile cbsbebe : https://www.cliniquebeausejour.tn/\n`;
  };
  
  const sharePost = async () => {
    const message = buildShareMessage();
    console.log(message);
    try {
      let result;
      if (Platform.OS === "ios") {
        result = await Share.share({
          message: message,
          url: post.link, 
        });
      } else {
        result = await Share.share({
          message: message,
        });
      }
  
      if (result.action === Share.sharedAction) {
        console.log("Content shared successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("Sharing dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };
  
  const handleSharePress = () => {
    sharePost();
  };

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={styles.postCard}>
        {post.imagelink_post.endsWith(".mp4") ? (
          <Video
            source={{
              uri: `${BASE_URL}bebeapp/front/${post.imagelink_post}`,
            }}
            style={styles.postImage}
            resizeMode="cover"
            useNativeControls={true}
          />
        ) : (
          <Image
            source={{
              uri: `${BASE_URL}bebeapp/front/${post.imagelink_post}`,
            }}
            style={styles.postImage}
          />
        )}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title_post}</Text>
          <View style={styles.postDescriptionContainer}>
            <HTML source={{ html: post.descri_post }} />
          </View>
          <View style={styles.postActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
            >
              <Ionicons
                name="heart"
                size={20}
                style={[styles.actionIcon, isLiked && styles.liked]}
              />
              <Text style={styles.actionText}>{`${post.likes_count}`}</Text>
              <Ionicons name="chatbox" size={20} style={styles.commenticon} />
              <Text
                style={styles.comment_count}
              >{`${post.comment_count}`}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSharePress}
            >
              <Ionicons
                name="share-social"
                size={20}
                style={styles.actionIcon}
              />
              <Text style={styles.actionText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostsConseils;
