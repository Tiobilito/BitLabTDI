import { React, useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, TextInput, View, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const AddDevicePage = ({navigation}) => {
    const route = useRoute();
    const { idCli } = route.params;
    const [Sn, setSn] = useState('');
    const [Type, setType] = useState('');
    const [Model, setModel] = useState('');
    const [PhysiCond, setPhysiCond] = useState('');
    const [Brand, setBrand] = useState('');
    const [ReceidStat, setReceidStat] = useState('');
    const [Color, setColor] = useState('');
    const [Case, setCase] = useState('');
    const [Inventory, setInventory] = useState('');

    const SentData = () => {
        const Data = {
            id_dispo: Math.floor(Math.random() * 9000000) + 1,
            sn: Sn,
            tipo_dis: Type,
            id_cliente: idCli,
            modelo: Model,
            estado_fisi: PhysiCond,
            esta_recep: ReceidStat,
            color: Color,
            marca: Brand,
            caso: Case,
            //fecha: new Date().toISOString(),
            inventario: parseInt(Inventory, 10),
        }
        fetch('http://10.214.150.5:3000/dispositivos', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(Data),
        })
        .then(response => response.json())
        .then(Data => console.log(Data))
        .catch(err => console.log(err));
        navigation.navigate("Devices", { idClient: idCli });
    }

    const VerifyAllContents = () => {
        if(Sn && Type && Model && PhysiCond && Brand && ReceidStat && Color && Inventory && Case) {
            SentData();
        }
        else {
            Alert.alert("Por favor rellene todos los datos");
        }
    }
    
    return (
        <View
            style={styles.background}         
        >
            <ScrollView>
                <View style = {{ margin: 20 }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>S/N: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setSn(text);
                            }}
                            value={Sn}
                            placeholder="S/N"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Tipo: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setType(text);
                            }}
                            value={Type}
                            placeholder="Tipo"
                        />                
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Modelo: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setModel(text);
                            }}
                            value={Model}
                            placeholder="Modelo"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Estado Fisico: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setPhysiCond(text);
                            }}
                            value={PhysiCond}
                            placeholder="Estado Fisico"
                        />                
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Marca: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setBrand(text);
                            }}
                            value={Brand}
                            placeholder="Marca"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Caso: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setCase(text);
                            }}
                            value={Case}
                            placeholder="Caso"
                        />                
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Estado recibido: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setReceidStat(text);
                            }}
                            value={ReceidStat}
                            placeholder="Estado recibido"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Inventario: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                if (/^\d+$/.test(text) || text === '') {
                                    setInventory(parseInt(text, 10))
                                }
                            }}
                            keyboardType='numeric'
                            value={Inventory} // convert Inventory to a string
                            placeholder="Inventario"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Color: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                setColor(text);
                            }}
                            value={Color}
                            placeholder="Marca"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={VerifyAllContents}>
                            <Image
                                source={require('../Resources/imagenes/agregar1.png')}
                                style={styles.Buttons}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#095ea7',
      },
    input: {
        flex: 1,
        padding: 10,
        fontSize: 30,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white'
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
        color: 'white'
    },
    Buttons: {
        width: 150,
        height: 150,
        margin: 20,
    },
  });

export default AddDevicePage;