import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomViewReverse } from "../components/CustomViewReverse";

import { getAllDevices } from "../../Modules/OperacionesBD";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const StudentPage = ({ navigation }) => {
  const route = useRoute();
  //const { idClient } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showListDevice, setShowListDevice] = useState(false);
  const [showListReport, setShowListReport] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const Data = await getAllDevices();
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }));
      setData(BData);
      setFullData(BData);
      console.log(BData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  // const toggleList = () => {

  // };

  // const toggleListReports = () => {
  //   setShowListReport(!showListReport);
  //   console.log("Presionado reportes");
  // };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error en la obtención de datos</Text>
      </View>
    );
  }

  const navigateToEditClient = (code) => {
    navigation.navigate("EditDevice", { id: code });
  };

  const navigateToDevices = (code) => {
    navigation.navigate("Devices", { id: code });
  };

  return (
    <CustomViewReverse>
      <View style={{ marginTop: HEIGHT * 0.05, gap: HEIGHT * 0.02 }}>
        {/*  View para los botones */}
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
      <View style={styles.btnShowStats}>
        <TouchableOpacity
          style={styles.btnShow}
          //onPress={() => console.log("Devices")}
          onPress={() => toggleList()}
        >
          <Ionicons name="add-circle" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnShow}
          //onPress={() => console.log("Reports")}
          onPress={() => toggleList()}
        >
          <Ionicons name="clipboard" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Reportes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tables}>
        <FlatList
          data={fullData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>ID del trabajador: {item.customer_id}</Text>
              <Text>Nombre del dispositivo: {item.model}</Text>
              <Text>Fecha de recibido: {item.received_date}</Text>
            </View>
          )}
        />
      </View>
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
  textShowStats: {
    fontSize: WIDTH > 400 ? 24 : 16,
    fontWeight: "bold",
    color: "#2272A7",
  },
  icon: {
    fontSize: WIDTH > 400 ? 32 : 24,
    color: "#2272A7",
  },
  iconShowStats: {
    fontSize: WIDTH > 400 ? 24 : 16,
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
  btnShowStats: {
    flexDirection: "row",
    gap: WIDTH * 0.04,
    marginTop: HEIGHT * 0.02,
  },
  btnShow: {
    width: WIDTH * 0.45,
    height: HEIGHT * 0.07,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: WIDTH * 0.04,
  },
  tables: {
    width: WIDTH * 0.9,
    height: HEIGHT * 0.55,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    margin: HEIGHT * 0.008,
    padding: WIDTH * 0.02,
    borderRadius: 10,
  },
});

export default StudentPage;
