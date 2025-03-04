import { React, useState, useEffect } from "react"
import {
  StyleSheet,
  Alert,
  Dimensions,
  Text,
  View,
  Image,
} from "react-native"
import { getAllDepartamentos } from "../Modules/Operations DB Generals"
import { addUser } from "../Modules/Operations DB Users"
import { Picker } from "@react-native-picker/picker"
import { CustomView } from "./components/CustomView"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { CustomButton, Form, FloatingInput } from "../components"

const { width, height } = Dimensions.get("window")

const Register = ({ navigation }) => {
  const [code, setCode] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [address, setAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [phoneNum, setPhoneNum] = useState("")
  const [nss, setNss] = useState("")
  const [rfc, setRfc] = useState("")
  const [salary, setSalary] = useState("")
  const [departmentID, setDepartmentID] = useState("")
  const [departments, setDepartments] = useState([])

  const translateY = useSharedValue(-1000)

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getAllDepartamentos()
      if (data) {
        setDepartments(data)
      }
    }
    loadDepartments()

    // Animación
    setTimeout(() => {
      handleTranslateY()
    }, 800)
  }, [])

  const isFormValid = () => {
    if (!code) {
      Alert.alert("Error", "El código es obligatorio.")
      return false
    }
    if (!username) {
      Alert.alert("Error", "El nombre es obligatorio.")
      return false
    }
    if (!userType || userType === "null" || userType === "") {
      Alert.alert("Error", "El rol es obligatorio.")
      return false
    }    
    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria.")
      return false
    }
    return true
  }

  const resetFields = () => {
    setNss("")
    setRfc("")
    setSalary("")
  }

  const handleUserTypeChange = (value) => {
    setUserType(value)
    if (value !== "2") {
      resetFields()
    }
  }

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
      }
      await addUser(UserData)
      Alert.alert("Éxito", "Usuario registrado exitosamente.")
      navigation.goBack()
    }
  }

  const handleTranslateY = () => {
    translateY.value = withSpring(0, {
      damping: 19,
      stiffness: 180,
      mass: 1,
    })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <View style={styles.container}>
      <CustomView>
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
              <FloatingInput
                label={"Contraseña"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                keyboardType={"visible-password"}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Rol:</Text>
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
              <FloatingInput
                label="Dirección"
                value={address}
                onChangeText={setAddress}
                placeholder={"calle xxxx"}
              />
              <FloatingInput
                label={"Código Postal"}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType={"numeric"}
                placeholder={"xxxxx"}
              />
              <FloatingInput
                label={"Número de teléfono"}
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

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  ID departamento (opcional)
                </Text>
                <View style={[styles.input, { height: "auto" }]}>
                  <Picker
                    selectedValue={departmentID}
                    onValueChange={(itemValue) => setDepartmentID(itemValue)}
                  >
                    <Picker.Item label="Selecciona un departamento" value="" />
                    {departments.map((dept) => (
                      <Picker.Item
                        key={dept.id}
                        label={dept.name}
                        value={dept.id}
                      />
                    ))}
                  </Picker>
                </View>
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
      </CustomView>
    </View>
  )
}

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
})

export default Register
