import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";
import { useTranslation } from "react-i18next";

const Rating = ({ onCloseModal }) => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [selectedStars, setSelectedStars] = useState(0);
  const [ratingText, setRatingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const handleStarPress = (index) => {
    setSelectedStars(index + 1);
  };

  const handleTextChange = (text) => {
    setRatingText(text);
    setIsTyping(text.length > 0);
  };

  const handleSendRating = () => {
    setShowActivityIndicator(true);

    const url = `${BASE_URL}bebeapp/api/insert_rating.php?user_id=${user.id}&rating_out_of_5=${selectedStars}&evaluation_text=${ratingText}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        setTimeout(() => {
          setShowActivityIndicator(false);
          setShowThankYouModal(true);
          onCloseModal(); // Call the onCloseModal function passed from the parent
        }, 4000); // 4 seconds delay
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.ratingContainer}
      keyboardVerticalOffset={-Dimensions.get("window").height * 0.2}
    >
      <ScrollView contentContainerStyle={styles.rating}>
        <View style={styles.popup}>
          <Text style={styles.rateOurApp}>{t('Évaluez notre application')}</Text>
          <View style={styles.starParent}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    selectedStars > index
                      ? ["#fec0e5", "#ff80c2"]
                      : ["#C3C7C7", "#C3C7C7"]
                  }
                  style={styles.starIcon}
                >
                  <Ionicons name="star" size={27} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          {!isTyping && (
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleSendRating}
            >
              <Ionicons
                name="heart"
                size={20}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>{t('Jadore !')}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.dontLikeThe}>{t('Vous naimez pas lapplication ? Dites-le nous.')}</Text>
          <TextInput
            style={styles.ratingTextInput}
            multiline
            placeholder={t('Entrez votre évaluation ici...')}
            value={ratingText}
            onChangeText={handleTextChange}
          />
          {isTyping && (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendRating}
            >
              <Ionicons
                name="send"
                size={15}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>{t('Envoyer')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showThankYouModal}
        onRequestClose={() => setShowThankYouModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setShowThankYouModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.thankYouText}>{t('Merci pour votre évaluation !')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowThankYouModal(false);
                  onCloseModal(); // Call the onCloseModal function passed from the parent
                }}
              >
                <Text style={styles.closeButtonText}>{t('Fermer')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showActivityIndicator}
        onRequestClose={() => setShowActivityIndicator(false)}
      >
        <View style={styles.activityIndicatorContainer}>
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ratingContainer: {
    flex: 1,
  },
  rating: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  popup: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(198, 72, 112,0.5)",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 0,
  },
  rateOurApp: {
    fontSize: 30,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
  },
  starParent: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starIcon: {
    marginHorizontal: 8,
    padding: 5,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: "#8acbcf",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  dontLikeThe: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  ratingTextInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 80,
  },
  sendButton: {
    backgroundColor: "#8acbcf",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#8acbcf",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
  },
});

export default Rating;
