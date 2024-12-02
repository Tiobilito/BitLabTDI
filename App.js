import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Scenes principal
import LoginPage from "./Scenes/Login";
import Register from "./Scenes/Register";
// Scenes Prestador de servicio
import SocialServicePage from "./Scenes/Social Service/Prestador de Servicio";
import AddClientPage from "./Scenes/Social Service/AddClient";
import AddDevicePage from "./Scenes/Social Service/AddDevice";
import SearchClientPage from "./Scenes/Social Service/SearchClient";
import DevicesPage from "./Scenes/Social Service/Devices";
import EditClientPage from "./Scenes/Social Service/EditClient";
import EditDevicePage from "./Scenes/Social Service/EditDevice";
import OrderPage from "./Scenes/Social Service/Order";
// Scenes Laboratorio de Prototipado
import PrototypingForm from "./Scenes/Prototyping Laboratory/PrototypingForm";
import PrototypingCheck from "./Scenes/Prototyping Laboratory/PrototypingReportCheck";
import PrototypesOnStandby from "./Scenes/Prototyping Laboratory/PrototypesOnStandby";
import PrototypingFormReadOnly from "./Scenes/Prototyping Laboratory/PrototypingFormReadOnly";
import GeneratePrototypePDF from "./Scenes/Prototyping Laboratory/GeneratePrototypePDF";
import PrototypingFormEdit from "./Scenes/Prototyping Laboratory/PrototypingFormEditable";

import TeacherStudentPage from "./Scenes/Academic Group Users/TeacherStudent";
import PrototypingReportsPage from "./Scenes/Prototyping Laboratory/PrototypingReports";
import PrototypingAlreadyChecked from "./Scenes/Prototyping Laboratory/PrototypingReportAlreadyChecked";
import PrototypingReportStDone from "./Scenes/Prototyping Laboratory/PrototypingReportStDone";
import OrderPageReadOnly from "./Scenes/Social Service/OrderReports";
import HeadDivisionLaboratoryPage from "./Scenes/Academic Group Users/Head of Division and Laboratory";

const Stack = createNativeStackNavigator();
const SocialServiceTap = createBottomTabNavigator();
const StudentsTap = createBottomTabNavigator();
const StaffTap = createBottomTabNavigator();
const SocialServiceStack = createNativeStackNavigator();
const RepairClientDevicesStack = createNativeStackNavigator();
const ReportCheckStack = createNativeStackNavigator();
const AcademicGroupStack = createNativeStackNavigator();
const StaffStack = createNativeStackNavigator();

function AcademicGroupHome() {
  return (
    <AcademicGroupStack.Navigator screenOptions={{headerShown: false}}>
      <AcademicGroupStack.Screen name="Home" component={TeacherStudentPage} />
      <AcademicGroupStack.Screen name="ReportForm" component={PrototypingForm} />
    </AcademicGroupStack.Navigator>
  );
}

function StaffHome() {
  return (
    <StaffStack.Navigator screenOptions={{headerShown: false}}>
      <StaffStack.Screen name="Home" component={HeadDivisionLaboratoryPage} />
      <StaffStack.Screen name="ReportForm" component={PrototypingForm} />
    </StaffStack.Navigator>
  );
}

function SocialServiceHome() {
  return (
    <SocialServiceStack.Navigator screenOptions={{ headerShown: false }}>
      <SocialServiceStack.Screen name="SocialService" component={SocialServicePage} />
      <SocialServiceStack.Screen name="AddClient" component={AddClientPage} />
    </SocialServiceStack.Navigator>
  );
}

function StRepCheck() {
  return (
    <ReportCheckStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportCheckStack.Screen name="Check" component={PrototypingCheck} />
      <ReportCheckStack.Screen
        name="ReportCheck"
        component={PrototypingFormReadOnly}
      />
      <ReportCheckStack.Screen
        name="AlreadyCheckedReports"
        component={PrototypingAlreadyChecked}
      />
      <ReportCheckStack.Screen
        name="DoneReports"
        component={PrototypingReportStDone}
      />
    </ReportCheckStack.Navigator>
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
      <StudentsTap.Screen name="Principal" component={AcademicGroupHome} />
      <StudentsTap.Screen name="Registros" component={PrototypingReportsPage} />
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
      <StaffTap.Screen name="Principal" component={StaffHome} />
      <StaffTap.Screen name="Registros" component={StRepCheck} />
    </StaffTap.Navigator>
  );
};

//Tap que abarca todas las ventanas ralacionadas con el prestador de servicio
const SocialServiceApp = () => {
  return (
    <SocialServiceTap.Navigator
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
      <SocialServiceTap.Screen name="Principal" component={SocialServiceHome} />
      <SocialServiceTap.Screen name="Reparaciones" component={Fixes} />
      <SocialServiceTap.Screen name="Prototipo" component={PrototypingForm} />
      <SocialServiceTap.Screen name="RepProjects" component={PrototypesOnStandby} />
    </SocialServiceTap.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        //initialRouteName="Test"
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AcademicApp" component={AcademicGroupApp} />
        <Stack.Screen name="SocialServiceApp" component={SocialServiceApp} />
        <Stack.Screen
          name="PrototypesOnStandby"
          component={PrototypesOnStandby}
        />
        <Stack.Screen name="StaffApp" component={StaffApp} />
        <Stack.Screen name="Test" component={OrderPageReadOnly} />
        <Stack.Screen name="GeneratePDF" component={GeneratePrototypePDF} />
        <Stack.Screen name="EditSubmission" component={PrototypingFormEdit} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
