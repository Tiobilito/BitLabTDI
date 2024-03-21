import { React, useState } from 'react';
import { StyleSheet, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';

const LoggingPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grayscale, setGrayscale] = useState(true);

  const VerifyToggleGrayscale = () => {
    if (username && password) {
      setGrayscale(false);
    } else {
      setGrayscale(true);
    }
  }

  const Verify = () => {

    fetch('http://10.214.150.5:3000/empleados')
    .then(response => response.json())
    .then(data => {
      if (username && password) {
        if (username === password) {
          navigation.navigate("Worker");
        } else {
          console.log('Los campos no coinciden');
        }
      } 
      else {
        console.log('Por favor completa ambos campos');
      }
      console.log(data); // Mostrar los datos en la consola
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  return (
    <ImageBackground
      source={require('../Resources/imagenes/Fondo1.jpg')}
      style={styles.background}
    >
      <Image
        source={require('../Resources/IMG/BITLABTDI.png')}
        style={styles.Logo}
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setUsername(text);
          VerifyToggleGrayscale();
        }}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setPassword(text);
          VerifyToggleGrayscale();
        }}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />    
      <TouchableOpacity onPress = {Verify}>
        <Image
          source={require('../Resources/imagenes/acceso.png')}
          style={[ grayscale ? { tintColor: 'gray' } : null, styles.AccesButtom]}
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
  Logo: {
    width: 400, // Ancho de la imagen
    height: 400, // Alto de la imagen
  },
  AccesButtom: {
    width: 100, // Ancho de la imagen
    height: 100, // Alto de la imagen
  },
});

export default LoggingPage;