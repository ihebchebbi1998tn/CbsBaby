import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InterfaceCommunication from './Interfaces/InterfaceCommunication';
import InterfaceHomeClient from './Interfaces/InterfaceHomeClient';
import InterfaceMessages from './Interfaces/InterfaceMessages';
import DefaultScreen from './Interfaces/DefaultScreen';
import InterfaceLogin from './Interfaces/InterfaceLogin';
import LoginDefaultScreen from './Interfaces/LoginDefaultScreen';

import 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DefaultScreen">
      <Stack.Screen
          name="DefaultScreen"
          component={DefaultScreen}
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
          name="InterfaceCommunication"
          component={InterfaceCommunication}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}