// InterfaceCommunication5.js
import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import CustomHeader from "./CustomHeader";
import BottomNavbar from "./BottomNavbar";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import UserMessages from "./UserMessages";
import QuestionsCategories from "./QuestionsCategories";
import PreQuestions from "./PreQuestions";
import { StatusBar } from "expo-status-bar";
import AfterQuestions from "./AfterQuestions";
const Stack = createStackNavigator();

const InterfaceCommunication5 = () => {
  return (
    <>
      <StatusBar backgroundColor="#D84374" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <CustomHeader />
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="QuestionsCategories"
              component={QuestionsCategories}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserMessages"
              component={UserMessages}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PreQuestions"
              component={PreQuestions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AfterQuestions"
              component={AfterQuestions}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <BottomNavbar />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});

export default InterfaceCommunication5;
