import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ScrollView, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

const OrderPage = ({ navigation }) => {
    const route = useRoute();
    const { idDevice } = route.params;
    const [ShowCost, setShowCost] = useState(false);
    const [idOrder, setIdOrder] = useState(0);
    const [idClient, setIdClient] = useState(0);
    const [partsUsed, setPartsUsed] = useState('');
    const [geneDiag, setGeneDiag] = useState('');
    const [status, setStatus] = useState('');
    const [department, setDepartment] = useState('');
    const [discounts, setDiscounts] = useState(0);
    const [typePay, setTypePay] = useState('');
    const [total, setTotal] = useState(0);
    const [depData, setDepData] = useState([]);
    //All cost const
    const [cost, setCost] = useState([]);
    const [descripCost, setDescripCost] = useState('');
    const [iva, setIva] = useState(false);
    const [ivaBtext, setIvaBText] = useState('off');
    const [buttonColor, setButtomColor] = useState('red');
    const [price, setPrice] = useState('');

    useEffect(() => {
        GetDepData("http://10.214.150.5:3000/departamentos");
        GetDeviceData("http://10.214.150.5:3000/dispositivos");
        setIdOrder(Math.floor(Math.random() * 9000000) + 1);
    }, []);

    const GetDepData = async(url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setDepData(json);
        } catch(error) {
            console.log(error);
        }
    }

    const GetDeviceData = async(url) => {
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener los datos');
            }
            return response.json();
          })
          .then(data => {
            data.forEach(item => {
              if (item.idDispo === idDevice) {
                setIdClient(item.idCliente);
              }
            });
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    };

    const handleIva = () => {
        setButtomColor(buttonColor === 'red' ? 'blue' : 'red');
        setIvaBText(buttonColor === 'red' ? 'On' : 'Off');
        setIva(iva === false ? true : false);
    }

    const toggleCost = () => {
        setShowCost(!ShowCost);
    }

    return (
        <View style = {styles.background}>
            <ScrollView>
                <View style = {{ margin: 20 }}>
                    <Text style={styles.text}>ID - Orden: {idOrder}</Text>
                    <Text style={styles.text}>ID - Dispositivo: {idDevice}</Text>
                    <Text style={styles.text}>ID - Cliente: {idClient}</Text>
                    <Text style={styles.text}>Partes utilizadas: </Text>
                        <TextInput
                            multiline
                            style={[styles.input, styles.multilineText]}
                            onChangeText={(text) => {
                                setPartsUsed(text);
                            }}
                            value={partsUsed}
                            placeholder="Partes utilizadas"
                        />
                    <Text style={styles.text}>Diagnostigo general: </Text>
                        <TextInput
                            multiline
                            style={[styles.input, styles.multilineText]}
                            onChangeText={(text) => {
                                setGeneDiag(text);
                            }}
                            value={geneDiag}
                            placeholder="Diagnostigo general"
                        />
                    <View>
                        <Text style={styles.text}>Estatus: </Text>
                        <Picker
                            selectedValue={status}
                            itemStyle = {styles.text}  
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Recibido" value="Recibido" />
                            <Picker.Item label="Pendiente" value="Pendiente" />
                            <Picker.Item label="Reparado" value="Reparado" />
                            <Picker.Item label="No Reparado" value="No Reparado" />
                            <Picker.Item label="Traer Despues" value="Traer Despues" />
                            <Picker.Item label="Revisado" value="Revisado" />
                            <Picker.Item label="Otro" value="Otro" />
                        </Picker>
                        <Text style={styles.text}>Departamento: </Text>
                        <Picker
                            selectedValue={department}
                            itemStyle = {styles.text}  
                            onValueChange={(itemValue) => setDepartment(itemValue)}                       
                        >
                            <Picker.Item label="iLabTDI" value="iLabTDI" />
                            {depData.map((item) => {
                                return (<Picker.Item key={item.idDepartamento} label={item.nombreDepa} value={item.nombreDepa}/>)
                            })}
                        </Picker>
                        <View style = {styles.inputContainer}>
                            <Text style={styles.text}>Costos: </Text> 
                            <TouchableOpacity onPress={() => toggleCost()}>
                                <Image
                                    source = {require('../Resources/imagenes/agregar3.png')}
                                    style = {styles.image}
                                />
                            </TouchableOpacity>
                        </View> 
                        {
                            ShowCost ? <View style={styles.subWin}>
                                <TextInput
                                    multiline
                                    style={[styles.input, styles.multilineText]}
                                    onChangeText={(text) => {
                                        setDescripCost(text);
                                    }}
                                    value={descripCost}
                                    placeholder="Descripcion Costo"
                                />
                                <View style = {styles.inputContainer}>
                                    <Text style = {styles.text}>Precio: </Text>
                                            <TextInput
                                                style = {styles.input}
                                                onChangeText={(text) => {
                                                    setPrice(text);
                                                }}
                                                value={price}
                                                placeholder="Precio"
                                            />
                                </View>
                                <View style = {styles.inputContainer}>
                                    <Text style = {styles.text}>Iva: </Text>
                                    <Button
                                        title={ivaBtext}
                                        color={buttonColor}
                                        onPress={() => handleIva()}
                                    />
                                </View>
                            </View>: null
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    subWin: {
        flex: 1,
        margin: 20,
        backgroundColor: '#0a75d1',
    },  
    background: {
        flex: 1,
        backgroundColor: '#095ea7',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20, // Espacio horizontal entre elementos
        marginTop: 10,
    },
    input: {
        margin: 20,
        flex: 1,
        padding: 10,
        fontSize: 30,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    multilineText: {
        minHeight: 150,
        maxHeight: 150,
        textAlignVertical: "top",
    },
    image: {
        width: 60,
        height: 60,
      },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        marginRight: 10,
        color: "white",
    },
    flatlistContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 15,
    },
});

export default OrderPage;