import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Scenes
import LoggingPage from './Scenes/Logging';
import WorkerPage from './Scenes/Worker';
import AddClientPage from './Scenes/AddClient';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name = "Logging"
          component = {LoggingPage}
        />
        <Stack.Screen
          name = "Worker"
          component = {WorkerPage}
        />  
        <Stack.Screen
          name = "AddClient"
          component = {AddClientPage}
        />     
      </Stack.Navigator>
    </NavigationContainer>
  );
}
