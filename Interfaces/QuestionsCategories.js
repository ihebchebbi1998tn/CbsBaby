import React, { useState, useEffect ,useContext} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const QuestionsCategories = ({ togglePreQuestionsVisibility }) => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/Messaging/Questions/categories.php?output_language=${user.language}`);
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const renderStackedBox = ({ item }) => (
    <TouchableOpacity
      style={styles.stackedBox}
      onPress={() => navigation.navigate('PreQuestions', { title: item.category_name, TranslatedTitle: item.translated_category_name })}
    >
      <Image source={{ uri: `${BASE_URL}bebeapp/front/${item.photo_categorie}` }} style={styles.bigImageLeft} />
      <View style={styles.rightContent}>
        <Text style={styles.rightText}>{item.translated_category_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    return loading ? <ActivityIndicator size="large" color="#D84374" style={styles.footerIndicator} /> : null;
  };

  return (
    <View style={styles.questionContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.category_id.toString()}
        renderItem={renderStackedBox}
        ListFooterComponent={renderFooter}
        inverted
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
    marginBottom: '2%',
  },
  stackedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    width: "100%",
    backgroundColor: "#8ecccf",
    borderRadius: 10,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  bigImageLeft: {
    width: 70,
    height: 70,
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
  footerIndicator: {
    marginVertical: 20, // Adjust this value as needed
  },
});

export default QuestionsCategories;
