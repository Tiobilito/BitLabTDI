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
import { getPrototypeStandby } from "../../Modules/Operations DB Prototyping";
import { CustomViewReverse } from "../components/CustomViewReverse";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const PrototypesOnStandby = ({ navigation }) => {
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
      const Data = await getPrototypeStandby();
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

  const handleItemPress = (id) => {
    navigation.navigate("FormRead", { id });
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

  const contains = ({ applicant_name, contact_email }, query) => {
    return (
      applicant_name.toLowerCase().includes(query.toLowerCase()) ||
      contact_email.toLowerCase().includes(query.toLowerCase())
    );
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
            height: HEIGHT * 0.65,
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 8,
            marginTop: 8,
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => handleItemPress(item.id)}
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
                    <Text style={styles.applicant_name}>
                      {item.applicant_name}
                    </Text>
                    <Text style={styles.contact_email}>
                      {item.contact_email}
                    </Text>
                  </View>
                </TouchableOpacity>
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
  applicant_name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  contact_email: {
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
    resizeMode: "contain",
    tintColor: "#ffffff",
  },
  generatePDFButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2272A7",
    textAlign: "center",
  },
});

export default PrototypesOnStandby;
