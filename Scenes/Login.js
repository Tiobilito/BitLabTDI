import { React, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
  FlatList,
} from "react-native";
import { GetUserData, StoreUserData } from "../Modules/DataInfo";
import { CheckUser } from "../Modules/Operations DB Users";

import { CustomView } from "./components/CustomView";

const Scale = Dimensions.get("window").width;

const LoginPage = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const Verify = async () => {
    const Verify = await CheckUser(code, password);
    if (Verify) {
      await StoreUserData(Verify.code, Verify.password, Verify.user_type); // Esperar a que termine de guardar los datos
      switch (Verify.user_type) {
        case 0:
          navigation.navigate("StaffApp");
          break;
        case 1:
          navigation.navigate("StaffApp");
          break;
        case 2:
          navigation.navigate("SocialServiceApp");
          break;
        case 3:
          navigation.navigate("AcademicApp");
          break;
        case 4:
          navigation.navigate("AcademicApp");
          break;
      }
    }
  };

  const data = [
    {
      key: "logo",
      component: (
        <View style={styles.logoContainer}>
          <Image
            source={require("../Resources/imagenes/BITLABTDI.png")}
            style={styles.Logo}
          />
        </View>
      ),
    },
    {
      key: "title",
      component: (
        <Text style={[styles.textTitle, { fontSize: Scale > 400 ? 50 : 20 }]}>
          Ingresa a tu cuenta
        </Text>
      ),
    },
    {
      key: "form",
      component: (
        <View style={styles.formCont}>
          <Text style={styles.textForm}>Código de usuario</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setCode(text)}
            value={code.toString()}
            keyboardType="numeric"
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
      ),
    },
    {
      key: "loginButton",
      component: (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => Verify(code, password)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Iniciar</Text>
        </TouchableOpacity>
      ),
    },
    {
      key: "divider",
      component: (
        <View style={styles.dividerContainer}>
          <View style={styles.divider}></View>
          <Text> Ó </Text>
          <View style={styles.divider}></View>
        </View>
      ),
    },
    {
      key: "register",
      component: (
        <View style={styles.registerContainer}>
          <Text style={{ marginBottom: Scale * 0.04 }}>Si no estás registrado</Text>
          <TouchableOpacity
            style={styles.RegButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ color: "#2272A7", fontWeight: "bold" }}>Registrar</Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <CustomView>
      <FlatList
        data={data}
        renderItem={({ item }) => <View style={styles.centered}>{item.component}</View>}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.flatListContainer}
      />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5, // Evitar que el último elemento quede pegado al borde inferior
    paddingTop: 5, // Espacio adicional en la parte superior
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: Scale * 0.02, // Reducir la separación entre componentes
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Scale * 0.05, // Reducir espacio debajo del logo
  },
  Logo: {
    width: Scale * 0.6, // Ajustar el tamaño del logo
    height: Scale * 0.2, // Ajustar el tamaño del logo
    resizeMode: "contain", // Asegura que el logo no se distorsione
  },
  textTitle: {
    textAlign: "center",
    marginBottom: Scale * 0.03, // Reducir el espacio entre el título y el siguiente componente
    fontWeight: "bold",
  },
  input: {
    height: 50,
    width: "90%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    marginVertical: 10, // Usar marginVertical para controlar el espacio arriba y abajo del input
    fontSize: 16,
  },
  textForm: {
    fontSize: 16,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  formCont: {
    width: Scale * 0.8,
    marginBottom: Scale * 0.05, // Reducir el margen debajo del formulario
    marginTop: Scale * 0.05, // Reducir el margen superior
  },
  loginButton: {
    width: "160%",
    height: "50%",
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.05, // Reducir el espacio debajo del botón
  },
  RegButton: {
    borderWidth: 1,
    borderColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    width: "80%",
    alignSelf: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Scale * 0.03, // Reducir el espacio entre el divisor y otros componentes
  },
  divider: {
    height: Scale * 0.002,
    width: Scale * 0.3,
    backgroundColor: "#000000",
  },
  registerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: Scale * 0.03, // Reducir el espacio arriba del contenedor de registro
  },
});

export default LoginPage;
