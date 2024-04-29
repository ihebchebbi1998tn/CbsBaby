import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
const QuestionsCategories = ({ togglePreQuestionsVisibility }) => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/categories.php`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const renderStackedBox = ({ item }) => (
    <TouchableOpacity
      style={styles.stackedBox}
      onPress={() => navigation.navigate('PreQuestions', { title: item.category_name })}
    >
      <Image source={{ uri: item.photo_categorie }} style={styles.bigImageLeft} />
      <View style={styles.rightContent}>
        <Text style={styles.rightText}>{item.category_name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.questionContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.category_id.toString()}
        renderItem={renderStackedBox}
        inverted // Render items from bottom to top
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    backgroundColor: "#f8f8f8",
    flex: 1,
    width: "95%",
    alignSelf: "center",
  },
  stackedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 90,
    width: "100%",
    backgroundColor: "#8ecccf",
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  bigImageLeft: {
    width: 70,
    height: 90,
    marginRight: 16,
    marginLeft: -16,
  },
  rightContent: {
    flex: 1,
    justifyContent: "center",
  },
  rightText: {
    color: "white",
    fontSize: 18,
  },
});

export default QuestionsCategories;
