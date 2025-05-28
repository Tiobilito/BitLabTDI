import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { addUser } from "../Modules/Operations DB Users";
import { Picker } from "@react-native-picker/picker";
import { CustomView } from "./components/CustomView";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { CustomButton, Form, FloatingInput } from "../components";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message'
import { mainStyles, toastConfig } from "../components/styles";

const { width, height } = Dimensions.get("window");

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const translateY = useSharedValue(-1000);

  useEffect(() => {
    // Animación
    setTimeout(() => {
      handleTranslateY();
    }, 800);
  }, []);

  const isFormValid = () => {
    if (!code) {
      Toast.show({
        type: "error",
        text1: "El código es obligatorio",
        position: "bottom",
      });
      // Alert.alert("Error", "El código es obligatorio.");
      return false;
    }
    if (!username) {
      Toast.show({
        type: "error",
        text1: "El nombre es obligatorio",
        position: "bottom",
      });
      // Alert.alert("Error", "El nombre es obligatorio.");
      return false;
    }
    if (!userType || userType === "null" || userType === "") {
      Toast.show({
        type: "error",
        text1: "El rol es obligatorio",
        position: "bottom",
      });
      // Alert.alert("Error", "El rol es obligatorio.");
      return false;
    }
    if (!password) {
      Toast.show({
        type: "error",
        text1: "La contraseña es obligatoria",
        position: "bottom",
      });
      // Alert.alert("Error", "La contraseña es obligatoria.");
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
        department_id: null, // Enviar como nulo
        password: password,
      };
      setIsLoading(true); // Mostrar el modal de carga
      try {
        const response = await addUser(UserData);
        setIsLoading(false); // Ocultar el modal de carga
        console.log("Response -> ", response);
        if (response !== false)
          navigation.goBack();
      } catch (error) {
        setIsLoading(false); // Ocultar el modal de carga en caso de error
        Toast.show({
          type: "error",
          text1: "Ocurrió un error al registrar el usuario",
          position: "bottom",
        });
        // Alert.alert("Error", "Ocurrió un error al registrar el usuario.");
      }
    }
  };

  const handleTranslateY = () => {
    translateY.value = withSpring(0, {
      damping: 19,
      stiffness: 180,
      mass: 1,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <CustomView>
        {/* Modal de carga */}
        <Modal transparent={true} visible={isLoading}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        </Modal>
        <Animated.View style={animatedStyle}>
          <Image
            source={require("../Resources/imagenes/BITLABTDI.png")}
            style={styles.Logo}
          />
        </Animated.View>

        <View style={styles.body}>
          <Form title={"Registra tu nueva cuenta"} transition="spring">
            <>
              <FloatingInput
                label="Código"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
              <FloatingInput
                label="Nombre"
                value={username}
                onChangeText={setUsername}
              />
              <View style={styles.passwordWrapper}>
                <FloatingInput
                  label={"Contraseña"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={mainStyles.title}>Rol:</Text>
                <View style={[styles.input, { height: "auto" }]}>
                  <Picker
                    selectedValue={userType}
                    onValueChange={handleUserTypeChange}
                  >
                    <Picker.Item label="Selecciona un rol" value="" />
                    <Picker.Item label="Profesor" value="3" />
                    <Picker.Item label="Alumno" value="4" />
                  </Picker>
                </View>
              </View>
              <View style={styles.lineContainer}>
                <View style={styles.line} />
              </View>
              <View style={{ marginTop: 8 }}>
                <FloatingInput
                  label="Dirección (Opcional)"
                  value={address}
                  onChangeText={setAddress}
                  placeholder={"calle xxxx"}
                />
                <FloatingInput
                  label={"Código Postal (opcional)"}
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType={"numeric"}
                  placeholder={"xxxxx"}
                />
                <FloatingInput
                  label={"Número de teléfono (opcional)"}
                  value={phoneNum}
                  onChangeText={setPhoneNum}
                  keyboardType={"numeric"}
                  placeholder={"xx-xxxx-xxxx"}
                />
                <FloatingInput
                  label={"Correo Electrónico (opcional)"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType={"email-address"}
                  placeholder={"correo@dominio"}
                />

                {userType === "2" && (
                  <>
                    <FloatingInput
                      label={"Número de Seguro Social"}
                      value={nss}
                      onChangeText={setNss}
                      keyboardType={"numeric"}
                      placeholder={"xxxxxxxx"}
                    />
                    <FloatingInput
                      label={"RFC"}
                      value={rfc}
                      onChangeText={setRfc}
                      placeholder={"12345678"}
                    />
                    <FloatingInput
                      label={"Salario"}
                      value={salary}
                      onChangeText={setSalary}
                      keyboardType={"numeric"}
                      placeholder={"xxxxx.xx"}
                    />
                  </>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Cancelar"
                  onPress={() => navigation.goBack()}
                  buttonStyles={{
                    backgroundColor: "#DC3545",
                    width: width * 0.32,
                  }}
                />
                <CustomButton
                  title="Registrar"
                  onPress={Verify}
                  buttonStyles={{
                    backgroundColor: "#007BFF",
                    width: width * 0.32,
                  }}
                />
              </View>
            </>
          </Form>
        </View>
        <Toast config={toastConfig} />
      </CustomView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: -50,
    height: "70%",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  input: {
    fontSize: 18,
    color: "#555",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 20 : 15,
    textAlignVertical: "center",
  },
  Logo: {
    width: width * 0.7,
    height: width * 0.7,
    marginTop: "7%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "4%",
    top: "45%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  lineContainer: {
    marginBottom: width * 0.03,
    marginTop: width * 0.03,
  },
  line: {
    width: width * 0.7,
    height: width * 0.002,
    backgroundColor: "#000000",
  },
});

export default Register;
