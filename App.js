import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Scenes
import LoggingPage from './Scenes/Logging';
import WorkerPage from './Scenes/WorkerUser/Worker';
import AddClientPage from './Scenes/WorkerUser/AddClient';
import AddDevicePage from './Scenes/WorkerUser/AddDevice';
import SearchClientPage from './Scenes/WorkerUser/SearchClient';
import DevicesPage from './Scenes/WorkerUser/Devices';
import EditClientPage from './Scenes/EditClient';
import EditDevicePage from './Scenes/WorkerUser/EditDevice';
import OrderPage from './Scenes/WorkerUser/Order';

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
          name = "Devices"
          component = {DevicesPage}
        /> 
        <Stack.Screen
          name = "EditClient"
          component = {EditClientPage}
        /> 
        <Stack.Screen
          name = "EditDevice"
          component = {EditDevicePage}
        />
        <Stack.Screen
          name = "AddDevice"
          component = {AddDevicePage}
        />
        <Stack.Screen
          name = "Order"
          component = {OrderPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
