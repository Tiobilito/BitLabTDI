import React, { useState } from 'react';
import { StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';

const AddCPage = ({navigation}) => {
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

export default AddCPage;