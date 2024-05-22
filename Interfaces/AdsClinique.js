import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AdsClinique = () => {
  const imageUrls = [
    "https://i.ibb.co/Cz2RkgH/bannerads.png",
  ];

  return (
    <View style={styles.container}>
      {imageUrls.map((url, index) => (
        <View key={index} style={styles.flyer}>
          <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 0,
  },
  flyer: {
    width: '100%', // Adjust the width as needed
    marginVertical: 5,
  },
  image: {
    width: '100%',
    height: 70, // Adjust the height as needed
    borderRadius: 5,
  },
});

export default AdsClinique;
