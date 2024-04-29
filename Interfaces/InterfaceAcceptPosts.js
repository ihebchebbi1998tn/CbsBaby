import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  postContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  postCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#ffffff",
    width: 300,
    height: "75%",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  postCategoryContainer: {
    backgroundColor: "#8acad1",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 3,
    width: "40%",
  },
  postCategoryText: {
    fontSize: 14,
    color: "#ffffff",
  },
  postDescription: {
    marginTop: 5,
    fontSize: 14,
    color: "#666666",
  },
  seeMoreLink: {
    color: "#173879",
    fontWeight: "bold",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -15,
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7acd9",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 5,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

const acceptPost = async (idPost, action) => {
    try {
      const response = await fetch(
        "https://cliniquebeausejour.000webhostapp.com/api/treat_posts.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `id_post=${idPost}&action=${action}`,
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error accepting/declining post:", error.message);
    }
  };
  
const InterfaceAcceptPosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://testalphaomega.000webhostapp.com/api/get_posts_notaccepted.php"
      );
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Error fetching posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPosts();
    }, 4000);
    return () => clearInterval(intervalId);
  }, []); 
  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.postContainer}
      >
        {posts.map((post) => (
          <View key={post.id_post} style={styles.postCard}>
            <Image
              source={{
                uri: `https://testalphaomega.000webhostapp.com/front/${post.imagelink_post}`,
              }}
              style={styles.postImage}
            />
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title_post}</Text>
              <View style={styles.postCategoryContainer}>
                <Text style={styles.postCategoryText}>
                  {post.category_post}
                </Text>
              </View>
              <Text style={styles.postDescription}>
                {post.descri_post.length > 100
                  ? `${post.descri_post.substring(0, 100)}... `
                  : post.descri_post}{" "}
                {post.descri_post.length > 100 && (
                  <Text style={styles.seeMoreLink}>Voir plus</Text>
                )}
              </Text>
            </View>
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => acceptPost(post.id_post, "Accept")}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
                <Text style={styles.actionText}>Accepter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => acceptPost(post.id_post, "Decline")}
              >
                <Ionicons name="close" size={18} color="#fff" />
                <Text style={styles.actionText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <BottomNavbar />
    </View>
  );
};
export default InterfaceAcceptPosts;
