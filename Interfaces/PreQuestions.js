import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DirectContact from "./DirectContact";
import { BASE_URL } from "./Backend/apiConfig";

const PreQuestions = ({ route }) => {
  const navigation = useNavigation();
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const { title } = route.params;

  useEffect(() => {
    fetchPredefinedQuestions();
  }, [title]);

  const fetchPredefinedQuestions = () => {
    fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/fetch_questions.php?categoryTitle=${title}`)
      .then(response => response.json())
      .then(data => {
        setPredefinedQuestions(data);
      })
      .catch(error => {
        console.error("Error fetching predefined questions:", error);
        setPredefinedQuestions([]);
      });
  };


  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionButton}
      onPress={() => navigation.navigate('AfterQuestions', { question_text: item.questionText , question_id: item.id })}
    >
      <Text style={styles.questionText}>{item.questionText}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <FlatList
        data={predefinedQuestions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderQuestionItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No predefined questions found</Text>
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

export default PreQuestions;
