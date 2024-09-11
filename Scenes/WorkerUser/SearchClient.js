import React, { useState, useCallback } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import filter from "lodash.filter";
import { useFocusEffect } from "@react-navigation/native";
import { getAllClients } from "../../Modules/OperacionesBD";

const Scale = Dimensions.get("window").width;

const SearchPage = ({ navigation }) => {
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
      const Data = await getAllClients();
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }));
      setData(BData);
      setFullData(BData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  const toggleDetails = (itemId) => {
    const updatedData = data.map((registro) => {
      if (registro.id_cliente === itemId) {
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

  const contains = ({ nombre, correo }, query) => {
    return nombre.includes(query) || correo.includes(query);
  };

  const navigateToEditClient = (id) => {
    navigation.navigate("EditClient", { idClient: id });
  };

  const navigateToDevices = (id) => {
    navigation.navigate("Devices", { idClient: id });
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
        placeholder="Search contacts"
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id_cliente.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleDetails(item.id_cliente)} style={styles.item}>
              <View style={styles.avatarContainer}>
                <Image
                  source={item.avatar ? { uri: item.avatar } : require("../../Resources/imagenes/default-avatar.jpg")}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.email}>{item.correo}</Text>
              </View>
            </TouchableOpacity>
            {item.Details && (
              <View style={styles.details}>
                <Text style={styles.detailText}>ID: {item.id_cliente}</Text>
                <Text style={styles.detailText}>Direccion: {item.direccion}</Text>
                <Text style={styles.detailText}>Colonia: {item.colonia}</Text>
                <Text style={styles.detailText}>Ciudad: {item.ciudad}</Text>
                <Text style={styles.detailText}>Codigo postal: {item.cp}</Text>
                <Text style={styles.detailText}>Telefono: {item.telefono}</Text>
                <Text style={styles.detailText}>2do Telefono: {item.telefono2}</Text>
                <View style={styles.buttons}>
                  <TouchableOpacity onPress={() => navigateToEditClient(item.id_cliente)}>
                    <Image
                      source={require("../../Resources/imagenes/editar.png")}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigateToDevices(item.id_cliente)}>
                    <Image
                      source={require("../../Resources/imagenes/device.png")}
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
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#0a75d1",
    borderRadius: 8,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  email: {
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

export default SearchPage;
