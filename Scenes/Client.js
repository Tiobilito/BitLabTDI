import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ClientPage = ({navigation}) => {
    const route = useRoute();
    const { idCli, Refresh } = route.params;
    const [Name, setName] = useState('');
    const [Addres, setAddres] = useState('');
    const [Colony, setColony] = useState('');
    const [City, setCity] = useState('');
    const [PostCode, setPostCode] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [Phone2, setPhone2] = useState('');

    useEffect(() => {
        GetClientData();
    }, []);

    const GetClientData = () => {
        fetch('http://10.214.150.5:3000/clientes')
        .then(response => response.json())
        .then(data => {
        data.forEach(item => {
            if(item.idCliente === idCli) {
                setName(item.nombre);
                setAddres(item.direccion);
                setColony(item.colonia);
                setCity(item.ciudad);
                setPostCode(item.cp);
                setEmail(item.correo);
                setPhone(item.telefono);
                setPhone2(item.telefono2);
            }
        });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    }

    const navigateToEditClient = async () => {
        navigation.navigate("EditClient", { idClient: idCli});
        setRefresh(true);
    }

    return (
        <View
            style={styles.background}
        >
            <ScrollView style = {styles.scrollData}>
                <View>
                    <Text style = {styles.text} >Id Cliente: {idCli}</Text>
                    <Text style = {styles.text} >Nombre: {Name}</Text>
                    <Text style = {styles.text} >Direccion: {Addres}</Text>
                    <Text style = {styles.text} >Colonia: {Colony}</Text>
                    <Text style = {styles.text} >Ciudad: {City}</Text>
                    <Text style = {styles.text} >C.P: {PostCode}</Text>
                    <Text style = {styles.text} >Correo: {Email}</Text>
                    <Text style = {styles.text} >Telefono: {Phone}</Text>
                    <Text style = {styles.text} >Segunto Telefono: {Phone2}</Text>
                </View>
                <View style = {styles.buttoms}>
                    <TouchableOpacity onPress={navigateToEditClient}>
                        <Image
                            source = {require('../Resources/imagenes/editar.png')}
                            style = {styles.image}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source = {require('../Resources/imagenes/device.png')}
                            style = {styles.image}
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
        backgroundColor: '#095ea7',
    },
    scrollData: {
        margin: 18,
    },
    text: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
    },
    image: {
        width: 150,
        height: 150,
        margin: 20,
    },
    buttoms: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', 
        paddingHorizontal: 20,
    }
});

export default ClientPage;