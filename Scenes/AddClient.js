import { React, useState } from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, TextInput, View, ScrollView, Alert } from 'react-native';

const AddCPage = ({navigation}) => {
    const [Name, setName] = useState('');
    const [Addres, setAddres] = useState('');
    const [Colony, setColony] = useState('');
    const [City, setCity] = useState('');
    const [PostCode, setPostCode] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [Phone2, setPhone2] = useState('');
    var Data = {
        idCliente: 0,
        nombre: "",
        direccion: "",
        colonia: "",
        ciudad: "",
        cp: "",
        correo: "",
        telefono: "",
        telefono2: "",
    }

    const navigateToWorker = () => {
        navigation.navigate("Worker");
    };

    const SentData = () => {
        Data.idCliente = Math.floor(Math.random() * 9000000) + 1;
        Data.nombre = Name;
        Data.direccion = Addres;
        Data.colonia = Colony;
        Data.ciudad = City;
        Data.cp = PostCode;
        Data.correo = Email;
        Data.telefono = Phone;
        Data.telefono2 = Phone2;
        fetch('http://10.214.150.5:3000/clientes', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(Data),
        })
        .then(response => response.json())
        .then(Data => console.log(Data))
        .catch(err => console.log(err));
        navigation.navigate("Worker");
    }

    const VerifyAllContents = () => {
        if(Name && Addres && Colony && City && PostCode && Email && Phone && Phone2) {
            //Alert.alert("Espere funcionalidad");
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
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Nombre: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setName(text);
                        }}
                        value={Name}
                        placeholder="Nombre"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Direccion: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setAddres(text);
                        }}
                        value={Addres}
                        placeholder="Direccion"
                    />                
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Colonia: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setColony(text);
                        }}
                        value={Colony}
                        placeholder="Colonia"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Ciudad: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setCity(text);
                        }}
                        value={City}
                        placeholder="Ciudad"
                    />                
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Codigo Postal: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            if (/^\d+$/.test(text) || text === '') setPostCode(text);
                        }}
                        keyboardType='numeric'
                        value={PostCode}
                        placeholder="Codigo Postal"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Corre electronico: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            setEmail(text);
                        }}
                        value={Email}
                        placeholder="Correo"
                    />                
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Telefono: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            if (/^\d+$/.test(text) || text === '') setPhone(text);
                        }}
                        value={Phone}
                        placeholder="Telefono"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Otro Telefono: </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => {
                            if (/^\d+$/.test(text) || text === '') setPhone2(text);
                            }
                        }
                        keyboardType='numeric'
                        value={Phone2}
                        placeholder="Telefono"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={VerifyAllContents}>
                        <Image
                            source={require('../Resources/imagenes/agregar1.png')}
                            style={styles.Buttons}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToWorker}>
                        <Image
                            source={require('../Resources/imagenes/cancelar.png')}
                            style={styles.Buttons}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'flex-start', // Alinea los elementos a la izquierda
        justifyContent: 'center', // Alinea los elementos en la parte superior
        backgroundColor: '#095ea7',
      },
    input: {
        height: 60,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        margin: 5,
        width: '50%',
        fontSize: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Ocupa todo el ancho disponible
        paddingHorizontal: 20, // Espacio horizontal entre elementos
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

export default AddCPage;