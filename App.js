import React from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Scenes principal
import LoggingPage from "./Scenes/Logging";
import Register from "./Scenes/Register";
// Scenes Prestador de servicio
import WorkerPage from "./Scenes/Prestador de servicio/Prestador de Servicio";
import AddClientPage from "./Scenes/Prestador de servicio/AddClient";
import AddDevicePage from "./Scenes/Prestador de servicio/AddDevice";
import SearchClientPage from "./Scenes/Prestador de servicio/SearchClient";
import DevicesPage from "./Scenes/Prestador de servicio/Devices";
import EditClientPage from "./Scenes/Prestador de servicio/EditClient";
import EditDevicePage from "./Scenes/Prestador de servicio/EditDevice";
import OrderPage from "./Scenes/Prestador de servicio/Order";
// Scenes Laboratorio de Prototipado
import PrototypingForm from "./Scenes/Laboratorio-prototipado/PrototypingForm";
import PrototypesOnStandby from "./Scenes/Laboratorio-prototipado/PrototypesOnStandby";

import DevicesTest from "./Scenes/Prestador de servicio/DevicesTest";
import Reports from "./Scenes/Prestador de servicio/Reports";

const Stack = createNativeStackNavigator();
const WorkerTap = createBottomTabNavigator();
const MainWorkerStack = createNativeStackNavigator();
const RepairClientDevicesStack = createNativeStackNavigator();

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

function Worker() {
  return (
    <MainWorkerStack.Navigator screenOptions={{ headerShown: false }}>
      <MainWorkerStack.Screen name="Worker" component={WorkerPage} />
      <MainWorkerStack.Screen name="AddClient" component={AddClientPage} />
    </MainWorkerStack.Navigator>
  );
}

function Fixes() {
  return (
    <RepairClientDevicesStack.Navigator screenOptions={{ headerShown: false }}>
      <RepairClientDevicesStack.Screen
        name="SearchClient"
        component={SearchClientPage}
      />
      <RepairClientDevicesStack.Screen name="Devices" component={DevicesPage} />
      <RepairClientDevicesStack.Screen
        name="EditClient"
        component={EditClientPage}
      />
      <RepairClientDevicesStack.Screen
        name="EditDevice"
        component={EditDevicePage}
      />
      <RepairClientDevicesStack.Screen
        name="AddDevice"
        component={AddDevicePage}
      />
      <RepairClientDevicesStack.Screen name="Order" component={OrderPage} />
    </RepairClientDevicesStack.Navigator>
  );
}

const PrestadorApp = () => {
  return (
    <WorkerTap.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reparaciones") {
            iconName = focused ? "build" : "build-outline";
          } else if (route.name === "Prototipo") {
            iconName = focused
              ? "hardware-chip-sharp"
              : "hardware-chip-outline";
          } else if (route.name === "Standby") {
            iconName = focused
              ? "hardware-chip-sharp"
              : "hardware-chip-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <WorkerTap.Screen name="Principal" component={Worker} />
      <WorkerTap.Screen name="Reparaciones" component={Fixes} />
      <WorkerTap.Screen name="Prototipo" component={PrototypingForm} />
    </WorkerTap.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Logging" component={LoggingPage} />
        <Stack.Screen name="PrototypingForm" component={PrototypingForm} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="WorkerApp" component={PrestadorApp} />
        <Stack.Screen
          name="PrototypesOnStandby"
          component={PrototypesOnStandby}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#095ea7",
    marginTop: 30,
  },
  Buttons: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: WIDTH > 400 ? 32 : 24,
    fontWeight: "bold",
    color: "#2272A7",
  },
  icon: {
    fontSize: WIDTH > 400 ? 32 : 24,
    color: "#2272A7",
  },
  btnAction: {
    width: WIDTH * 0.85,
    height: HEIGHT * 0.08,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    gap: WIDTH * 0.04,
  },
});
