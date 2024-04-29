import { StyleSheet } from 'react-native';

const stylehomeclient = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f8f8",
    },
    postContainer: {
      backgroundColor: "#fff",
      margin: 16,
      borderRadius: 8,
      overflow: "hidden",
      elevation: 3,
    },
    postImage: {
      width: "100%",
      height: 150,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    postInfo: {
      padding: 16,
    },
    postText: {
      fontSize: 16,
    },
    postActions: {
      flexDirection: "row",
      marginTop: 8,
      justifyContent: "space-between",
    },
    actionIcon: {
      marginRight: 16,
    },
    postTextInput: {
      fontSize: 16,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    navbar: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#e6acd8",
      height: 60,
    },
    navButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    activeNavButton: {
      backgroundColor: "#8bcad1",
    },
  
    postTitleContainer: {
      backgroundColor: "#e6acd8",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
    },
    postTitle: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
    },
  
    youtubePlayer: {
      height: 200,
    },
    postContent: {
        backgroundColor: "#e6acd8",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
      },
      postContentText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
      },
    
      // New styles for comments
      commentContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        padding: 16,
      },
      commentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
      },
      comment: {
        backgroundColor: "#f8f8f8",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      },
      commentText: {
        fontSize: 16,
        color: "#333",
      },
      commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
      },
      commentInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginRight: 8,
      },
      commentButton: {
        backgroundColor: "#e6acd8",
        padding: 8,
        borderRadius: 8,
      },
      commentButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
      postContent: {
        backgroundColor: "#e6acd8",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
      },
      postContentText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
      },
  });
  
  export default stylehomeclient;