import { React, useState } from 'react';
import { StyleSheet, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';

const SearchPage = ({navigation}) => {
    
    
    return (
        <ImageBackground
            source={require('../Resources/imagenes/Fondo1.jpg')}
            style={styles.background}
        >

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
});

export default SearchPage;