import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, FlatList, ActivityIndicator, TextInput } from 'react-native';
import filter from "lodash.filter";
import { useRoute, useFocusEffect } from '@react-navigation/native';

const DevicesPage = ({ navigation }) => {
  const route = useRoute();
  const { idClient } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  useFocusEffect(
    React.useCallback(() => {
        setIsLoading(true);
        fetchData("http://10.214.150.5:3000/dispositivos");

    }, [])
  );

  const fetchData = async(url) => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        const BData = json.map((registro) => ({
          ...registro,
          Details: false
        }));
        setData(BData);
        setFullData(BData);
        setIsLoading(false);
    } catch(error) {
        setError(error);
        console.log(error);
        setIsLoading(false);
    }
  }

  const toggleDetails = (itemId) => {
    // Encuentra el registro con el id correspondiente
    const updatedData = data.map((registro) => {
      if (registro.idDispo === itemId) {
        return { ...registro, Details: !registro.Details };
      }
      return registro;
    });
    setData(updatedData);
  }

  if(isLoading) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator
            size={'large'}
          />
        </View>
      );
  }

  if(error) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text>Error in fetch data</Text>
        </View>
      );
  }

  const contains = ({nombre, correo}, query) => {
      if(nombre.includes(query) || correo.includes(query)) {
        return true;
      } else {
        return false;
      }
  }

  const navigateToEditClient = (id) => {
    navigation.navigate("EditClient", { idClient: id});
  }

  const navigateToDivices = (id) => {
    navigation.navigate("Devices", { idClient: id});
  }

  return (
      <View
          style={styles.background}
      >
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
              data = {data}
              keyExtractor = {(item) => item.idDispo}
              renderItem={({item}) => (
                  <View style = {styles.flatlistContainer}>
                    <View>
                      <TouchableOpacity onPress={() => toggleDetails(item.idDispo)}>
                        <View>
                            <Text style = {styles.textLng}>{item.idDispo}</Text>
                            <Text style = {styles.textSrt}>{item.modelo}</Text>
                        </View>
                      </TouchableOpacity>

                      {
                        item.Details ? <View>
                          <Text style = {styles.textSrt}>Id Cliente: {item.idCliente}</Text>
                          <Text style = {styles.textSrt}>S/N: {item.sn}</Text>
                          <Text style = {styles.textSrt}>Caso: {item.caso}</Text>
                          <Text style = {styles.textSrt}>Tipo: {item.tipoDis}</Text>
                          <Text style = {styles.textSrt}>Estado fisico: {item.estadoFisi}</Text>
                          <Text style = {styles.textSrt}>Marca: {item.marca}</Text>
                          <Text style = {styles.textSrt}>Estado recibido: {item.estaRecip}</Text>
                          <Text style = {styles.textSrt}>Color: {item.color}</Text>
                          <Text style = {styles.textSrt}>Inventario: {item.inventario}</Text>
                        </View>: null
                      }
                    </View>
                  </View>
              )}
          />
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#095ea7',
  },
  flatlistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  searchBox: {
    padding: 10,
    margin: 5,
    fontSize: 30,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white'
  },
  buttom: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  textLng: {
    fontSize: 50,
    marginLeft: 10,
    fontWeight: "bold",
    color: "white"
  },
  textSrt: {        
    fontSize: 38,
    marginLeft: 10,
    color: "white",
  },
  image: {
    width: 120,
    height: 120,
  },
  longImage: {
    width: 160,
    height: 120,    
    margin: 50,
  },
});

export default DevicesPage;