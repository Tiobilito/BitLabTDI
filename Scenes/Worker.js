import React from 'react';
import { StyleSheet, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';

const WorkerPage = ({navigation}) => {
  const navigateToAddClient = () => {
    navigation.navigate("AddClient");
  };

  const navigateToSearchClient = () => {
    navigation.navigate("SearchClient");
  };

  return (
    <ImageBackground
      source={require('../Resources/imagenes/Fondo1.jpg')}
      style={styles.background}    
    >
      <TouchableOpacity onPress={navigateToAddClient}>
        <Image
          source={require('../Resources/imagenes/editar.png')}
          style={styles.Buttons}
        />
      </TouchableOpacity>
      <Text style={styles.text}>Añadir Cliente</Text>
      <TouchableOpacity onPress={navigateToSearchClient}>
        <Image
          source={require('../Resources/imagenes/buscar.png')}
          style={styles.Buttons}
        />        
      </TouchableOpacity>
      <Text style={styles.text}>Buscar Cliente</Text>
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
  Buttons: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default WorkerPage;