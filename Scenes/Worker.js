import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';

export default function App() {

  return (
    <ImageBackground
      source={require('../Resources/imagenes/Fondo1.jpg')}
      style={styles.background}    
    >
      <Text>Menu Trabajadores</Text>
      <TouchableOpacity>
        <Image
          source = {require('../Resources/imagenes/editar.png')}
          style = {styles.Buttoms}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
            source = {require('../Resources/imagenes/buscar.png')}
            style = {styles.Buttoms}
          />        
      </TouchableOpacity>
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
  Buttoms: {
    width: 200,
    height: 200,
  },
});