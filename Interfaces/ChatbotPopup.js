import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated, PanResponder, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ChatbotPopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Assuming connected initially
  const animateText = useState(new Animated.Value(0))[0];

  const navigation = useNavigation();
  const { t } = useTranslation();

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        if (Math.abs(gestureState.dx) > width * 0.4) {
          closePopup();
        }
      },
    })
  );

  useEffect(() => {
    // Animate text
    Animated.timing(animateText, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Set timeout to hide the popup after 8 seconds
    const popupTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 12000);

    return () => clearTimeout(popupTimeout); // Clean up the setTimeout
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    // Additional animations or cleanup here after closing
  };

  return (
    <>
      {isVisible && (
        <Animated.View style={styles.popupButton} {...panResponder.current.panHandlers}>
          <View style={[styles.statusIndicator, { backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.8)' : 'rgba(204, 204, 204, 0.8)' }]} />
          <Animated.View style={[styles.messageBox, { opacity: animateText }]}>
            <Text style={styles.messageText}>{t('chatbotPopup.Need help?')}</Text>
          </Animated.View>
          <Image source={require('../assets/Images/nurseimage.jpg')} style={[styles.circularImage, { opacity: 0.8 }]} />
        </Animated.View>
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
