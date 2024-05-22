import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.sidebar, isOpen ? styles.sidebarOpen : styles.sidebarClosed]}>
        <Text>Sidebar Content</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 101, // Ensure the zIndex is higher than the header's zIndex
  },
  sidebar: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "80%", // Adjust width as per your requirement
  },
  sidebarOpen: {
    display: "flex",
  },
  sidebarClosed: {
    display: "none",
  },
});

export default Sidebar;
