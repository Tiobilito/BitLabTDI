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
import PrototypingCheck from "./Scenes/Laboratorio-prototipado/PrototypingReportCheck";
import PrototypesOnStandby from "./Scenes/Laboratorio-prototipado/PrototypesOnStandby";
import PrototypingFormReadOnly from "./Scenes/Laboratorio-prototipado/PrototypingFormReadOnly";

import DevicesTest from "./Scenes/Prestador de servicio/DevicesTest";
import Reports from "./Scenes/Prestador de servicio/Reports";
import StudentPage from "./Scenes/Academic Group Users/Student";
import PrototypingSearch from "./Scenes/Laboratorio-prototipado/PrototypingSearchReports";

const Stack = createNativeStackNavigator();
const WorkerTap = createBottomTabNavigator();
const StudentsTap = createBottomTabNavigator();
const StaffTap = createBottomTabNavigator();
const MainWorkerStack = createNativeStackNavigator();
const RepairClientDevicesStack = createNativeStackNavigator();
const ReportCheckStack = createNativeStackNavigator();

function StRepCheck() {
  return(
    <ReportCheckStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportCheckStack.Screen name="Check" component={PrototypingCheck} />
      <ReportCheckStack.Screen name="ReportCheck" component={PrototypingFormReadOnly} />
    </ReportCheckStack.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con el chequeo de los reportes del laboratorio de prototipado
function Worker() {
  return (
    <MainWorkerStack.Navigator screenOptions={{ headerShown: false }}>
      <MainWorkerStack.Screen name="Worker" component={WorkerPage} />
      <MainWorkerStack.Screen name="AddClient" component={AddClientPage} />
    </MainWorkerStack.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con las reparaciones
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

//Tap que abarca todas las ventanas relacionadas con los estudiantes y maestros
const AcademicGroupApp = () => {
  return (
    <StudentsTap.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Registros") {
            iconName = focused ? "reader" : "reader-outline";
          } else if (route.name === "Prototipo") {
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
      <StudentsTap.Screen name="Principal" component={StudentPage} />
      <StudentsTap.Screen name="Registros" component={PrototypingSearch} />
      <StudentsTap.Screen name="Prototipo" component={PrototypingForm} />
    </StudentsTap.Navigator>
  );
};

//Tap que abarca todas las ventanas ralacionadas con el jefe de division y de laboratorio
const StaffApp = () => {
  return (
    <StaffTap.Navigator
      initialRouteName="Principal"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Registros") {
            iconName = focused ? "reader" : "reader-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <StaffTap.Screen name="Principal" component={StudentPage} />
      <StaffTap.Screen name="Registros" component={PrototypingCheck} />
    </StaffTap.Navigator>
  );
};

const SocialServiceApp = () => {
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
      <WorkerTap.Screen name="Standby" component={PrototypesOnStandby} />
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
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="StudentsApp" component={AcademicGroupApp} />
        <Stack.Screen name="WorkerApp" component={SocialServiceApp} />
        <Stack.Screen name="PrototypingForm" component={PrototypingForm} />
        <Stack.Screen
          name="PrototypesOnStandby"
          component={PrototypesOnStandby}
        />
        <Stack.Screen name="FormRead" component={PrototypingFormReadOnly} />
        <Stack.Screen name="StaffApp" component={StaffApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
