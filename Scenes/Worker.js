import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';

const WorkerPage = ({navigation}) => {
  const navigateToAddClient = () => {
    navigation.navigate("AddClient");
  };

  const navigateToSearchClient = () => {
    navigation.navigate("SearchClient");
  };

  return (
    <View
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
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1875c7',
  },
  Buttons: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default WorkerPage;