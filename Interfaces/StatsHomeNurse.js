import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BASE_URL } from "./Backend/apiConfig";

const StatsHomeNurse = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BASE_URL}bebeapp/api/Nurses/get_stats_homenurse.php`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const activeSagefemmesIndicator = stats ? (
    <View style={styles.statItem}>
      <MaterialCommunityIcons
        name={stats.active_sagefemmes > 0 ? "circle" : "circle-outline"}
        size={10}
        color={stats.active_sagefemmes > 0 ? "green" : "red"}
        style={styles.circleIcon}
      />
      <Text style={styles.statsValue}>{stats.active_sagefemmes}</Text>
      <Text style={styles.statsLabel}>Sagefemmes</Text>
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statsValue}>{stats?.moms}</Text>
          <Text style={styles.statsLabel}>Mamans</Text>
        </View>
        {activeSagefemmesIndicator}
        <View style={styles.statItem}>
          <Text style={styles.statsValue}>{stats?.avgResponseTime || "2 hours"}</Text>
          <Text style={styles.statsLabel}>Temps de réponse</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "95%",
    marginTop: 10, // Increased spacing
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statItem: {
    alignItems: "center",
    position: "relative", // Added for absolute positioning of the circle icon
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#163878",
    marginBottom: 5, // Increased spacing
  },
  statsLabel: {
    fontSize: 14,
    color: "#666666",
  },
  circleIcon: {
    position: "absolute",
    top: -10, // Adjusted position
    right: 12, // Adjusted position
  },
});

export default StatsHomeNurse;
