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
import { getUserById, updatePassword } from "../../Modules/Operations DB Users"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { CustomButton, Form, FloatingInput } from "../../Components"
import { scale } from "react-native-size-matters"

const { width, height } = Dimensions.get("window")

export default function UpdatePassword() {
  const navigation = useNavigation()

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [originalPassword, setOriginal] = useState("")
  const [userID, setUserID] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const userData = await GetUserData()
      const user = await getUserById(userData.Code)
      if (user) {
        setOriginal(user.password)
        setUserID(user.code.toString())
      }
    }

    loadData()
  }, [])

  const handleUpdatePassword = () => {
    try {
      const userCode = parseInt(userID, 10)
      if (form.currentPassword !== originalPassword) {
        Alert.alert("Error", "La contraseña actual no es correcta")
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        Alert.alert("Error", "Las nuevas contraseñas no coinciden")
        return
      }
      // Aquí puedes agregar la lógica para actualizar la contraseña en el servidor

      updatePassword(userCode, form.newPassword)
      Alert.alert("Éxito", "informacion actualizada exitosamente.")
      navigation.goBack()
    } catch {
      Alert.alert("Error", "Hubo un problema al actualizar")
    }
  }

  return (
    <CustomViewReverse>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.headerAction}
        >
          <FeatherIcon color="#000" name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Actualizar Contraseña
        </Text>
      </View>

      <View style={styles.body}>
        <Form title={"Cambiar Contraseña"}>
          <FloatingInput
            label={"Contraseña actual"}
            value={form.currentPassword}
            onChangeText={(currentPassword) =>
              setForm({ ...form, currentPassword })
            }
            secureTextEntry={true}
          />

          <FloatingInput
            label={"Nueva contraseña"}
            value={form.newPassword}
            onChangeText={(newPassword) => setForm({ ...form, newPassword })}
            secureTextEntry={true}
          />

          <FloatingInput
            label={"Confirma tu nueva contraseña"}
            value={form.confirmPassword}
            onChangeText={(confirmPassword) =>
              setForm({ ...form, confirmPassword })
            }
            secureTextEntry={true}
            placeholder={"Repite tu nueva contraseña"}
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={"Cancelar"}
              onPress={() => navigation.goBack()}
              buttonStyles={{
                backgroundColor: "#DC3545",
                width: width * 0.32,
              }}
            />
            <CustomButton
              buttonStyles={{ backgroundColor: "#007BFF", width: width * 0.32 }}
              onPress={handleUpdatePassword}
              title="Actualizar"
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
  body: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 16,
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
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
