import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native"
import FeatherIcon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import { GetUserData } from "../../Modules/DataInfo"
import { getAllDepartamentos } from "../../Modules/Operations DB Generals"
import { getUserById, updateUser } from "../../Modules/Operations DB Users"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { CustomButton, Form, FloatingInput } from "../../Components"
import { scale } from "react-native-size-matters"

const { height, width } = Dimensions.get("window")

export default function UpdateAccount() {
  const navigation = useNavigation()

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    codeU: "",
    nss: "",
    rfc: "",
    salary: "",
    departmentID: "",
  })
  const [originalCodeU, setOriginalCodeU] = useState("")
  const [departments, setDepartments] = useState([])
  const [userType, setUserType] = useState(null)

  // Cargar los datos de usuario y departamentos
  useEffect(() => {
    const loadData = async () => {
      const userData = await GetUserData()
      const user = await getUserById(userData.Code)
      const departmentData = await getAllDepartamentos()
      if (user) {
        setUserType(user.user_type)
        setOriginalCodeU(user.code.toString())
        console.log("Codigo de usuario: ", originalCodeU)
        setForm({
          name: user.name,
          email: user.email,
          phone: user.number,
          address: user.address,
          codeU: user.code.toString(),
          nss: user.nss,
          rfc: user.rfc,
          salary: user.salary,
          departmentID: user.department_id,
        })
      }

      if (departmentData) {
        setDepartments(departmentData)
      }
    }

    loadData()
  }, [])

  const handleUpdate = () => {
    try {
      const userCode = parseInt(originalCodeU, 10)

      // Lista de campos requeridos
      const requiredFields = [
        { key: "name", label: "Nombre" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Teléfono" },
        { key: "codeU", label: "Código" },
      ]

      // Si el usuario es de tipo 2, agregar más campos requeridos
      if (userType === 2) {
        requiredFields.push(
          { key: "nss", label: "NSS" },
          { key: "rfc", label: "RFC" },
          { key: "salary", label: "Salario" }
        )
      }

      // Validar que todos los campos requeridos tengan un valor
      for (const field of requiredFields) {
        if (!form[field.key]?.trim()) {
          Alert.alert("Error", `El campo ${field.label} no puede estar vacío.`)
          return
        }
      }

      // Crear el objeto actualizado
      const updatedAccount = {
        name: form.name,
        address: form.address,
        zip_code: form.zip_code,
        email: form.email,
        number: form.phone,
        user_type: userType,
      }

      updateUser(userCode, updatedAccount)
      Alert.alert("Éxito", "informacion actualizada exitosamente.")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar la información.")
    }
  }

  return (
    <CustomViewReverse>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerAction}
        >
          <FeatherIcon color="#000" name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Actualizar datos de cuenta
        </Text>
      </View>

      <View style={styles.body}>
        <Form title={"Información Personal"}>
          {[
            {
              label: "Nombre",
              value: form.name,
              onChange: (name) => setForm({ ...form, name }),
            },
            {
              label: "Email",
              value: form.email,
              onChange: (email) => setForm({ ...form, email }),
              keyboardType: "email-address",
            },
            {
              label: "Teléfono",
              value: form.phone,
              onChange: (phone) => {
                // Limitar la entrada a 10 dígitos
                if (phone.length <= 10) {
                  setForm({ ...form, phone })
                }
              },
              keyboardType: "phone-pad",
              maxLength: 10,
            },
            {
              label: "Código",
              value: form.codeU,
              onChange: (codeU) => setForm({ ...form, codeU }),
              keyboardType: "numeric",
            },
            {
              label: "Dirección (Opcional)",
              value: form.address,
              onChange: (address) => setForm({ ...form, address }),
            },
          ].map(({ label, value, onChange, keyboardType }) => (
            <FloatingInput
              key={label}
              label={label}
              value={value}
              onChangeText={onChange}
              keyboardType={keyboardType}
            />
          ))}

          {/* Condicional para NSS, RFC, y Salario */}
          {userType === 2 && (
            <>
              {[
                {
                  label: "NSS",
                  value: form.nss,
                  onChange: (nss) => setForm({ ...form, nss }),
                },
                {
                  label: "RFC",
                  value: form.rfc,
                  onChange: (rfc) => setForm({ ...form, rfc }),
                },
                {
                  label: "Salario",
                  value: form.salary,
                  onChange: (salary) => setForm({ ...form, salary }),
                  keyboardType: "numeric",
                },
              ].map(({ label, value, onChange, keyboardType }) => (
                <FloatingInput
                  key={label}
                  label={label}
                  value={value}
                  onChangeText={onChange}
                  keyboardType={keyboardType}
                />
              ))}
            </>
          )}

          {/* Mostrar nombre del departamento */}
          <FloatingInput
            label={"Departamento"}
            value={
              departments.find((dep) => dep.id === form.departmentID)?.name
            }
            editable={false}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={"Cancelar"}
              onPress={() => navigation.goBack()}
              buttonStyles={{ backgroundColor: "#DC3545", width: width * 0.32 }}
            />
            <CustomButton
              title={"Actualizar"}
              onPress={handleUpdate}
              buttonStyles={{ backgroundColor: "#007BFF", width: width * 0.32 }}
            />
          </View>
        </Form>
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 35,
  },
  headerAction: {
    position: "absolute",
    width: 32,
    height: 32,
    justifyContent: "center",
    marginLeft: scale(20),
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    flexGrow: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#C5E0F2",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    // marginTop: 16,
  },
})
