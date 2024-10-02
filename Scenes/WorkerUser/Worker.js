import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomViewReverse } from "../components/CustomViewReverse";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import DevicesTest from "./DevicesTest";
import Reports from "./Reports";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const WorkerPage = ({ navigation }) => {
  // const navigateToAddClient = () => {
  //   navigation.navigate("AddClient");
  // };

  const navigateToSearchClient = () => {
    navigation.navigate("SearchClient");
  };

  const Tab = createMaterialTopTabNavigator();

  return (
    <CustomViewReverse>
      <View style={{ marginTop: HEIGHT * 0.05, gap: HEIGHT * 0.02 }}>
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate("AddClient")}
        >
          <Ionicons
            name="add-circle"
            style={{
              fontSize: WIDTH > 400 ? 32 : 24,
              color: "#2272A7",
            }}
          />
          <Text style={styles.text}>Añadir Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate("SearchClient")}
        >
          <Ionicons
            name="clipboard"
            style={{
              fontSize: WIDTH > 400 ? 32 : 24,
              color: "#2272A7",
            }}
          />
          <Text style={styles.text}>Añadir Reporte</Text>
        </TouchableOpacity>
      </View>
      <Tab.Navigator>
        <Tab.Screen name="Devices" component={DevicesTest} />
        <Tab.Screen name="Reports" component={Reports} />
      </Tab.Navigator>
    </CustomViewReverse>
  );
};

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

export default WorkerPage;
