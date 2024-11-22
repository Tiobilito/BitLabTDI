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
import { CheckUser } from "../Modules/Operations DB Users";

import { CustomView } from "./components/CustomView";

const Scale = Dimensions.get("window").width;

const LoginPage = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  /*
  useEffect(() => {
    const loadUserData = async () => {
      const data = await GetUserData();
      if (data) {
        setCode(data.Code);
        setPassword(data.Password);
      }
    };
    loadUserData();
  }, []);
  */

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

  return (
    <CustomView>
      <ScrollView>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require("../Resources/imagenes/BITLABTDI.png")}
            style={styles.Logo}
          />
          <Text style={{ fontSize: Scale > 400 ? 50 : 20 }}>
            Ingresa a tu cuenta
          </Text>
          <View style={styles.formCont}>
            <Text style={styles.textForm}>Código de usuario</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setCode(text);
              }}
              value={code.toString()}
              keyboardType="numeric"
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
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => Verify(code, password)}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Iniciar</Text>
          </TouchableOpacity>

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

          <View>
            <Text style={{ marginBottom: Scale * 0.04 }}>
              Si no estás registrado
            </Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#2272A7",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                height: Scale * 0.1,
              }}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={{ color: "#2272A7", fontWeight: "bold" }}>
                Registrar
              </Text>
            </TouchableOpacity>
          </View>
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
    marginTop: Scale * 0.08,
  },
  Logo: {
    width: Scale > 400 ? 400 : 250, // Ancho de la imagen
    height: Scale > 400 ? 400 : 250, // Alto de la imagen
    marginTop: "10%",
  },
  loginButton: {
    width: Scale * 0.25,
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

export default LoginPage;
