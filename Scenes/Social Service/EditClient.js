import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { getUserById, updateUser } from "../../Modules/Operations DB Users"
import { CustomView } from "../components/CustomView"
import { Form, FloatingInput, CustomButton } from "../../components"

const { width, height } = Dimensions.get("window")

const EditClientPage = ({ navigation }) => {
  const route = useRoute()
  const { idClient } = route.params

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zipCode: "",
    email: "",
    phone: "",
    phone2: "",
  })

  useEffect(() => {
    getClientData()
  }, [])

  const getClientData = async () => {
    const item = await getUserById(idClient)
    if (item) {
      setFormData({
        name: item.name,
        address: item.address,
        zipCode: item.zip_code,
        email: item.email,
        phone: item.number,
        phone2: item.second_number,
      })
    }
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const verifyAndSendData = () => {
    const { name } = formData

    if (name.trim() !== "") {
      sendData()
    } else {
      Alert.alert("Por favor rellene el nombre correctamente")
    }
  }

  const sendData = async () => {
    const updatedData = {
      name: formData.name,
      address: formData.address,
      zip_code: formData.zipCode,
      email: formData.email,
      number: formData.phone,
      second_number: formData.phone2,
    }

    await updateUser(idClient, updatedData)
    navigation.goBack()
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomView>
        <View style={styles.body}>
          <Form title={"Editar Usuario"}>
            <FloatingInput
              label={"Nombre"}
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
            />
            <FloatingInput
              label={"Dirección"}
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
            />
            <FloatingInput
              label={"Código Postal"}
              value={formData.zipCode}
              onChangeText={(value) => handleChange("zipCode", value)}
              keyboardType="numeric"
              placeholder={"xxxxx"}
            />
            <FloatingInput
              label={"Correo electrónico"}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
              placeholder={"xxx@dominio"}
            />
            <FloatingInput
              label={"Teléfono"}
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              keyboardType="phone-pad"
              placeholder={"xx-xxxx-xxxx"}
            />
            <FloatingInput
              label={"Segundo Teléfono"}
              value={formData.phone2}
              onChangeText={(value) => handleChange("phone2", value)}
              keyboardType="phone-pad"
              placeholder={"xx-xxxx-xxxx"}
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
                title={"Actualizar"}
                onPress={verifyAndSendData}
                buttonStyles={{
                  width: width * 0.32,
                  backgroundColor: "#007BFF",
                }}
              />
            </View>
          </Form>
        </View>
      </CustomView>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    marginTop: height * 0.27,
    height: "75%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
})

export default EditClientPage
