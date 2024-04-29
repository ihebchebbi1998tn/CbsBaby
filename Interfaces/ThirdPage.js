import React, { useState , useEffect ,useContext} from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Animated} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from './Backend/UserContext';
import { useNavigation } from "@react-navigation/native";

const ThirdPage = () => {
  const [animateText] = useState(new Animated.Value(0));
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(animateText, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Images/NurseIcon.jpg')} style={styles.logo} />
      </View>

      <Animated.View style={[styles.messageBox, { opacity: animateText }]}>
        <Text style={styles.messageText}> 
        Merci {user.name}, de nous avoir choisi . Nous espérons que notre application vous aidera !
        </Text>
      </Animated.View>

      <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate("InterfaceHomeClient")}>
        <Text style={styles.buttonText}>Commencez</Text>
        <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 10 }} />
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.currentDot]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBox: {
    backgroundColor: "rgba(217,66,116, 0.7)",
    borderRadius: 18,
    padding: 10,
    width: 230,
    position: "absolute",
    top: "30.5%", // Adjust as needed
    left: "8%",
    right: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 320,
    height: 170,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '21.5%', // Adjust as needed
    left: '-27%',
    right: 0,
  },
  userText: {
    color: '#1d3d7a',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d94274',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '80%',
  },
  inputIcon: {
    color: '#d94274',
    fontSize: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1d3d7a',
  },
  button: {
    backgroundColor: '#d94274',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
    flexDirection: 'row', // Added flexDirection to align icon and text horizontally
    alignItems: 'center', // Added alignItems to center icon vertically
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#dcdcdc',
    marginHorizontal: 5,
  },
  currentDot: {
    backgroundColor: '#d94274',
  },
});

export default ThirdPage;
