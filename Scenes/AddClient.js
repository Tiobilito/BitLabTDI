import React, { useState } from 'react';
import { StyleSheet, Text, ImageBackground, Image, TouchableOpacity, TextInput, View } from 'react-native';

const AddCPage = ({navigation}) => {
    const [Name, setName] = useState('');
    const [Addres, setAddres] = useState('');
    const [Colony, setColony] = useState('');
    const [City, setCity] = useState('');
    const [PostCode, setPostCode] = useState('');
    const [RFC, setRFC] = useState('');
    const [Email, setEmail] = useState('');
    const [NSS, setNSS] = useState('');
    const [Salary, setSalary] = useState('');
    
    return (
        <ImageBackground
            source={require('../Resources/imagenes/Fondo1.jpg')}
            style={styles.background}         
        >
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Nombre: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    value={Name}
                    placeholder="Nombre"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Direccion: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setAddres(text)}
                    value={Addres}
                    placeholder="Direccion"
                />                
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Colonia: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setColony(text)}
                    value={Colony}
                    placeholder="Colonia"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Ciudad: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setCity(text)}
                    value={City}
                    placeholder="Ciudad"
                />                
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Codigo Postal: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPostCode(text)}
                    value={PostCode}
                    placeholder="Codigo Postal"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>RFC: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setRFC(text)}
                    value={RFC}
                    placeholder="RFC"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Corre electronico: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={Email}
                    placeholder="Correo"
                />                
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>NSS: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setNSS(text)}
                    value={NSS}
                    placeholder="NSS"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Salario: </Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setSalary(text)}
                    value={Salary}
                    placeholder="Salario"
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'flex-start', // Alinea los elementos a la izquierda
        justifyContent: 'center', // Alinea los elementos en la parte superior
      },
      input: {
        height: 60,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
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
  });

export default AddCPage;