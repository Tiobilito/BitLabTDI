import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Scenes
import LoggingPage from './Scenes/Logging';
import WorkerPage from './Scenes/Worker';
import AddClientPage from './Scenes/AddClient';
import SearchClientPage from './Scenes/SearchClient';
import ClientPage from './Scenes/Client';
import DevicesPage from './Scenes/Devices';
import EditClientPage from './Scenes/EditClient';

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
        <Stack.Screen
          name = "SearchClient"
          component = {SearchClientPage}
        />  
        <Stack.Screen
          name = "Client"
          component = {ClientPage}
        />  
        <Stack.Screen
          name = "Devices"
          component = {DevicesPage}
        /> 
        <Stack.Screen
          name = "EditClient"
          component = {EditClientPage}
        /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
