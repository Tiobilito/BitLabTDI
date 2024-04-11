import { React, useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Image, View, FlatList, ActivityIndicator } from 'react-native';
import filter from "lodash.filter";

const SearchPage = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
  
    useEffect(() => {
      setIsLoading(true);
      fetchData("http://10.214.150.5:3000/clientes");
    }, []);

    const fetchData = async(url) => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          setData(json);
          setFullData(json);
          setIsLoading(false);
        } catch(error) {
          setError(error);
          console.log(error);
          setIsLoading(false);
        }
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

    const navigateToClient = (idClient) => {
      navigation.navigate("Client", { idCli: idClient});
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
                keyExtractor = {(item) => item.idCliente}
                renderItem={({item}) => (
                    <View style = {styles.flatlistContainer}>
                      <View>
                          <Text style = {styles.textName}>{item.nombre}</Text>
                          <Text style = {styles.textEmail}>{item.correo}</Text>
                      </View>
                      <TouchableOpacity onPress={() => navigateToClient(item.idCliente)}>
                        <Image
                          source = {require('../Resources/imagenes/buscar (1).png')}
                          style = {styles.image}
                        />
                      </TouchableOpacity>
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
    textName: {
        fontSize: 50,
        marginLeft: 10,
        fontWeight: "bold",
        color: "white"
    },
    textEmail: {
        fontSize: 38,
        marginLeft: 10,
        color: "white",
    },
    image: {
        width: 120,
        height: 120,
    },
});

export default SearchPage;