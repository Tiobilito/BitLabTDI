import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  ScrollView,
} from "react-native";
import { GetUserData, StoreUserData } from "../Modules/DataInfo";
import { CheckUser } from "../Modules/OperacionesBD";

import { CustomView } from "./components/CustomView";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const LoggingPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const data = GetUserData();
    if (data) {
      setUsername(data.Username);
      setPassword(data.Password);
    }
  }, []);

  const Verify = async () => {
    const BVerify = await CheckUser(username, password);
    if (BVerify == true) {
      await StoreUserData(username, password);
      navigation.navigate("WorkerApp");
    }
  };

  return (
    <CustomView style={styles.container}>
      <Image
        source={require("../Resources/imagenes/BITLABTDI.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Ingresa a tu cuenta</Text>
      <View style={styles.formCont}>
        <Text style={styles.textForm}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
        />
        <Text style={styles.textForm}>Contraseña</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={Verify}>
        <Text style={styles.loginButtonText}>Iniciar</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.orText}>Ó</Text>
        <View style={styles.line} />
      </View>

      <View>
        <Text style={styles.registerPrompt}>Si no estás registrado</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: WIDTH * 0.6,
    height: HEIGHT * 0.2,
    resizeMode: "contain",
    marginBottom: HEIGHT * 0.05,
  },
  title: {
    fontSize: "100%", // Escalado de la fuente
    fontWeight: "bold",
    marginBottom: HEIGHT * 0.05,
  },
  formCont: {
    width: "80%",
    marginBottom: HEIGHT * 0.05,
  },
  textForm: {
    fontSize: "100%", // Escalado de la fuente para etiquetas
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: HEIGHT * 0.06,
    backgroundColor: "#C5E0F2",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: "80%", // Escalado de la fuente dentro de inputs
    marginBottom: 15,
  },
  loginButton: {
    width: "10%",
    height: HEIGHT * 0.08,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: HEIGHT * 0.05,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: "100%", // Escalado de la fuente del botón
    fontWeight: "bold",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: HEIGHT * 0.05,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: "#000",
  },
  orText: {
    fontSize: "100%", // Escalado del texto "Ó"
    marginHorizontal: 10,
  },
  registerPrompt: {
    fontSize: "100%", // Escalado de la sugerencia de registro
    marginBottom: HEIGHT * 0.02,
    textAlign: "center",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: "#2272A7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: HEIGHT * 0.08,
    width: "100%",
  },
  registerButtonText: {
    color: "#2272A7",
    fontWeight: "bold",
    fontSize: "100%", // Escalado del texto del botón "Registrar"
  },
});

export default LoggingPage;
