import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetUserData, StoreUserData } from "../Modules/DataInfo";
import { CheckUser } from "../Modules/OperacionesBD";

const Scale = Dimensions.get("window").width;

const LoggingPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const data = GetUserData();
    if(data) {
      setUsername(data.Username);
      setPassword(data.Password);
    }
  }, []);

  const Verify = async () => {
    const BVerify = await CheckUser(username, password);
    if(BVerify == true) {
      await StoreUserData(username, password);
      navigation.navigate("Worker");
    }
  };

  return (
    <ImageBackground
      source={require("../Resources/imagenes/Fondo1.jpg")}
      style={styles.background}
    >
      <Image
        source={require("../Resources/imagenes/BITLABTDI.png")}
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
      <Text style={styles.text}>
        {"No tienes cuenta "}
        <Text
          style={{ color: "blue", textDecorationLine: "underline" }}
          onPress={() => console.log("Espere Funcionalidad")}
        >
          Registrate
        </Text>
      </Text>
      <TouchableOpacity onPress={() => Verify(username, password)}>
        <Image
          source={require("../Resources/imagenes/acceso.png")}
          style={styles.AccesButtom}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: Scale > 400 ? 60 : 40,
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    width: "80%",
    fontSize: Scale > 400 ? 30 : 15,
  },
  text: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
  },
  Logo: {
    width: Scale > 400 ? 400 : 250, // Ancho de la imagen
    height: Scale > 400 ? 400 : 250, // Alto de la imagen
  },
  AccesButtom: {
    width: 100, // Ancho de la imagen
    height: 100, // Alto de la imagen
  },
});

export default LoggingPage;
