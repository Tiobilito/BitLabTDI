import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
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

    useEffect(() => {
        GetDepData("http://10.214.150.5:3000/departamentos");
        GetDeviceData("http://10.214.150.5:3000/dispositivos");
    }, []);

    const GetDepData = async(url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setDepData(json);
        } catch(error) {
            setError(error);
            console.log(error);
            setIsLoading(false);
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

    return (
        <View>
            <ScrollView>
                <View style = {{ margin: 20 }}>
                    <Text style={styles.text}>ID - Dispositivo: {idDevice}</Text>
                    <Text style={styles.text}>ID - Cliente: {idClient}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Partes utilizadas: </Text>
                            <TextInput
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                                onChangeText={(text) => {
                                    setPartsUsed(text);
                                }}
                                value={partsUsed}
                                placeholder="Partes utilizadas"
                            />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Diagnostigo general: </Text>
                            <TextInput
                                multiline
                                numberOfLines={4}
                                style={styles.input}
                                onChangeText={(text) => {
                                    setGeneDiag(text);
                                }}
                                value={geneDiag}
                                placeholder="Diagnostigo general"
                            />
                    </View>
                    <View>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                        >
                            <Picker.Item label="Selecciona una opción" value="" />
                            <Picker.Item label="Recibido" value="Recibido" />
                            <Picker.Item label="Pendiente" value="Pendiente" />
                            <Picker.Item label="Reparado" value="Reparado" />
                            <Picker.Item label="No Reparado" value="No Reparado" />
                            <Picker.Item label="Traer Despues" value="Traer Despues" />
                            <Picker.Item label="Revisado" value="Revisado" />
                            <Picker.Item label="Otro" value="Otro" />
                        </Picker>
                        <Picker
                            selectedValue={department}
                            onValueChange={(itemValue) => setDepartment(itemValue)}                            
                        >
                            <Picker.Item label="Selecciona una opción" value="" />
                            {depData.map((item) => {
                                return (<Picker.item label={item.nombreDepa} value={item.nombreDepa}/>)
                            })}
                        </Picker>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default OrderPage;