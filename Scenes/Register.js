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
  View,
  ScrollView,
} from "react-native";
import { GetUserData, StoreUserData } from "../Modules/DataInfo";
import { addUser, CheckUser } from "../Modules/OperacionesBD";
import { Picker } from "@react-native-picker/picker";

import { CustomView } from "./components/CustomView";
import { number } from "prop-types";

const Scale = Dimensions.get("window").width;

const Register = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); 
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [nss, setNss] = useState(""); //Numero de seguro social
  const [rfc, setRfc] = useState(""); //Registro Federal de Contribuyentes
  const [departmentID, setDepartmentID] = useState("");

  const Verify = async () => {
    const UserData = {
      code: code,
      name: username,
      user_type: userType,
      address: address,
      zip_code: zipCode,
      email: email,
      nss: nss,
      rfc: rfc,
      number: phoneNum,
    };
    await addUser(UserData);
  };

  return (
    <CustomView>
      <Image
        source={require("../Resources/imagenes/BITLABTDI.png")}
        style={styles.Logo}
      />
      <Text
        style={{ fontSize: Scale > 400 ? 50 : 20, marginBottom: Scale * 0.05 }}
      >
        Registra tu nueva cuenta
      </Text>
      <ScrollView
        style={{
          height: Scale * 1.1,
        }}
      >
        <View style={styles.formCont}>
          <Text style={styles.textForm}>Código</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setCode(text);
            }}
            value={code}
            placeholder="Code"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setUsername(text);
            }}
            value={username}
            placeholder="Username"
          />

          <Text style={styles.textForm}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
            placeholder="something@email.com"
          />

          <Text style={styles.textForm}>Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />

          <Text style={styles.textForm}>Rol:</Text>
          <Picker //Esto es para el rol del usuario
            selectedValue={"Fixer"}
            onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
          >
            <Picker.Item label="Fixer" value="Fixer" />
            <Picker.Item label="Client" value="Client" />
          </Picker>

          <Text style={styles.textForm}>Dirección</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setAddress(text);
            }}
            value={address}
            placeholder="Ejemplo 1234"
          />

          <Text style={styles.textForm}>Código Postal</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setZipCode(text);
            }}
            value={zipCode}
            placeholder="Ejemplo 1234"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setPhoneNum(text);
            }}
            value={phoneNum}
            placeholder="xx-xxxx-xxxx"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Número de Seguro Social</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setNss(text);
            }}
            value={nss}
            placeholder="12345678"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>RFC</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setRfc(text);
            }}
            value={rfc}
            placeholder="12345678"
          />

          <Text style={styles.textForm}>ID departamento</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setDepartmentID(text);
            }}
            value={departmentID}
            placeholder="12345"
          />
        </View>

        <View
          style={{
            width: Scale * 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => Verify(username, password)}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Registrar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: Scale * 0.1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: Scale * 0.04,
            }}
          >
            <View
              style={{
                height: Scale * 0.002,
                width: Scale * 0.3,
                backgroundColor: "#000000",
              }}
            />
            <Text> Ó </Text>
            <View
              style={{
                height: Scale * 0.002,
                width: Scale * 0.3,
                backgroundColor: "#000000",
              }}
            />
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ marginBottom: Scale * 0.04 }}>
            Si ya estás registrado
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#2272A7",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              height: Scale * 0.1,
              width: Scale * 0.4,
            }}
            onPress={() => navigation.navigate("Logging")}
          >
            <Text style={{ color: "#2272A7", fontWeight: "bold" }}>
              Iniciar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: Scale > 400 ? 60 : 40,
    width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    fontSize: Scale > 400 ? 30 : 15,
  },
  textForm: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  formCont: {
    width: Scale * 0.8,
    marginBottom: Scale * 0.08,
    //marginTop: Scale * 0.08,
  },
  Logo: {
    width: Scale > 400 ? 400 : 250, // Ancho de la imagen
    height: Scale > 400 ? 400 : 250, // Alto de la imagen
    marginTop: "10%",
  },
  loginButton: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.08,
  },
  mainTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 450,
    borderRightWidth: 280,
    borderBottomWidth: 280,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    transform: [{ rotate: "30deg" }],
    marginTop: "-70%",
    marginBottom: "30%",
    marginRight: "-30%",
  },
  backTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 350,
    borderRightWidth: 200,
    borderBottomWidth: 250,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    transform: [{ rotate: "95deg" }],
    marginTop: "-40%",
    marginBottom: "10%",
    marginLeft: "-70%",
  },
});

export default Register;
