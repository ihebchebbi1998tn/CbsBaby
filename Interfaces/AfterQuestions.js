import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DirectContact from "./DirectContact";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const AfterQuestions = ({ route }) => {
  const navigation = useNavigation();
  const [postQuestions, setPostQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { question_id } = route.params;
  const { question_text } = route.params;
  const { translated_question_text } = route.params;
  const { user } = useContext(UserContext);
  const userlanguage = user.language;
  useEffect(() => {
    fetchPostQuestions();
  }, [question_id]);

  const fetchPostQuestions = () => {
    fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/get_questions_answers.php?question_id=${question_id}&output_language=${userlanguage}`)
      .then(response => response.json())
      .then(data => {
        setPostQuestions(data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        setPostQuestions([]);
        setLoading(false); // Set loading to false in case of error
      });
  };

  const renderPostQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionButton}
    >
      <Text style={styles.questionText}>{item.translated_answer_text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{translated_question_text}</Text>
      </View>
      {loading ? ( // Show activity indicator while loading
        <ActivityIndicator size="large" color="#D84374" />
      ) : (
        <FlatList
          data={postQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPostQuestionItem}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No post questions found</Text>
          )}
          contentContainerStyle={styles.questionList}
        />
      )}
      <DirectContact />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  questionList: {
    flexGrow: 1,
  },
  questionButton: {
    backgroundColor: "#8bcbce",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  questionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#777",
  },
});

export default AfterQuestions;
