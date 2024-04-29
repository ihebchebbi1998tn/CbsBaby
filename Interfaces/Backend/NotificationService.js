import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Clipboard, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'd05ae95d-b315-4791-8bc8-ae70b6ff5bd0',
    })).data;
    console.log('Expo Push Token:', token); // Add this line to log the token
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export async function sendNotification(token, title, body) {
  console.log('Sending push notification...');

  // notification message
  const message = {
    to: token,
    sound: 'default',
    title: title,
    body: body,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      host: 'exp.host',
      accept: 'application/json',
      'accept-encoding': 'gzip, deflate',
      'content-type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export function copyPushTokenToClipboard(text) {
  Clipboard.setString(text);
  alert('Expo Push Token copied to clipboard!');
}
