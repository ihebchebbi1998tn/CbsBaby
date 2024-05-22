import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Share,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import CustomHeader from "./CustomHeader";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import ViewPostComments from "./ViewPostComments";
import HTML from "react-native-render-html";
import { StatusBar } from "expo-status-bar";

const ViewPost = ({ route }) => {
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { id_post } = route.params;
  const { user } = useContext(UserContext);
  const { width: contentWidth } = useWindowDimensions();

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
        alert("Post shared successfully");
        console.log("Content shared successfully");
      } else if (result.action === Share.dismissedAction) {
        alert("Sharing dismissed");
        console.log("Sharing dismissed");
      }
    } catch (error) {
      alert("Error sharing post. Please try again.");
      console.error("Error sharing:", error.message);
    }
  };

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/get_post_details.php?id_post=${id_post}&output_language=ar`
      );
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
        setLoading(false);
        console.log(postData);
      } else {
        console.error("Error fetching post details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id_post]);

/*   useEffect(() => {
    const fetchLikeStatus = async () => {
      if (post) {
        const response = await checkLike(post.id_post);
        setLiked(response.liked);
      }
    };
    fetchLikeStatus();
  }, [checkLike, post]);
 */
  /* const checkLike = async (post_id_checklike) => {
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
        return {
          liked: false,
        };
      }
    } catch (error) {
      console.error("Error checking like:", error);
      return {
        liked: false,
      };
    }
  };
 */
/*   const likePost = async (post_id_likepost) => {
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
        fetchPostDetails();
        return responseData;
      } else {
        console.error("Error toggling like:", response.statusText);
        return {
          success: false,
          action: null,
        };
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      return {
        success: false,
        action: null,
      };
    }
  }; */

 /*  const handleLikePress = async () => {
    const response = await likePost(post.id_post);
    setLiked(response.success ? !liked : liked);
  };
 */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e7acd9" />
      </View>
    );
  }

  const openExternalLink = async () => {
    try {
      await Linking.openURL(post.externalContentLink);
    } catch (error) {
      console.error("Error opening external link:", error);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <ScrollView>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.shareIconContainer}
            >
              <Ionicons name="arrow-back-circle" size={35} color="#D84374" />
            </TouchableOpacity>
            <Image
              source={{
                uri: `${BASE_URL}bebeapp/front/${post.imagelink_post}`,
              }}
              style={styles.fullWidthImage}
            />
          </View>
          <View style={styles.postContainer}>
            <View style={styles.categorySourceContainer}>
              <FontAwesome name="folder" size={20} color="#D84374" />
              <Text style={styles.categorySourceText}>
                {post.category_post}
              </Text>
            </View>
            <View style={styles.actionsContainer}>
             {/*  <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLikePress}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  style={liked ? styles.actionButtonLiked : styles.actionIcon}
                />
                <Text style={styles.actionText}>{post.likes_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbox" size={24} style={styles.actionIcon} />
                <Text style={styles.actionText}>{post.comment_count}</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.partagerButton}
                onPress={sharePost}
              >
                <Ionicons
                  name="share-social"
                  size={24}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText}>Partager</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.postTitle}>{post.title_post}</Text>
            {post.externalContentLink && (
              <TouchableOpacity onPress={openExternalLink}>
                <View style={styles.externalLinkContainer}>
                  <FontAwesome name="external-link" size={13} color="#D84374" />
                  <Text style={styles.externalLinkText}>
                    {post.externalContentLink}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <ScrollView>
              <HTML
                source={{ html: post.translated_descri_post }} // Use translated content here
                contentWidth={contentWidth}
                ignoredDomTags={["font"]}
                decodeEntities={true}
                tagsStyles={{
                  p: {
                    fontSize: 10,
                    marginBottom: -5,
                    color: "#333",
                  },
                  span: {
                    fontSize: 13,
                    marginBottom: 0,
                    color: "#333",
                  },
                  div: {
                    fontSize: 10,
                    marginBottom: 5,
                    color: "#333",
                  },
                }}
              />
            </ScrollView>

            <ViewPostComments id_post={id_post} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  shareIconContainer: {
    position: "absolute",
    top: "15%",
    left: "3%",
    zIndex: 10,
  },
  fullWidthImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  postContainer: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categorySourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  categorySourceText: {
    fontSize: 10,
    color: "#666",
    marginLeft: 5,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#173879",
    marginBottom: 10,
    marginTop: 10,
  },
  externalLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 13,
  },
  externalLinkText: {
    marginLeft: 5,
    color: "#D84374",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    marginLeft: 8,
    alignItems: "center",
  },
  actionButtonLiked: {
    flexDirection: "row",
    marginLeft: 8,
    color: "#D84374",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#D84374",
    fontWeight: "bold",
  },
  actionIcon: {
    color: "#173879",
  },
  partagerButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default ViewPost;
