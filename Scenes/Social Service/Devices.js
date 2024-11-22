import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import filter from "lodash.filter";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { getAllDevices } from "../../Modules/Operations DB Fixes";

const DevicesPage = ({ navigation }) => {
  const route = useRoute();
  const { idClient } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      const filteredData = filter(BData, { customer_id: idClient });
      setData(filteredData);
      setFullData(filteredData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  const toggleDetails = (itemId) => {
    const updatedData = data.map((registro) => {
      if (registro.id === itemId) {
        return { ...registro, Details: !registro.Details };
      }
      return registro;
    });
    setData(updatedData);
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
        <Text style={styles.errorText}>Error in fetch data</Text>
      </View>
    );
  }

  const contains = ({ model }, query) => {
    return model && model.includes(query);
  };

  const navigateToEditDevice = (id) => {
    navigation.navigate("EditDevice", { idDevice: id });
  };

  const navigateToOrder = (id) => {
    navigation.navigate("Order", { idDevice: id });
  };

  const navigateToAddDevice = (id) => {
    navigation.navigate("AddDevice", { idCli: id });
  };

  return (
    <View style={styles.background}>
      <TextInput
        style={styles.searchBox}
        onChangeText={(query) => {
          setSearchQuery(query);
          const filteredData = filter(fullData, (item) => contains(item, query));
          setData(filteredData);
        }}
        value={searchQuery}
        placeholder="Search devices"
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToAddDevice(idClient)}
      >
        <Image
          source={require("../../Resources/imagenes/agregar.png")}
          style={styles.addImage}
        />
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleDetails(item.id)} style={styles.item}>
              <View style={styles.info}>
                <Text style={styles.modelText}>Modelo: {item.model}</Text>
                <Text style={styles.idText}>        Id: {item.id}</Text>
              </View>
            </TouchableOpacity>
            {item.Details && (
              <View style={styles.details}>
                <Text style={styles.detailText}>Id Cliente: {item.customer_id}</Text>
                <Text style={styles.detailText}>S/N: {item.serial_number}</Text>
                <Text style={styles.detailText}>Descripción reparacion: {item.rework_description}</Text>
                <Text style={styles.detailText}>Tipo: {item.device_type}</Text>
                <Text style={styles.detailText}>Estado recibido: {item.received_status}</Text>
                <Text style={styles.detailText}>Marca: {item.brand}</Text>
                <Text style={styles.detailText}>Color: {item.color}</Text>
                <Text style={styles.detailText}>Inventario: {item.inventory_items}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity onPress={() => navigateToEditDevice(item.id)}>
                    <Image
                      source={require("../../Resources/imagenes/editar.png")}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigateToOrder(item.id)}>
                    <Image
                      source={require("../../Resources/imagenes/orden.png")}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 30,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#095ea7",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
  },
  searchBox: {
    padding: 10,
    margin: 5,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    borderColor: "#ddd",
  },
  addButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  addImage: {
    width: 50,
    height: 50,
  },
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#0a75d1",
    borderRadius: 8,
    overflow: "hidden",
  },
  item: {
    padding: 10,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  modelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  idText: {
    fontSize: 14,
    color: "#ffffff",
  },
  details: {
    padding: 10,
    backgroundColor: "#0a75d1",
  },
  detailText: {
    fontSize: 14,
    color: "#ffffff",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  buttonImage: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});

export default DevicesPage;
