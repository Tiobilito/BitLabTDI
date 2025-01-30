import { React, useState, useEffect } from "react"
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
} from "react-native"
import { getAllDepartamentos } from "../Modules/Operations DB Generals"
import { getUserById, updateUser } from "../Modules/Operations DB Users"
import { Picker } from "@react-native-picker/picker"
import { CustomView } from "./components/CustomView"
import { GetUserData } from "../Modules/DataInfo"

const { width } = Dimensions.get("window")

const SettingsPage = ({ navigation }) => {
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
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getAllDepartamentos()
      if (data) {
        setDepartments(data)
      }
    }

    const loadUserData = async () => {
      const dataI = await GetUserData()
      const data = await getUserById(dataI.Code)
      await setUserData(data)
      if (data) {
        await setUserData(data)
        await setCode(data.code)
        await setUsername(data.name)
        await setEmail(data.email)
        await setPassword(data.password)
        await setUserType(data.user_type)
        await setAddress(data.address)
        await setZipCode(data.zip_code)
        await setPhoneNum(data.number)
        await setNss(data.nss)
        await setRfc(data.rfc)
        await setSalary(data.salary)
        await setDepartmentID(data.department_id)
      }
    }

    loadUserData()
    loadDepartments()
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
    if (!userType || userType != "null") {
      Alert.alert("Error", "El tipo de usuario es obligatorio.")
      return false
    }
    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria.")
      return false
    }
    return true
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
      await updateUser(UserData)
      Alert.alert("Éxito", "Usuario modificado exitosamente.")
    }
  }

  return (
    <CustomView>
      <Text style={styles.title}>Datos</Text>
      <ScrollView style={{ height: width * 1.1 }}>
        <View style={styles.formCont}>
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
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un departamento" value="" />
            {departments.map((dept) => (
              <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
            ))}
          </Picker>
        </View>

        <View
          style={{
            width: width * 0.8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.loginButton} onPress={Verify}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Actualizar Datos
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: width * 0.1 }}></View>
      </ScrollView>
    </CustomView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: width > 400 ? 50 : 20,
    marginBottom: width * 0.05,
    marginTop: width * 0.5,
    fontWeight: "bold",
    color: "#2272A7",
  },
  input: {
    // height: width > 400 ? 60 : 40,
    // width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 25 : 15,
    padding: 10,
    margin: 10,
    // fontSize: width > 400 ? 30 : 15,
    fontSize: width * 0.05,
  },
  textForm: {
    fontSize: width > 400 ? 40 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  formCont: {
    width: width * 0.8,
    marginBottom: width * 0.08,
  },
  loginButton: {
    width: width * 0.5,
    height: width * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: width * 0.08,
  },
  Logo: {
    width: width > 400 ? 400 : 250,
    height: width > 400 ? 400 : 250,
    marginTop: "10%",
  },
  picker: {
    height: width * 0.12,
    backgroundColor: "#C5E0F2",
    borderRadius: width * 0.05,
    margin: 10,
  },
})

export default SettingsPage
