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
import { getAllClientUsers } from "../../Modules/Operations DB Users";
import { CustomViewReverse } from "../components/CustomViewReverse";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

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
      const Data = await getAllClientUsers();
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
      if (registro.code === itemId) {
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
        <Text style={styles.errorText}>Error en la obtención de datos</Text>
      </View>
    );
  }

  const contains = ({ name, email }, query) => {
    return (
      name.toLowerCase().includes(query.toLowerCase()) ||
      email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const navigateToEditClient = (code) => {
    navigation.navigate("EditClient", { idClient: code });
  };

  const navigateToDevices = (code) => {
    navigation.navigate("Devices", { idClient: code });
  };

  return (
    <CustomViewReverse>
      <View
        style={{
          height: HEIGHT * 0.88,
          width: WIDTH * 0.9,
          marginTop: HEIGHT * 0.04,
        }}
      >
        <TextInput
          style={styles.searchBox}
          onChangeText={(query) => {
            setSearchQuery(query);
            const filteredData = filter(fullData, (item) =>
              contains(item, query)
            );
            setData(filteredData);
          }}
          value={searchQuery}
          placeholder="Buscar contactos"
        />
        <View
          style={{
            width: WIDTH * 0.9,
            height: HEIGHT * 0.8,
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 8,
            marginTop: 8,
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.code.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => toggleDetails(item.code)}
                  style={styles.item}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={
                        item.avatar
                          ? { uri: item.avatar }
                          : require("../../Resources/imagenes/default-avatar.jpg")
                      }
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
                {item.Details && (
                  <View style={styles.details}>
                    <Text style={styles.detailText}>Código: {item.code}</Text>
                    <Text style={styles.detailText}>
                      Dirección: {item.address}
                    </Text>
                    <Text style={styles.detailText}>
                      Código Postal: {item.zip_code}
                    </Text>
                    <Text style={styles.detailText}>
                      Teléfono: {item.number}
                    </Text>
                    <Text style={styles.detailText}>
                      Otro Teléfono: {item.second_number}
                    </Text>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() => navigateToEditClient(item.code)}
                      >
                        <Image
                          source={require("../../Resources/imagenes/editar.png")}
                          style={styles.buttonImage}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigateToDevices(item.code)}
                      >
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
      </View>
    </CustomViewReverse>
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
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#2272A7",
    borderRadius: 8,
    //overflow: "hidden",
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
    backgroundColor: "#2272A7",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
