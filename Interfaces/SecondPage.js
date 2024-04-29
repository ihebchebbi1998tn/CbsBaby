import React, { useState , useEffect ,useContext} from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Animated} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from './Backend/UserContext';
import { useNavigation } from "@react-navigation/native";
const SecondPage = () => {
  const [chosenUsername, setChosenUsername] = useState('');
  const navigation = useNavigation();
  const [animateText] = useState(new Animated.Value(0));
  const { user } = useContext(UserContext);

  const handleChosenUsernameChange = (value) => {
    setChosenUsername(value);
  };
  useEffect(() => {
    Animated.timing(animateText, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSkip = () => {
    // Navigate to the next page
    navigation.navigate("ThirdPage");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/Images/NurseIcon.jpg')} style={styles.logo} />
      </View>

      <Animated.View style={[styles.messageBox, { opacity: animateText }]}>
        <Text style={styles.messageText}>
          Maintenant {user.name}, voulez-vous changer votre mot de pass ?
        </Text>
      </Animated.View>

      <Text style={styles.userText}>Votre mot de passe actuel est</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="199812198"
          value="199812198"
          onChangeText={handleChosenUsernameChange}
          editable={false}
        />
      </View>

      <Text style={styles.userText}>Voulez-vous le changer ?</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de pass"
          value={chosenUsername}
          onChangeText={handleChosenUsernameChange}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ThirdPage")}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Passer</Text>
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.currentDot]} />
          <View style={styles.dot} />
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
    top: "21.5%", // Adjust as needed
    left: "8%",
    right: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
    marginLeft: '10%',
  },
  logo: {
    width: 320,
    height: 170,
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
    color: '#d94274',
  },
  button: {
    backgroundColor: '#d94274',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
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
  skipButton: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#1d3d7a',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default SecondPage;
