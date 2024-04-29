import { LogBox } from "react-native";

// Ignore specific warning or variations of it
LogBox.ignoreLogs(["You should always pass contentWidth prop"]);

// Your existing code...

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { UserProvider } from "./Interfaces/Backend/UserContext";
import InterfaceHomeClient from "./Interfaces/InterfaceHomeClient";
import InterfaceMessages from "./Interfaces/InterfaceMessages";
import DefaultScreen from "./Interfaces/DefaultScreen";
import InterfaceLogin from "./Interfaces/InterfaceLogin";
import LoginDefaultScreen from "./Interfaces/LoginDefaultScreen";
import InterfaceCommunication5 from "./Interfaces/InterfaceCommunication5";
import InterfaceClientPage from "./Interfaces/InterfaceClientPage";
import InteractiveBabyScreen from "./Interfaces/InteractiveBabyScreen";
import { ErrorBoundary } from "react-error-boundary";
import InterfaceHomeNurse from "./Interfaces/InterfaceHomeNurse";
import InterfaceConseilClient from "./Interfaces/InterfaceConseilClient";
import PostCreationScreen from "./Interfaces/PostCreationScreen";
import InterfaceAcceptPosts from "./Interfaces/InterfaceAcceptPosts";
import InterfaceDocumentUser from "./Interfaces/InterfaceDocumentUser";
import InterfaceValiseUserBebe from "./Interfaces/InterfaceValiseUserBebe";
import InterfaceBodyParts from "./Interfaces/InterfaceBodyParts";
import {
  View,
  Text,
  Button,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import Patient from "./Interfaces/NuseInterfaces/Patient";
import ViewPost from "./Interfaces/ViewPost";
import "react-native-gesture-handler";
import Rating from "./Interfaces/Rating";
import InterfaceValiseUser from "./Interfaces/InterfaceValiseUser";
import FirstWalkthrough from "./Interfaces/FirstWalkthrough";
import Posts from "./Interfaces/Posts";
import UserMessages from "./Interfaces/UserMessages";
import UserMessagesNurse from "./Interfaces/UserMessagesNurse";
import InterfaceClientMessages from "./Interfaces/InterfaceClientMessages";
import UserMessagesOld from "./Interfaces/UserMessagesOld";
import QuestionsCreationScreen from "./Interfaces/QuestionsCreationScreen";
import InterfaceProfileNurse from "./Interfaces/InterfaceProfileNurse";
import { Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as IntentLauncherAndroid from "expo-intent-launcher";
import { BASE_URL } from "./Interfaces/Backend/apiConfig";
import ViewPostsScreen from "./Interfaces/ViewPostsScreen";
import EquipeCbs from "./Interfaces/EquipeCbs";
import InterfaceListeControle from "./Interfaces/InterfaceListeControle";
import InterfaceConseilClientOnly from "./Interfaces/InterfaceConseilClientOnly";
import InterfaceConseilsPosts from "./Interfaces/InterfaceConseilsPosts";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";
import FirstPage from "./Interfaces/FirstPage";
import SecondPage from "./Interfaces/SecondPage";
import ThirdPage from "./Interfaces/ThirdPage";
import { LanguageProvider } from "./Interfaces/LanguageContext";

const Stack = createStackNavigator();

const instantTransition = () => ({
  cardStyle: {
    opacity: 1,
  },
});

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dots, setDots] = useState("");
  const [error, setError] = useState(null); // State to store error message
  const [fetchingUpdate, setFetchingUpdate] = useState(false); // State to track if update data is being fetched
  const currentVersion = "1.00"; // Example current version

  useEffect(() => {
    const fetchUpdateData = async () => {
      if (!downloading && !fetchingUpdate) {
        // Check if app is not downloading and update data is not being fetched
        setFetchingUpdate(true); // Set fetchingUpdate to true to prevent concurrent fetch requests
        try {
          const response = await fetch(
            `${BASE_URL}bebeapp/front/get_update.php`
          );
          const data = await response.json();
          setUpdateData(data);
          if (data && data.length > 0) {
            setTitle(data[0].title);
            setDescription(data[0].description);

            // Compare fetched version with current version
            if (data[0].version > currentVersion) {
              setModalVisible(true); // Open modal for downloading
            }
          }
        } catch (error) {
          console.error("Error fetching update data", error);
        } finally {
          setFetchingUpdate(false); // Reset fetchingUpdate to false after fetch completes
        }
      }
    };

    // Fetch update data initially
    fetchUpdateData();

    // Fetch update data every 3 seconds
    const intervalId = setInterval(fetchUpdateData, 10000);

    // Clean up function to clear the interval
    return () => clearInterval(intervalId);
  }, [downloading, fetchingUpdate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((dots) => (dots.length < 3 ? dots + "." : ""));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage to download files.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error("Storage permission denied");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera to take photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error("Camera permission denied");
      }
    } catch (err) {
      throw new Error(err);
    }
  };
  const handleDownload = async () => {
    setError(null); // Réinitialiser l'état d'erreur
    await requestStoragePermission(); // Demander la permission de stockage
    await requestCameraPermission(); // Demander la permission de la caméra

    if (updateData && updateData.length > 0 && updateData[0].link) {
      const url = updateData[0].link;
      try {
        setModalVisible(true); // Afficher la fenêtre modale avec un indicateur d'activité
        setDownloading(true); // Démarrer le téléchargement
        const downloadsDir = FileSystem.documentDirectory;
        const filePath = `${downloadsDir}/update.apk`;

        const downloadResumable = FileSystem.createDownloadResumable(
          url,
          filePath
        );

        const result = await downloadResumable.downloadAsync(filePath);

        if (result && result.status === 200) {
          setDownloading(false); // Arrêter le téléchargement
          setModalVisible(false); // Masquer la fenêtre modale si le téléchargement réussit
          Alert.alert(
            "Téléchargement terminé !",
            "Voulez-vous installer la mise à jour ?",
            [
              {
                text: "Annuler",
                style: "cancel",
              },
              {
                text: "Installer",
                onPress: async () => {
                  try {
                    if (Platform.OS === "android") {
                      // Lancer l'activité d'installation en utilisant l'URI du contenu
                      await FileSystem.getContentUriAsync(filePath).then(
                        (contentUri) => {
                          IntentLauncherAndroid.startActivityAsync(
                            "android.intent.action.VIEW",
                            {
                              data: contentUri,
                              flags: 1, // FLAG_ACTIVITY_NEW_TASK
                              type: "application/vnd.android.package-archive", // Type MIME pour APK
                            }
                          );
                        }
                      );
                    } else {
                      console.log(
                        "Installation non prise en charge sur cette plateforme"
                      );
                    }
                  } catch (error) {
                    console.error("Erreur lors de l'installation", error);
                    setError(error.message); // Définir l'état d'erreur avec le message d'erreur
                  }
                },
              },
            ]
          );
        } else {
          setDownloading(false); // Arrêter le téléchargement
          setModalVisible(false); // Masquer la fenêtre modale si le téléchargement échoue
          Alert.alert(
            "Échec du téléchargement",
            "Une erreur est survenue lors du téléchargement de la mise à jour."
          );
        }
      } catch (error) {
        console.error("Une erreur est survenue", error);
        setDownloading(false); // Arrêter le téléchargement
        setModalVisible(false); // Masquer la fenêtre modale si le téléchargement échoue
        Alert.alert(
          "Échec du téléchargement",
          "Une erreur est survenue lors du téléchargement de la mise à jour."
        );
      }
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <LanguageProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="DefaultScreen"
              screenOptions={{
                cardStyleInterpolator: instantTransition,
                gestureEnabled: false, // Disable gestures
                ...TransitionPresets.SlideFromRightIOS, // Apply transition preset
              }}
            >
              <Stack.Screen
                name="FirstWalkthrough"
                component={FirstWalkthrough}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FirstPage"
                component={FirstPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SecondPage"
                component={SecondPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ThirdPage"
                component={ThirdPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ViewPostsScreen"
                component={ViewPostsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="QuestionsCreationScreen"
                component={QuestionsCreationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Posts"
                component={Posts}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceProfileNurse"
                component={InterfaceProfileNurse}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Rating"
                component={Rating}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceHomeNurse"
                component={InterfaceHomeNurse}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ViewPost"
                component={ViewPost}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceClientMessages"
                component={InterfaceClientMessages}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceAcceptPosts"
                component={InterfaceAcceptPosts}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PostCreationScreen"
                component={PostCreationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceConseilClient"
                component={InterfaceConseilClient}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InteractiveBabyScreen"
                component={InteractiveBabyScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DefaultScreen"
                component={DefaultScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserMessagesOld"
                component={UserMessagesOld}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="InterfaceClientPage"
                component={InterfaceClientPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceLogin"
                component={InterfaceLogin}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginDefaultScreen"
                component={LoginDefaultScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="InterfaceCommunication5"
                component={InterfaceCommunication5}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceHomeClient"
                component={InterfaceHomeClient}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceMessages"
                component={InterfaceMessages}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserMessagesNurse"
                component={UserMessagesNurse}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserMessages"
                component={UserMessages}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceDocumentUser"
                component={InterfaceDocumentUser}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceValiseUser"
                component={InterfaceValiseUser}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceValiseUserBebe"
                component={InterfaceValiseUserBebe}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceBodyParts"
                component={InterfaceBodyParts}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Patient"
                component={Patient}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EquipeCbs"
                component={EquipeCbs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceListeControle"
                component={InterfaceListeControle}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceConseilClientOnly"
                component={InterfaceConseilClientOnly}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="InterfaceConseilsPosts"
                component={InterfaceConseilsPosts}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: "80%",
                }}
              >
                {downloading ? (
                  <View style={{ alignItems: "center", marginTop: 10 }}>
                    <ActivityIndicator size="large" color="#00aaff" />
                    <Text style={{ marginTop: 10 }}>Téléchargement en cours{dots}</Text>
                  </View>
                ) : (
                  <>
                    {error && ( // Rendre conditionnellement le message d'erreur
                      <Text style={{ color: "red", marginBottom: 10 }}>
                        {error}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        Mise à jour disponible
                      </Text>
                    </View>
                    <Text style={{ marginBottom: 10 }}>Titre : {title}</Text>
                    <Text style={{ marginBottom: 20 }}>
                      Description : {description}
                    </Text>
                    {updateData &&
                      updateData.length > 0 &&
                      updateData[0].link && (
                        <Button
                          title="Télécharger"
                          onPress={handleDownload}
                          disabled={downloading}
                        />
                      )}
                  </>
                )}
              </View>
            </View>
          </Modal>
        </LanguageProvider>
      </UserProvider>
    </I18nextProvider>
  );
}
