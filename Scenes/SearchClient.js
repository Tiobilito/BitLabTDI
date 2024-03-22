import { React, useState } from 'react';
import { Text, StyleSheet, TextInput, ImageBackground, View, TouchableOpacity } from 'react-native';

const Table = ({name}) => {
    return (
        <View>
            <View style={styles.TableLine}>
                <Text style={styles.text}>{name}</Text>
                <TouchableOpacity style = {styles.buttom}>
                    <Text style={styles.textButton}>Detalles</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const SearchPage = ({navigation}) => {
    const [ShowTable, SetShow] = useState(false);
    const [Name, setName] = useState('');
    const numberOfTables = 5;

    return (
        <ImageBackground
            source={require('../Resources/imagenes/Fondo1.jpg')}
            style={styles.background}
        >
            <Text style={styles.text}>Nombre del cliente a buscar?</Text>
            <View style={styles.TableLine}>
                <TextInput
                    style = {styles.input}
                    onChangeText={(text) => {
                        setName(text);
                    }}
                    value={Name}
                    placeholder="Nombre"
                />
                <TouchableOpacity style = {styles.buttom}>
                    <Text style={styles.textButton}>Buscar</Text>
                </TouchableOpacity>
            </View>
            {
                Array.from({ length: numberOfTables }).map((_, index) => (
                    ShowTable ? <Table key={index} name={`hola${index + 1}`} /> : null
                ))
            }
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'white'
    },
    TableLine: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Ocupa todo el ancho disponible
        paddingHorizontal: 20, // Espacio horizontal entre elementos
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
    buttom: {
        backgroundColor: 'blue',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    textButton: {
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 10,
        color: 'white'
    },
});

export default SearchPage;