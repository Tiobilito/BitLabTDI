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

    return (
        <View style = {styles.background}>
            <ScrollView>
                <View style = {{ margin: 20 }}>
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
                            onValueChange={(itemValue) => setDepartment(itemValue)}                            
                        >
                            <Picker.Item label="iLabTDI" value="iLabTDI" />
                            {depData.map((item) => {
                                return (<Picker.Item key={item.idDepartamento} label={item.nombreDepa} value={item.nombreDepa}/>)
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
    input: {
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
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        marginRight: 10,
        color: "white",
    },
});

export default OrderPage;