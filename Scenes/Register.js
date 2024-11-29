import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllDepartamentos } from "../Modules/Operations DB Generals";
import { addUser } from "../Modules/Operations DB Users";
import { Picker } from "@react-native-picker/picker";
import { CustomView } from "./components/CustomView";

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
  const [nss, setNss] = useState("");
  const [rfc, setRfc] = useState("");
  const [salary, setSalary] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getAllDepartamentos();
      if (data) {
        setDepartments(data);
      }
    };
    loadDepartments();
  }, []);

  const isFormValid = () => {
    if (!code) {
      Alert.alert("Error", "El código es obligatorio.");
      return false;
    }
    if (!username) {
      Alert.alert("Error", "El nombre es obligatorio.");
      return false;
    }
    if (!userType || userType != "null") {
      Alert.alert("Error", "El tipo de usuario es obligatorio.");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria.");
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setNss("");
    setRfc("");
    setSalary("");
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
    if (value !== "2") {
      resetFields();
    }
  };

  const Verify = async () => {
    if (isFormValid()) {
      const UserData = {
        code: parseInt(code), // Convertir a entero
        name: username,
        user_type: parseInt(userType, 10),
        address: address,
        zip_code: zipCode,
        email: email,
        nss: userType === "2" ? nss : "",
        rfc: userType === "2" ? rfc : "",
        salary: userType === "2" ? parseFloat(salary) : null, // Convertir a número con decimales
        number: phoneNum,
        department_id: departmentID ? parseInt(departmentID) : null, // Convertir a entero si existe
        password: password,
      };
      await addUser(UserData);
      Alert.alert("Éxito", "Usuario registrado exitosamente.");
      navigation.goBack();
    }
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
      <ScrollView style={{ height: Scale * 1.1 }}>
        <View style={styles.formCont}>
          <Text style={styles.textForm}>Código</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCode}
            value={code}
            placeholder="Code"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Username"
          />

          <Text style={styles.textForm}>Contraseña</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            keyboardType="visible-password"
          />

          <Text style={styles.textForm}>Rol:</Text>
          <Picker selectedValue={userType} onValueChange={handleUserTypeChange}>
            <Picker.Item label="Selecciona un rol" value="null" />
            <Picker.Item label="Profesor" value="3" />
            <Picker.Item label="Alumno" value="4" />
          </Picker>

          <Text style={styles.textForm}>Dirección (opcional)</Text>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
            placeholder="Ejemplo 1234"
          />

          <Text style={styles.textForm}>Código Postal (opcional)</Text>
          <TextInput
            style={styles.input}
            onChangeText={setZipCode}
            value={zipCode}
            placeholder="Ejemplo 1234"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Número de teléfono (opcional)</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPhoneNum}
            value={phoneNum}
            placeholder="xx-xxxx-xxxx"
            keyboardType="numeric"
          />

          <Text style={styles.textForm}>Correo Electrónico (opcional)</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholder="something@email.com"
          />

          {userType === "2" && (
            <>
              <Text style={styles.textForm}>Número de Seguro Social</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNss}
                value={nss}
                placeholder="12345678"
                keyboardType="numeric"
              />

              <Text style={styles.textForm}>RFC</Text>
              <TextInput
                style={styles.input}
                onChangeText={setRfc}
                value={rfc}
                placeholder="12345678"
              />

              <Text style={styles.textForm}>Salario</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSalary}
                value={salary}
                placeholder="12345.67"
                keyboardType="numeric"
              />
            </>
          )}

          <Text style={styles.textForm}>ID departamento (opcional)</Text>
          <Picker
            selectedValue={departmentID}
            onValueChange={(itemValue) => setDepartmentID(itemValue)}
          >
            <Picker.Item label="Selecciona un departamento" value="" />
            {departments.map((dept) => (
              <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
            ))}
          </Picker>
        </View>

        <View
          style={{
            width: Scale * 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.loginButton} onPress={Verify}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Registrar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: Scale * 0.1 }}></View>
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
  Logo: {
    width: Scale > 400 ? 400 : 250,
    height: Scale > 400 ? 400 : 250,
    marginTop: "10%",
  },
});

export default Register;
