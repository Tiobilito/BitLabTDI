import React, { useState } from 'react';
import { StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';

const WorkerPage = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../Resources/imagenes/Fondo1.jpg')}
      style={styles.background}    
    >
      <TouchableOpacity>
        <Image
          source = {require('../Resources/imagenes/editar.png')}
          style = {styles.Buttoms}
        />
      </TouchableOpacity>
      <Text style = {styles.text}>Añadir Cliente</Text>
      <TouchableOpacity>
        <Image
            source = {require('../Resources/imagenes/buscar.png')}
            style = {styles.Buttoms}
          />        
      </TouchableOpacity>
      <Text style = {styles.text}>Buscar Cliente</Text>
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
  text: {
    fontSize: 50,
    color: 'white',
  }
});

export default WorkerPage;