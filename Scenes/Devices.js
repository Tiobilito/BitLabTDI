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
        setData(filter(BData, { 'idCliente': idClient }));
        setFullData(filter(BData, { 'idCliente': idClient }));
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

  const contains = ({modelo}, query) => {
    if (modelo.includes(query)) {
      return modelo.includes(query);
    } else {
      return false;
    }
  }

  const navigateToEditDevice = (id) => {
    navigation.navigate("EditDevice", { idDevice: id});
  }

  const navigateToAddDevice = (id) => {
    navigation.navigate("AddDevice", { idCli: id});
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
                  const filteredData = filter(fullData, (modelo) => {
                    return contains(modelo, formattedQuery);
                  });
                  setData(filteredData);
              }}
              value={searchQuery}
              placeholder="Search" 
          />
          <TouchableOpacity onPress={() => {navigateToAddDevice(idClient)}}>
            <Image
              source={require("../Resources/imagenes/agregar.png")}
              style = {styles.image}
            />
          </TouchableOpacity>
          <FlatList
              data = {data}
              keyExtractor = {(item) => item.idDispo}
              renderItem={({item}) => (
                  <View style = {styles.flatlistContainer}>
                    <View>
                      <TouchableOpacity onPress={() => toggleDetails(item.idDispo)}>
                        <View>
                            <Text style = {styles.textLng}>Modelo: {item.modelo}</Text>
                            <Text style = {styles.textSrt}>Id: {item.idDispo}</Text>
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
                          <View style = {styles.buttoms}>
                            <TouchableOpacity onPress={() => console.log("espere funcionalidad")}>
                              <Image
                                source={require("../Resources/imagenes/agregar.png")}
                                style = {styles.image}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {navigateToEditDevice(item.idDispo)}}>
                              <Image
                                  source = {require('../Resources/imagenes/editar.png')}
                                  style = {styles.image}
                              />
                            </TouchableOpacity>
                          </View>
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
    marginTop: 15,
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
  buttoms: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
    paddingHorizontal: 20,
  },
});

export default DevicesPage;