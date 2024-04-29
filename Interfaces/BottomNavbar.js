import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';

const BottomNavbar = () => {
  const navigation = useNavigation();
  const { t } = useTranslation(); // Access translation function

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const getActiveRouteName = () => {
    // Access the current route name from the navigation state
    return navigation.getState().routes[navigation.getState().index].name;
  };

  const TabButton = ({ icon, label, screen }) => {
    const activeRouteName = getActiveRouteName();
    const isFirstRoute = activeRouteName === "InterfaceHomeClient";
    const isLastRoute = activeRouteName === "InterfaceClientPage";

    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          isFirstRoute &&
            screen === "InterfaceHomeClient" &&
            styles.activeTabButtonLeft,
          isLastRoute &&
            screen === "InterfaceClientPage" &&
            styles.activeTabButtonRight,
          !isFirstRoute &&
            !isLastRoute &&
            activeRouteName === screen &&
            styles.activeTabButton,
        ]}
        onPress={() => navigateTo(screen)}
      >
        <View style={styles.tabContent}>
          <Ionicons
            name={icon}
            size={24}
            color={activeRouteName === screen ? "#FFF" : "#D84374"}
          />
          {activeRouteName === screen && (
            <Text style={[styles.tabLabel, { color: "#FFF" }]}>
              {t(label)}
            </Text>
          )}
        </View>
        {activeRouteName === screen && <View style={styles.indicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TabButton
        icon="home"
        label="tabLabels.Accueil"
        screen="InterfaceHomeClient"
      />
      <TabButton
        icon="bulb"
        label="tabLabels.Conseils"
        screen="InterfaceConseilClient"
      />
      <TabButton
        icon="chatbubbles"
        label="tabLabels.Aide"
        screen="InterfaceCommunication5"
      />
      <TabButton
        icon="person"
        label="tabLabels.Profil"
        screen="InterfaceClientPage"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF", // White Background Color
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 13,
  },
  activeTabButton: {
    backgroundColor: "#D84374", // Dark Blue Background Color when active
    borderTopRightRadius: 0, // Always apply top right radius
    borderTopLeftRadius: 0, // Always apply top left radius
  },
  activeTabButtonLeft: {
    backgroundColor: "#D84374", // Dark Blue Background Color when active
    borderTopRightRadius: 0, // Always apply top right radius
    borderTopLeftRadius: 30, // Apply top left radius only for the left button
  },
  activeTabButtonRight: {
    backgroundColor: "#D84374", // Dark Blue Background Color when active
    borderTopRightRadius: 30, // Apply top right radius only for the right button
    borderTopLeftRadius: 0, // Always apply top left radius
  },
  tabLabel: {
    marginTop: 8, // Add some top margin for the text
    fontSize: 12,
    color: "#163979", // Dark Blue Text Color
  },
  tabContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center",
  },
  indicator: {
    height: 2,
    backgroundColor: "#FFF", // White Indicator Color
    marginTop: 4,
    width: "90%", // Adjust as needed
  },
});

export default BottomNavbar;
