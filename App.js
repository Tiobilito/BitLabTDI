import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Scenes
import LoggingPage from './Scenes/Logging';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name = "Logging"
          component = {LoggingPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
