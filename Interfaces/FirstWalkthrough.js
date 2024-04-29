import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, SafeAreaView, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { StatusBar } from "expo-status-bar";

const FirstWalkthrough = ({ navigation }) => {
  const [showSkip, setShowSkip] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const walkthroughData = [
    {
      title: 'Welcome to Our App',
      description: 'Explore the amazing features of our app',
      image: 'https://via.placeholder.com/300', // Placeholder image
      backgroundColor: '#fff', // Change background color to white
    },
    {
      title: 'Discover More',
      description: 'Find out how our app can make your life easier',
      image: 'https://via.placeholder.com/300', // Placeholder image
      backgroundColor: '#fff', // Change background color to white
    },
    {
      title: 'Get Started',
      description: 'Begin using our app now!',
      backgroundColor: '#fff', // Change background color to white
    },
  ];

  const handleNext = () => {
    navigation.navigate('InterfaceLogin');
  };

  const handleSkip = () => {
    setShowSkip(false);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <>
      <StatusBar backgroundColor="#c64870" barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <Swiper
          style={styles.wrapper}
          loop={false}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          showsButtons={false}
          autoplay={false}
          onIndexChanged={(index) => {
            setActiveSlideIndex(index);
            setShowSkip(index < walkthroughData.length - 1);
          }}
        >
          {walkthroughData.map((slide, index) => (
            <View key={index} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
              {slide.image && (
                <Image source={{ uri: slide.image }} style={styles.image} />
              )}
              <View style={styles.content}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </Swiper>
        {showSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
        {!showSkip && (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  dot: {
    backgroundColor: '#ccc',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#007bff',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 15,
  },
  languageSelection: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  languageButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  languageButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default FirstWalkthrough;
