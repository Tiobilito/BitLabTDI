import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Scenes proposito general
import LoginPage from "./Scenes/Login";
import Register from "./Scenes/Register";
import SettingsPage from "./Scenes/Settings";

// Scenes Prestador de servicio
import SocialServicePage from "./Scenes/Social Service/Prestador de Servicio"; // Pantalla principal prestador de servicio
import AddClientPage from "./Scenes/Social Service/AddClient"; // Agregar cliente
import AddDevicePage from "./Scenes/Social Service/AddDevice"; // Agregar dispositivo
import SearchClientPage from "./Scenes/Social Service/SearchClient"; // Buscar cliente
import DevicesPage from "./Scenes/Social Service/Devices"; // Dispositivos del cliente
import EditClientPage from "./Scenes/Social Service/EditClient"; // Editar cliente
import EditDevicePage from "./Scenes/Social Service/EditDevice"; // Editar dispositivo
import OrderPage from "./Scenes/Social Service/Order"; // Orden de reparación
import OrderPageReadOnly from "./Scenes/Social Service/OrderReports"; // Orden de reparación en modo lectura

// Scenes Laboratorio de Prototipado
import PrototypingForm from "./Scenes/Prototyping Laboratory/PrototypingForm"; // Formulario de prototipos
import PrototypingCheck from "./Scenes/Prototyping Laboratory/PrototypingReportCheck"; // Revisión de prototipos
import PrototypesOnStandby from "./Scenes/Prototyping Laboratory/PrototypesOnStandby"; // Prototipos en espera (Proxima a desaparecer)
import PrototypingFormReadOnly from "./Scenes/Prototyping Laboratory/PrototypingFormReadOnly"; // Formulario de prototipos en modo lectura
import GeneratePrototypePDF from "./Scenes/Prototyping Laboratory/GeneratePrototypePDF"; // Generar PDF de prototipos
import PrototypingFormEdit from "./Scenes/Prototyping Laboratory/PrototypingFormEditable"; // Formulario de prototipos editable
import PrototypingReportsPage from "./Scenes/Prototyping Laboratory/PrototypingReports"; // Reportes de prototipos (Revisar)
import PrototypingAlreadyChecked from "./Scenes/Prototyping Laboratory/PrototypingReportAlreadyChecked"; // Reportes de prototipos ya revisados
import PrototypingReportStDone from "./Scenes/Prototyping Laboratory/PrototypingReportStDone"; // Reportes de prototipos ya revisados con estatus Definitivo

// Scenes Jefe de División y Laboratorio
import HeadDivisionLaboratoryPage from "./Scenes/Academic Group Users/Head of Division and Laboratory"; // Pantalla principal jefe de división y laboratorio

// Scenes Grupo Académico
import TeacherStudentPage from "./Scenes/Academic Group Users/TeacherStudent"; // Pantalla principal grupo académico

const Stack = createNativeStackNavigator();
const SocialServiceTap = createBottomTabNavigator();
const StudentsTap = createBottomTabNavigator();
const StaffTap = createBottomTabNavigator();
const SocialServiceStack = createNativeStackNavigator();
const RepairClientDevicesStack = createNativeStackNavigator();
const ReportCheckStack = createNativeStackNavigator();
const ReportListAG = createNativeStackNavigator();
const AcademicGroupStack = createNativeStackNavigator();
const StaffStack = createNativeStackNavigator();

//Stack que abarca todas las ventanas relacionadas con los reportes del grupo academico
function PrototypingReportsAG() {
  return (
    <ReportListAG.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ReportsList"
    >
      <ReportListAG.Screen
        name="ReportsList"
        component={PrototypingReportsPage}
      />
      <ReportListAG.Screen
        name="GeneratePDF"
        component={GeneratePrototypePDF}
      />
      <ReportListAG.Screen
        name="EditSubmission"
        component={PrototypingFormEdit}
      />
    </ReportListAG.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con los estudiantes y maestros
function AcademicGroupHome() {
  return (
    <AcademicGroupStack.Navigator screenOptions={{ headerShown: false }}>
      <AcademicGroupStack.Screen name="Home" component={TeacherStudentPage} />
      <AcademicGroupStack.Screen
        name="ReportForm"
        component={PrototypingForm}
      />
      <AcademicGroupStack.Screen
        name="OrderRead"
        component={OrderPageReadOnly}
      />
      <AcademicGroupStack.Screen
        name="GeneratePDF"
        component={GeneratePrototypePDF}
      />
    </AcademicGroupStack.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con el jefe de division y de laboratorio (home)
function StaffHome() {
  return (
    <StaffStack.Navigator screenOptions={{ headerShown: false }}>
      <StaffStack.Screen name="Home" component={HeadDivisionLaboratoryPage} />
      <StaffStack.Screen name="ReportForm" component={PrototypingForm} />
    </StaffStack.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con el prestador de servicio (home)
function SocialServiceHome() {
  return (
    <SocialServiceStack.Navigator screenOptions={{ headerShown: false }}>
      <SocialServiceStack.Screen
        name="SocialService"
        component={SocialServicePage}
      />
      <SocialServiceStack.Screen name="AddClient" component={AddClientPage} />
    </SocialServiceStack.Navigator>
  );
}

//Stack que abarca todas las ventanas relacionadas con la verificacion en cascada de los reportes de prototipos
function StRepCheck() {
  return (
    <ReportCheckStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Check"
    >
      <ReportCheckStack.Screen
        name="RepProjects"
        component={PrototypesOnStandby}
      />
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
          } else if (route.name === "Reportes Protoripado") {
            iconName = focused ? "reader" : "reader-outline";
          } else if (route.name === "Configuración") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <StudentsTap.Screen name="Principal" component={AcademicGroupHome} />
      <StudentsTap.Screen
        name="Reportes Protoripado"
        component={PrototypingReportsAG}
      />
      <StudentsTap.Screen name="Configuración" component={SettingsPage} />
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
          } else if (route.name === "Prototipo") {
            iconName = focused
              ? "hardware-chip-sharp"
              : "hardware-chip-outline";
          } else if (route.name === "Configuración") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <StaffTap.Screen name="Principal" component={StaffHome} />
      <StaffTap.Screen name="Registros" component={StRepCheck} />
      <StaffTap.Screen name="Configuración" component={SettingsPage} />
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
          } else if (route.name === "Registros") {
            iconName = focused ? "reader" : "reader-outline";
          } else if (route.name === "Configuración") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <SocialServiceTap.Screen name="Principal" component={SocialServiceHome} />
      <SocialServiceTap.Screen name="Reparaciones" component={Fixes} />
      <StaffTap.Screen name="Registros" component={StRepCheck} />
      <SocialServiceTap.Screen name="Configuración" component={SettingsPage} />
    </SocialServiceTap.Navigator>
  );
};

//Función principal que contiene todas las rutas de la aplicación
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AcademicApp" component={AcademicGroupApp} />
        <Stack.Screen name="SocialServiceApp" component={SocialServiceApp} />
        <Stack.Screen name="StaffApp" component={StaffApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
