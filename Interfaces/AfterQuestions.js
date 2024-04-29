import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DirectContact from "./DirectContact";
import { BASE_URL } from "./Backend/apiConfig";

const AfterQuestions = ({ route }) => {
  const navigation = useNavigation();
  const [postQuestions, setPostQuestions] = useState([]);
  const { question_id } = route.params;
  const { question_text} = route.params;

  useEffect(() => {
    fetchPostQuestions();
  }, [question_id]);

  const fetchPostQuestions = () => {
    fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/get_questions_answers.php?question_id=${question_id}`)
      .then(response => response.json())
      .then(data => {
        setPostQuestions(data);
        console.log(data);
      })
      .catch(error => {
        console.error("Error fetching post questions:", error);
        setPostQuestions([]);
      });
  };


  const renderPostQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionButton}
      onPress={() => handleCardPress(item)}
    >
      <Text style={styles.questionText}>{item.answer_text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{question_text}</Text>
      </View>
      <FlatList
        data={postQuestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPostQuestionItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No post questions found</Text>
        )}
        contentContainerStyle={styles.questionList}
      />
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
