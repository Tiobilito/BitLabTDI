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

const { width, height } = Dimensions.get("window");

const WorkerPage = ({ navigation }) => {
  const route = useRoute();
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
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

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

  return (
    <CustomViewReverse>
      <View style={{ marginTop: height * 0.05, gap: height * 0.02 }}>
        {/* Botones */}
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate("AddClient")}
        >
          <Ionicons
            name="add-circle"
            style={styles.iconAction}
          />
          <Text style={styles.text}>Añadir Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate("SearchClient")}
        >
          <Ionicons
            name="clipboard"
            style={styles.iconAction}
          />
          <Text style={styles.text}>Añadir Reporte</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de visualización */}
      <View style={styles.btnShowStats}>
        <TouchableOpacity
          style={styles.btnShow}
          onPress={() => toggleList()}
        >
          <Ionicons name="add-circle" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Dispositivos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnShow}
          onPress={() => toggleList()}
        >
          <Ionicons name="clipboard" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Reportes</Text>
        </TouchableOpacity>
      </View>

      {/* Tabla de dispositivos */}
      <View style={styles.tables}>
        <FlatList
          data={fullData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style= {styles.textFlatlist}>ID del trabajador: {item.customer_id}</Text>
              <Text style= {styles.textFlatlist}>Nombre del dispositivo: {item.model}</Text>
              <Text style= {styles.textFlatlist}>Fecha de recibido: {item.received_date}</Text>
            </View>
          )}
        />
      </View>
    </CustomViewReverse>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: "90%",
    color: "#ff0000",
    textAlign: "center",
  },
  text: {
    fontSize: "90%", // Escalabilidad en función del ancho
    fontWeight: "bold",
    color: "#2272A7",
  },
  textShowStats: {
    fontSize: "90%", // Ajuste del tamaño del texto en función del ancho
    fontWeight: "bold",
    color: "#2272A7",
  },
  textFlatlist: {
    fontSize: "80%", // Ajuste del tamaño del texto en función del ancho
    fontWeight: "bold",
    color: "white",
  },
  iconAction: {
    fontSize: "90%", // Escalar el tamaño del ícono
    color: "#2272A7",
  },
  iconShowStats: {
    fontSize: "90%", // Ajustar el tamaño de los íconos de estado
    color: "#2272A7",
  },
  btnAction: {
    width: width * 0.85,
    height: height * 0.08,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    padding: 10,
    marginBottom: height * 0.02,
  },
  btnShowStats: {
    flexDirection: "row",
    gap: width * 0.04,
    marginTop: height * 0.02,
  },
  btnShow: {
    width: width * 0.45,
    height: height * 0.07,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  tables: {
    width: width * 0.9,
    height: height * 0.55,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    margin: height * 0.008,
    padding: width * 0.02,
    borderRadius: 10,
  },
});

export default WorkerPage;
