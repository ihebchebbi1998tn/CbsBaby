import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "./Backend/apiConfig";
import { UserContext } from "./Backend/UserContext";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  videoCard: {
    width: width - 40,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    elevation: 3,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    color: "#333",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 14,
    color: "#D84374",
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#808080",
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: width * 0.95,
    height: height * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    width: "100%",
    height: "90%",
  },
  controlBar: {
    width: "100%",
    height: "10%",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
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
});

const Videos = ({ searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const { user } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${BASE_URL}bebeapp/api/get_videos.php?output_lang=${user.language}`);
      const videoData = await response.json();
      if (searchQuery) {
        const filteredVideos = videoData.filter(
          (video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            video.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setVideos(filteredVideos);
      } else {
        setVideos(videoData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos  :", error);
      setLoading(false);
    }
  };

  const fetchAndSetVideos = useCallback(async () => {
    await fetchVideos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAndSetVideos().finally(() => setRefreshing(false));
  }, [fetchAndSetVideos]);

  useEffect(() => {
    fetchAndSetVideos();
  }, [fetchAndSetVideos]);

  const handlePlayVideo = (video) => {
    console.log("Selected Video URL:", video.VideoURL);
    setSelectedVideo(video);
    setModalVisible(true);
    setLoading(true);
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setLoading(false);
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(0);
      videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleFullscreenClose = () => {
    setModalVisible(false);
    if (videoRef.current) {
      videoRef.current.pauseAsync();
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#D84374" />
      ) : (
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
                      <Text style={styles.categoryText}>{video.VideoCat}</Text>
                    </View>
                    <Text style={styles.dateText}>{video.VideoDate}</Text>
                  </View>
                  <Text style={styles.videoTitle}>{video.VideoTitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleFullscreenClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleFullscreenClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#ffffff"
                style={styles.activityIndicator}
              />
            )}
            <SafeAreaView style={[styles.fullscreenVideo, { marginBottom: 5 }]}>
              {selectedVideo && (
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo.VideoURL }}
                  style={{ flex: 1 }}
                  resizeMode="contain"
                  useNativeControls={false}
                  isLooping
                  shouldPlay
                  onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
              )}
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

