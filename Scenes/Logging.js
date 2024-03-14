import React, { useState } from 'react';
import { StyleSheet, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';

const LoggingPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const Verify = () => {
    if (username && password) {
      if (username === password) {
        console.log('Los campos coinciden');
      } else {
        console.log('Los campos no coinciden');
      }
    } else {
      console.log('Por favor completa ambos campos');
    }
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
        onChangeText={handleUsernameChange}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={handlePasswordChange}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />    
      <TouchableOpacity onPress={Verify}>
        <Image
          source={require('../Resources/imagenes/acceso.png')}
          style={styles.AccesButtom}
        />
      </TouchableOpacity>  
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004ADE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    width: '80%',
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