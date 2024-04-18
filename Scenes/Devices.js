import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, FlatList, ActivityIndicator } from 'react-native';
import filter from "lodash.filter";
import { useRoute, useFocusEffect } from '@react-navigation/native';

const DevicesPage = ({navigation}) => {
    const route = useRoute();
    const { idClient } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
  
    useFocusEffect(
      React.useCallback(() => {
          setIsLoading(true);
          fetchData("http://10.214.150.5:3000/dispositivos");
      }, [])
    );

    const fetchData = async (url) => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          const filteredData = filter(json, (item) => item.id_cliente === idClient);
          const BData = filteredData.map((registro) => ({
            ...registro,
            Details: false
          }));
          setData(BData);
          setIsLoading(false);
        } catch (error) {
          setError(error);
          console.log(error);
          setIsLoading(false);
        }
    }

    const toggleDetails = (itemId) => {
      // Encuentra el registro con el id correspondiente
      const updatedData = data.map((registro) => {
        if (registro.idCliente === itemId) {
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

    const navigateToClient = (idClient) => {
      navigation.navigate("Client", { idCli: idClient});
    }

    const navigateToAddDevice = () => {
      navigation.navigate("AddDevice", { idCli: idClient});
    }

    return (
        <View
            style={styles.background}
        >
          <Text style={styles.textLng}>{idClient}</Text>
          <TouchableOpacity onPress={() => {navigateToAddDevice()}}>
            <Image
              source = {require('../Resources/imagenes/agregar.png')}
              style = {styles.longImage}
            />
          </TouchableOpacity>
          <FlatList
              data = {data}
              keyExtractor = {(item) => item.id_dispo}
              renderItem={({item}) => {    
                  <View style = {styles.flatlistContainer}>
                    <TouchableOpacity onPress={() => toggleDetails(item.id_dispo)}>
                      <View>
                        <Text style = {styles.textSrt}>Modelo: {item.modelo}</Text>
                        <Text style = {styles.textLng}>Id Dispositivo: {item.id_dispo}</Text>
                      </View>
                    </TouchableOpacity>

                    {
                      item.Details ? <View>
                        <Text style = {styles.textSrt}>Id Cliente: {item.id_cliente}</Text>
                        <Text style = {styles.textSrt}>Fecha: {item.fecha}</Text>
                        <Text style = {styles.textSrt}>S/N: {item.sn}</Text>
                        <Text style = {styles.textSrt}>Caso: {item.caso}</Text>
                        <Text style = {styles.textSrt}>Tipo: {item.tipo_dis}</Text>
                        <Text style = {styles.textSrt}>Estado fisico: {item.estado_fisi}</Text>
                        <Text style = {styles.textSrt}>Marca: {item.marca}</Text>
                        <Text style = {styles.textSrt}>Estado recibido: {item.esta_recep}</Text>
                        <Text style = {styles.textSrt}>Color: {item.color}</Text>
                        <Text style = {styles.textSrt}>Inventario: {item.inventario}</Text>
                      </View>: null
                    }
                      
                  </View>
                }}
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
    textSrt: {        fontSize: 38,
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