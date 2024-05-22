import React, { useState, useEffect , useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DirectContact from "./DirectContact";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const PreQuestions = ({ route }) => {
  const navigation = useNavigation();
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const { title } = route.params;
  const { TranslatedTitle } = route.params;
  const { user } = useContext(UserContext);
  const userlanguage = user.language;
  
  useEffect(() => {
    fetchPredefinedQuestions();
  }, [title]);

  const fetchPredefinedQuestions = () => {
    fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/fetch_questions.php?categoryTitle=${title}&output_language=${userlanguage}`)
      .then(response => response.json())
      .then(data => {
        setPredefinedQuestions(data);
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch(error => {
        console.error("Error fetching predefined questions:", error);
        setPredefinedQuestions([]);
        setLoading(false); // Set loading to false in case of error
      });
  };

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.questionButton}
      onPress={() => navigation.navigate('AfterQuestions', { translated_question_text: item.translated_question_text, question_text: item.questionText, question_id: item.id })}
    >
      <Text style={styles.questionText}>{item.translated_question_text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{TranslatedTitle}</Text>
      </View>
      {loading ? ( // Show activity indicator while loading
        <ActivityIndicator size="large" color="#D84374" />
      ) : (
        <FlatList
          data={predefinedQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderQuestionItem}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No predefined questions found</Text>
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

export default PreQuestions;
