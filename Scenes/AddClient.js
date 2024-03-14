import React, { useState } from 'react';
import { StyleSheet, Text, ImageBackground, Image, TouchableOpacity, TextInput } from 'react-native';

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
    
    const handleNameChange = (text) => {
        setName(text);
    };

    const handleAddresChange = (text) => {
        setAddres(text);
    };

    const handleColonyChange = (text) => {
        setColony(text);
    };

    const handleCityChange = (text) => {
        setCity(text);
    };

    const handlePostCodeChange = (text) => {
        setPostCode(text);
    };

    const handleRFCChange = (text) => {
        setRFC(text);
    };

    const handleEmailChange = (text) => {
        setEmail(text);
    };

    const handleNSSChange = (text) => {
        setNSS(text);
    };

    const handleSalaryChange = (text) => {
        setSalary(text);
    };

    return (
        <ImageBackground
            source={require('../Resources/imagenes/Fondo1.jpg')}
            style={styles.background}         
        >
            <Text>ID</Text>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
        fontSize: 50,
        color: 'white',
    },
    input: {
        height: 60,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: '80%',
        fontSize: 30,
    },
  });

export default AddCPage;