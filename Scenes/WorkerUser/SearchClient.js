import React, { useState, useEffect } from "react";
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
    React.useCallback(() => {
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
    // Encuentra el registro con el id correspondiente
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Error in fetch data</Text>
      </View>
    );
  }

  const contains = ({ nombre, correo }, query) => {
    if (nombre.includes(query) || correo.includes(query)) {
      return true;
    } else {
      return false;
    }
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
          const formattedQuery = query;
          const filteredData = filter(fullData, (nombre) => {
            return contains(nombre, formattedQuery);
          });
          setData(filteredData);
        }}
        value={searchQuery}
        placeholder="Search"
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id_cliente}
        renderItem={({ item }) => (
          <View style={styles.flatlistContainer}>
            <View>
              <TouchableOpacity onPress={() => toggleDetails(item.id_cliente)}>
                <View>
                  <Text style={styles.textLng}>{item.nombre}</Text>
                  <Text style={styles.textSrt}>{item.correo}</Text>
                </View>
              </TouchableOpacity>

              {item.Details ? (
                <View>
                  <Text style={styles.textSrt}>ID: {item.id_cliente}</Text>
                  <Text style={styles.textSrt}>
                    Direccion: {item.direccion}
                  </Text>
                  <Text style={styles.textSrt}>Colonia: {item.colonia}</Text>
                  <Text style={styles.textSrt}>Ciudad: {item.ciudad}</Text>
                  <Text style={styles.textSrt}>Codigo postal: {item.cp}</Text>
                  <Text style={styles.textSrt}>Telefono: {item.telefono}</Text>
                  <Text style={styles.textSrt}>
                    2do Telefono: {item.telefono2}
                  </Text>
                  <View style={styles.buttoms}>
                    <TouchableOpacity
                      onPress={() => {
                        navigateToEditClient(item.id_cliente);
                      }}
                    >
                      <Image
                        source={require("../../Resources/imagenes/editar.png")}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigateToDevices(item.id_cliente);
                      }}
                    >
                      <Image
                        source={require("../../Resources/imagenes/device.png")}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#095ea7",
  },
  flatlistContainer: {
    backgroundColor: "#0a75d1",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  searchBox: {
    padding: 10,
    margin: 5,
    fontSize: Scale > 400 ? 30 : 25,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "white",
  },
  buttom: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  textLng: {
    fontSize: Scale > 400 ? 50 : 30,
    marginLeft: 10,
    fontWeight: "bold",
    color: "white",
  },
  textSrt: {
    fontSize: Scale > 400 ? 38 : 20,
    marginLeft: 10,
    color: "white",
  },
  image: {
    width: Scale > 400 ? 100 : 60,
    height: Scale > 400 ? 100 : 60,
    margin: 20,
  },
  buttoms: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
});

export default SearchPage;
