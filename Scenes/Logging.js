import { React, useState, useEffect } from 'react';
import { StyleSheet, TextInput, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoggingPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  var UserData = {
    Username: "",
    Password: "",
  }

  useEffect(() => {
    GetUserData();
  }, []);

  const GetUserData = async() => {
    try {
      const UDjson = await AsyncStorage.getItem('@UserCr');
      if (UDjson !== null) {
        const parsedData = JSON.parse(UDjson);
        setUsername(parsedData.Username);
        setPassword(parsedData.Password);
        console.log('Los datos son: ', parsedData);
      } else {
        console.log('No data found');
      }
    } catch (error) {
      console.error('Error al leer datos:', error);
    }
  }

  const StoreUserData = async() => {
    UserData.Username = username;
    UserData.Password = password;
    try {
      const UDjson = JSON.stringify(UserData);
      console.log(UDjson);
      await AsyncStorage.setItem('@UserCr', UDjson);
    } catch(error) {
      console.error('Error al guardar datos:', error);
    } 
  }

  const Verify = (User, PassW) => {
    var Done = false
    fetch('http://10.214.150.5:3000/empleados')
    .then(response => response.json())
    .then(data => {
      if (User && PassW) {
        data.forEach(item => {
          if(item.username === User && item.contra === PassW) {
            Done = true;
            StoreUserData();
            navigation.navigate("Worker");
          }
        });
        if(Done === false) {
          Alert.alert("Datos de inicio de sesion incorrectos");
        }
      } 
      else {
        Alert.alert("Por favor completa ambos campos");
      }
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
        }}
        value={username}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          setPassword(text);
        }}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />    
      <TouchableOpacity onPress = {() => Verify(username, password)}>
        <Image
          source={require('../Resources/imagenes/acceso.png')}
          style={styles.AccesButtom}
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