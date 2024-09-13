import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Scenes
import LoggingPage from "./Scenes/Logging";
import WorkerPage from "./Scenes/WorkerUser/Worker";
import AddClientPage from "./Scenes/WorkerUser/AddClient";
import AddDevicePage from "./Scenes/WorkerUser/AddDevice";
import SearchClientPage from "./Scenes/WorkerUser/SearchClient";
import DevicesPage from "./Scenes/WorkerUser/Devices";
import EditClientPage from "./Scenes/WorkerUser/EditClient";
import EditDevicePage from "./Scenes/WorkerUser/EditDevice";
import OrderPage from "./Scenes/WorkerUser/Order";

const Stack = createNativeStackNavigator();
const WorkerTap = createBottomTabNavigator();
const MainWorkerStack = createNativeStackNavigator();
const RepairClientDevicesStack = createNativeStackNavigator();

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
      <RepairClientDevicesStack.Screen name="SearchClient" component={SearchClientPage} />
      <RepairClientDevicesStack.Screen name="Devices" component={DevicesPage} />
      <RepairClientDevicesStack.Screen name="EditClient" component={EditClientPage} />
      <RepairClientDevicesStack.Screen name="EditDevice" component={EditDevicePage} />
      <RepairClientDevicesStack.Screen name="AddDevice" component={AddDevicePage} />
      <RepairClientDevicesStack.Screen name="Order" component={OrderPage} />
    </RepairClientDevicesStack.Navigator>
  );
}

const WorkerApp = () => {
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
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <WorkerTap.Screen name="Principal" component={Worker} />
      <WorkerTap.Screen name="Reparaciones" component={Fixes} />
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
        <Stack.Screen name="WorkerApp" component={WorkerApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
