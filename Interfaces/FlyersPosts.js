import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const FlyersPosts = () => {
  const imageUrls = [
    "http://192.168.1.10/bebeapp/front/flyers/1.png",
    "http://192.168.1.10/bebeapp/front/flyers/2.png",
    "http://192.168.1.10/bebeapp/front/flyers/3.png",
  ];

  return (
    <View style={styles.container}>
      {imageUrls.map((url, index) => (
        <View key={index} style={styles.flyer}>
          <Image source={{ uri: url }} style={styles.image} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
  },
  flyer: {
    width: '27%', // Adjust the width as needed
    margin: 7,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // To maintain aspect ratio of images
    borderRadius: 5,
  },
});

export default FlyersPosts;
