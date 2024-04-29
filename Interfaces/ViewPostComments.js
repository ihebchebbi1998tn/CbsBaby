import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const ViewPostComments = ({ id_post }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const { user } = useContext(UserContext);
  const [refreshKey, setRefreshKey] = useState(0); // State variable to force re-render

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/get_comment.php?id_post=${id_post}`
      );
      if (response.ok) {
        const commentsData = await response.json();
        if (commentsData.length === 0) {
          setComments([]); // Update state when there are no comments
        } else {
          const sortedComments = commentsData.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          setComments(sortedComments);
        }
      } else {
      }
    } catch (error) {
    }
  };
  

  useEffect(() => {
    const commentsIntervalId = setInterval(fetchComments, 1000);
    return () => clearInterval(commentsIntervalId);
  }, [id_post, refreshKey]); // Adding refreshKey as a dependency

  const handleAddComment = async () => {
    try {
      if (!comment.trim()) {
        console.warn("Comment cannot be empty");
        return;
      }

      const response = await fetch(`${BASE_URL}bebeapp/api/add_comment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `text_comment=${encodeURIComponent(
          comment
        )}&id_post_comment=${id_post}&id_user_comment=${user.id}`,
      });

      if (response.ok) {
        setComment("");
        fetchComments();
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentLongPress = (comment) => {
    if (
      comment.id_user_comment === user.id ||
      comment.id_nurse_comment === user.id
    ) {
      setSelectedCommentId(comment.id_comment);
      setModalVisible(true);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/delete_comment.php?id_comment=${selectedCommentId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchComments();
        setModalVisible(false);
      } else {
        fetchComments();
      }
      // Force re-render after deletion
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
    }
  };
  

  return (
    <>
      <ScrollView style={styles.commentsContainer}>
        {comments.length === 0 ? (
          <Text style={styles.noCommentsText}>Ajoutez un commentaire</Text>
        ) : (
          comments.map((comment, index) => (
            <TouchableOpacity
              key={index}
              onLongPress={() => handleCommentLongPress(comment)}
            >
              <View style={styles.commentContainer}>
                <Image
                  source={{
                    uri:
                      comment.id_user_comment !== null
                        ? `https://cdn-icons-png.flaticon.com/512/4478/4478097.png`
                        : `https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg`,
                  }}
                  style={styles.commentUserImage}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUserName}>
                    {comment.id_user_comment !== null
                      ? `${comment.user_info?.name ?? ""} ${
                          comment.user_info?.surname ?? ""
                        }`
                      : `${comment.nurse_info?.nomprenom_sagefemme ?? ""}`}
                  </Text>
                  <Text style={styles.commentText}>{comment.text_comment}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <View style={styles.commentInputContainer}>
        <Image
          source={{
            uri:
              comment.id_user_comment !== null
                ? `https://cdn-icons-png.flaticon.com/512/4478/4478097.png`
                : `https://t4.ftcdn.net/jpg/01/85/46/17/360_F_185461775_hOtNw5K9ajrEBG8Wxtj6RWFqX1TgewAC.jpg`,
          }}
          style={styles.commentUserImage}
        />
        <TextInput
          style={styles.commentInput}
          placeholder="Ajouter un commentaire..."
          value={comment}
          onChangeText={(text) => setComment(text)}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={handleAddComment}
        >
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalDescription}>
              Êtes-vous sûr de vouloir supprimer ce commentaire ?
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteComment}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
                <Ionicons name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  commentsContainer: {
    maxHeight: 300,
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    flexDirection: "column",
  },
  commentUserName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 12,
    color: "#333",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },
  commentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#173879",
    justifyContent: "center",
    alignItems: "center",
  },
  noCommentsText: {
    textAlign: "center",
    marginTop: 10,
    color: "#888",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: 300, // Adjust the width as needed
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginRight: 10,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
});

export default ViewPostComments;
