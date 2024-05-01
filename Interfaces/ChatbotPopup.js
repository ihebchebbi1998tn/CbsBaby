import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';

const ChatbotPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Assuming connected initially
  const [animateText] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    // Animate text
    Animated.timing(animateText, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const closePopup = () => {
    navigation.navigate("InterfaceCommunication5");
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.8)' : 'rgba(204, 204, 204, 0.8)' }]} />
          <Animated.View style={[styles.messageBox, { opacity: animateText }]}>
            <Text style={styles.messageText}>{t('chatbotPopup.Need help?')}</Text>
          </Animated.View>
          <Image source={require('../assets/Images/nurseimage.jpg')} style={[styles.circularImage, { opacity: 0.8 }]} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  popupButton: {
    position: 'absolute',
    bottom: '11%',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  statusIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: 5,
    right: -10,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  messageBox: {
    backgroundColor: 'rgba(217,66,116, 0.7)',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  circularImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 1,
  },
});

export default ChatbotPopup;
