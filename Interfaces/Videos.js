import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, Image, Button, Dimensions, SafeAreaView, ActivityIndicator } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 0,
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  videoCard: {
    width: width - 40,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f3f5",
    elevation: 3,
    marginVertical: 8,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
  },
  videoInfoContainer: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  videoCategory: {
    fontSize: 14,
    color: "#D84374", // Pink color for category
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#808080", // Gray color for date
    marginRight: 4, // Add some space between icon and text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width,
    height,
  },
  controlBar: {
    position: 'absolute',
    bottom: '3%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  controlButton: {
    padding: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 14,
    color: "#D84374", // Pink color for category
    marginRight: 8,
  },
});

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);

  const fetchVideos = async () => {
    try {
      // Hardcode the video URLs
      const videoUrls = [
        "https://videos.pexels.com/video-files/20770858/20770858-hd_1080_1920_30fps.mp4",
        "https://videos.pexels.com/video-files/15921892/15921892-uhd_3840_2160_50fps.mp4",
        "https://videos.pexels.com/video-files/9844511/9844511-hd_1080_1920_30fps.mp4",
      ];
  
      // Return an array of video objects
      return videoUrls.map((url, index) => ({
        id: index,
        title: `Video ${index + 1}`,
        category: `Category ${index + 1}`,
        date: "May 1, 2024",
        thumbnail: `https://via.placeholder.com/400x400.png?text=Video+${index + 1}`, // Placeholder image
        videoUrl: url,
      }));
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  };

  const fetchAndSetVideos = useCallback(async () => {
    const data = await fetchVideos();
    setVideos(data);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndSetVideos()
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  }, [fetchAndSetVideos]);

  useEffect(() => {
    fetchAndSetVideos();
  }, [fetchAndSetVideos]);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setModalVisible(true);
    setIsLoading(true);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isPlaying) {
      setIsPlaying(false);
    } else if (status.isPlaying) {
      setIsPlaying(true);
    }
    setIsLoading(false);
  };

  const handlePlayPause = () => {
    if (playbackInstance) {
      if (isPlaying) {
        playbackInstance.pauseAsync();
      } else {
        playbackInstance.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    if (playbackInstance) {
      playbackInstance.setPositionAsync(0);
      playbackInstance.playAsync();
      setIsPlaying(true);
    }
  };

  const handleFullscreenClose = () => {
    setModalVisible(false);
    if (playbackInstance) {
      playbackInstance.pauseAsync();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {videos.length === 0 && <Text>No videos found</Text>}
        {videos.map((video, index) => (
          <TouchableOpacity key={index} onPress={() => handlePlayVideo(video)}>
            <View style={styles.videoCard}>
              <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
              <View style={styles.videoInfoContainer}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <View style={styles.categoryContainer}>
      <Ionicons name="albums" size={16} color="#D84374" />
      <Text style={styles.categoryText}>{video.category}</Text>
    </View>
    <Text style={styles.dateText}>{video.date}</Text>
  </View>
  <Text style={styles.videoTitle}>{video.title}</Text>
</View>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleFullscreenClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color="#ffffff" style={styles.activityIndicator} />}
            <SafeAreaView style={[styles.fullscreenVideo, { marginBottom: 5 }]}>
              <Video
                ref={(ref) => setPlaybackInstance(ref)}
                source={{ uri: selectedVideo ? selectedVideo.videoUrl : null }}
                style={{ flex: 1 }}
                resizeMode="contain"
                useNativeControls={false}
                isLooping
                shouldPlay
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
            </SafeAreaView>
            <View style={styles.controlBar}>
              <TouchableOpacity style={styles.controlButton} onPress={handleRewind}>
                <Ionicons name="play-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handlePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Videos;
