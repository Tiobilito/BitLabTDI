import React, { useState } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { addDispo } from "../../Modules/Operations DB Fixes"
import { CustomViewReverse } from "../components/CustomViewReverse"
import {
  FloatingInput,
  CustomButton,
  Form,
  FloatingCalendar,
} from "../../components"
import { mainStyles } from "../../components/styles"

const { width, height } = Dimensions.get("window")

const AddDevicePage = ({ navigation }) => {
  const route = useRoute()
  const { idCli } = route.params

  const [formData, setFormData] = useState({
    sn: "",
    device_type: "",
    model: "",
    brand: "",
    received_status: "",
    color: "",
    rework_description: "",
    inventory_items: "",
    received_date: new Date(),
  })

  const [showDt, setShowDt] = useState(false)

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const verifyAndSendData = async () => {
    const { device_type, received_status, color, brand } = formData
    if (
      device_type.trim() !== "" &&
      received_status.trim() !== "" &&
      color.trim() !== "" &&
      brand.trim() !== ""
    ) {
      await sendData()
    } else {
      Alert.alert("Por favor rellene los campos obligatorios")
    }
  }

  const sendData = async () => {
    const newDeviceData = {
      sn: formData.sn,
      device_type: formData.device_type,
      customer_id: parseInt(idCli, 10),
      model: formData.model,
      brand: formData.brand,
      received_status: formData.received_status,
      color: formData.color,
      rework_description: formData.rework_description,
      received_date: formData.received_date.toISOString(),
      inventory_items: parseInt(formData.inventory_items, 10),
    }
    await addDispo(newDeviceData)
    navigation.navigate("Devices", { idClient: idCli })
  }

  const showDatePicker = () => {
    setShowDt(true)
  }

  const onDateChange = (e, selectedDate) => {
    setFormData((prev) => ({ ...prev, received_date: selectedDate }))
    setShowDt(false)
  }

  return (
    <CustomViewReverse>
      <View style={styles.body}>
        <Form title={"Añadir Dispositivo"}>
          <FloatingInput
            label="Numero de serie"
            value={formData.sn}
            onChangeText={(sn) => handleChange("sn", sn)}
            keyboardType="numeric"
            placeholder={"S/N"}
          />
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Numero de serie:</Text>
            <TextInput
              style={styles.input}
              value={formData.sn}
              onChangeText={(value) => handleChange("sn", value)}
              placeholder="S/N"
              keyboardType="numeric"
            />
          </View> */}

          <FloatingInput
            label="Tipo de dispositivo"
            value={formData.device_type}
            onChangeText={(device_type) =>
              handleChange("device_type", device_type)
            }
          />
          <FloatingInput
            label="Modelo"
            value={formData.model}
            onChangeText={(model) => handleChange("model", model)}
            determinante="el"
          />
          <FloatingInput
            label="Marca"
            value={formData.brand}
            onChangeText={(brand) => handleChange("brand", brand)}
            determinante="la"
          />
          <FloatingInput
            label="Descripción de la reparacion"
            value={formData.rework_description}
            onChangeText={(value) => handleChange("rework_description", value)}
            placeholder={"...."}
          />
          <FloatingInput
            label="Estado recibido"
            value={formData.received_status}
            onChangeText={(received_status) =>
              handleChange("received_status", received_status)
            }
            determinante="el"
          />
          <FloatingInput
            label="Inventario"
            value={formData.inventory_items}
            onChangeText={(value) =>
              /^\d+$/.test(value) || value === ""
                ? handleChange("inventory_items", value)
                : null
            }
            keyboardType="numeric"
            placeholder={"cant."}
          />
          <FloatingCalendar
            onPress={showDatePicker}
            showDt={showDt}
            value={formData.received_date}
            onChange={onDateChange}
          />
          {/* <View style={styles.inputContainer}>
            <Text style={mainStyles.title}>Fecha</Text>
            <TouchableOpacity onPress={showDatePicker}>
              {showDt && (
                <DateTimePicker
                  value={formData.received_date}
                  mode="date"
                  onChange={onDateChange}
                />
              )}
              <Text style={[mainStyles.input]}>
                {formData.received_date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View> */}
          <FloatingInput
            label="Color"
            value={formData.color}
            onChangeText={(color) => handleChange("color", color)}
            determinante="el"
          />
          <View style={styles.approval}>
            <CustomButton
              title={"Cancelar"}
              onPress={() => navigation.goBack()}
              buttonStyles={{
                backgroundColor: "#DC3545",
                width: width * 0.32,
              }}
            />
            <CustomButton
              title={" Añadir "}
              onPress={async () => verifyAndSendData()}
              buttonStyles={{
                width: width * 0.32,
                backgroundColor: "#007BFF",
              }}
            />
          </View>
        </Form>
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    marginTop: height * 0.06,
    // paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  approval: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
})

export default AddDevicePage
