import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@mindinventory/rn-top-navbar";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import ContactModal from "./ContactModal";
import Rating from "./Rating";
import UserSettingsModal from "./UserSettingsModal";
const YourImageSource = require("../assets/logowhite.png");

const CustomHeader = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [numberOfMessages, setNumberOfMessages] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);
  const { t } = useTranslation(); // Access translation function

  useEffect(() => {
    const interval = setInterval(fetchNumberOfMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkRatingStatus = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}bebeapp/api/lunch_evaluation_modal.php?user_id=${user.id}`
        );
        const data = await response.json();
        if (data.status === false) {
          setRatingModalVisible(true);
        } else if (data.status === "none") {
          setRatingModalVisible(false);
        }
      } catch (error) {
        console.error("Error checking rating status:", error);
      }
    };

    const interval = setInterval(() => {
      checkRatingStatus();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const fetchNumberOfMessages = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}bebeapp/api/Messaging/not_read_message_user.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setNumberOfMessages(data.session_count);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsSidebarOpen(false);
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
    closeSidebar();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openRatingModal = () => {
    setRatingModalVisible(true);
    closeSidebar();
  };

  const closeRatingModal = () => {
    setRatingModalVisible(false);
  };

  const openUserSettingsModal = () => {
    setIsUserSettingsModalOpen(true);
    closeSidebar(); 
  };

  const sidebarTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  return (
    <View>
      <ContactModal isVisible={isModalOpen} onClose={closeModal} />
      <Modal
        visible={isSidebarOpen}
        transparent
        animationType="none"
        onRequestClose={closeSidebar}
      >
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarTranslateX }] },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
            <Ionicons
              name="close"
              size={100}
              style={[styles.icon, { color: "#fff" }]}
            />
          </TouchableOpacity>
          <View style={styles.sidebarContent}>
            <Image
              source={YourImageSource}
              style={styles.sidebarLogo}
              resizeMode="contain"
            />
            <View>
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => navigation.navigate("InterfaceCommunication5")}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  style={styles.sidebarIcon}
                />
                <Text style={styles.sidebarText}>{t('sidebar.Chat direct')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => navigation.navigate("InterfaceConseilClientOnly")}
              >
                <Ionicons
                  name="heart-half-outline"
                  style={styles.sidebarIcon}
                />
                <Text style={styles.sidebarText}>{t('sidebar.Conseils')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => navigation.navigate("InterfaceListeControle")}
              >
                <Ionicons name="clipboard-outline" style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>{t('sidebar.Listes de contrôle')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={openUserSettingsModal}>
                <Ionicons name="options" style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>{t('sidebar.Paramètres')}</Text>
              </TouchableOpacity>
              <View style={styles.separator}></View>
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={openRatingModal}
              >
                <Ionicons name="star-half" style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>{t('sidebar.Évaluez notre application')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem} onPress={openModal}>
                <Ionicons name="mail" style={styles.sidebarIcon} />
                <Text style={styles.sidebarText}>{t('sidebar.Contact')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deconnectionButton}
            onPress={() => navigation.navigate("InterfaceLogin")}
          >
            <Ionicons name="log-out" style={[styles.icon, { color: "#fff" }]} />
            <Text style={styles.sidebarText}>{t('sidebar.Deconnection')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
      <Header style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
            <Ionicons name="menu" style={[styles.icon, { color: "#fff" }]} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Image source={YourImageSource} style={styles.headerImage} />
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => navigation.navigate("InterfaceClientMessages")}
          >
            {numberOfMessages > 0 && (
              <View style={[styles.messageIndicator, { zIndex: 1 }]}>
                <Text style={styles.messageCount}>{numberOfMessages}</Text>
              </View>
            )}
            <Ionicons name="send" style={[styles.icon, { color: "#fff" }]} />
          </TouchableOpacity>
        </View>
      </Header>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={closeRatingModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={closeRatingModal}
        >
          <View style={[styles.modalContainer, styles.modalContent]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeRatingModal}
            >
              <Ionicons name="close" size={40} color="#fff" />
            </TouchableOpacity>
            <Rating onCloseModal={closeRatingModal} />
          </View>
        </TouchableOpacity>
      </Modal>
      <UserSettingsModal isVisible={isUserSettingsModalOpen} onClose={() => setIsUserSettingsModalOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#D84374",
    borderBottomWidth: 1,
    borderBottomColor: "#86c8cf",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 0,
  },
  leftContainer: {
    width: "15%",
  },
  menuButton: {
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  centerContainer: {
    width: "70%",
    alignItems: "center",
  },
  rightContainer: {
    width: "15%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sendButton: {
    padding: 10,
    position: "relative",
  },
  icon: {
    fontSize: 20,
  },
  messageIndicator: {
    position: "absolute",
    top: 4,
    right: "5%",
    backgroundColor: "#d9090c",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  messageCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(198, 72, 112, 0.9)",
    width: 300,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    zIndex: 100,
  },
  sidebarContent: {
    flex: 1,
    alignItems: "center",
  },
  sidebarLogo: {
    width: 200,
    height: 200,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sidebarIcon: {
    fontSize: 27,
    marginRight: 10,
    color: "#fff",
  },
  sidebarText: {
    color: "#fff",
    fontSize: 18,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999,
  },
  deconnectionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerImage: {
    width: 130,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default CustomHeader;
