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
import DateTimePicker from "@react-native-community/datetimepicker"
import { getDispoById, updateDispo } from "../../Modules/Operations DB Fixes"
import { CustomView } from "../components/CustomView"
import {
  Form,
  FloatingInput,
  CustomButton,
  FloatingCalendar,
} from "../../Components"

const { width, height } = Dimensions.get("window")

const EditDevicePage = ({ navigation }) => {
  const route = useRoute()
  const { idDevice } = route.params
  const [formData, setFormData] = useState({
    sn: "",
    type: "",
    model: "",
    customer_id: 0,
    brand: "",
    receivedStatus: "",
    color: "",
    case: "",
    inventory: "",
    date: new Date(),
  })
  const [showDt, setShowDt] = useState(false)

  useEffect(() => {
    GetDeviceData()
  }, [])

  const GetDeviceData = async () => {
    const item = await getDispoById(idDevice)
    if (item) {
      setFormData({
        sn: item.serial_number,
        type: item.device_type,
        customer_id: item.customer_id,
        model: item.model,
        brand: item.brand,
        receivedStatus: item.received_status,
        color: item.color,
        case: item.rework_description,
        inventory: item.inventory_items ? item.inventory_items.toString() : "",
        date: new Date(item.received_date),
      })
    }
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const verifyAndSendData = () => {
    const {
      sn,
      type,
      model,
      brand,
      receivedStatus,
      color,
      inventory,
      case: caseDesc,
    } = formData

    if (
      sn.trim() !== "" &&
      type.trim() !== "" &&
      model.trim() !== "" &&
      brand.trim() !== "" &&
      receivedStatus.trim() !== "" &&
      color.trim() !== "" &&
      inventory.trim() !== ""
    ) {
      sendData()
    } else {
      Alert.alert("Por favor rellene todos los datos correctamente")
    }
  }

  const sendData = async () => {
    const updatedData = {
      sn: formData.sn,
      tipo_dis: formData.type,
      id_cliente: formData.customer_id,
      modelo: formData.model,
      marca: formData.brand,
      esta_recep: formData.receivedStatus,
      color: formData.color,
      caso: formData.case,
      fecha: formData.date.toISOString(),
      inventario: parseInt(formData.inventory, 10),
    }

    await updateDispo(idDevice, updatedData)
    navigation.goBack()
  }

  const ShowDt = () => {
    setShowDt(true)
  }

  const onChangeDate = (e, SelectedDate) => {
    setFormData((prev) => ({ ...prev, date: SelectedDate }))
    setShowDt(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomView>
        <View style={styles.body}>
          <Form title="Editar Dispositivo">
            <FloatingInput
              label="S/N"
              value={formData.sn}
              onChangue={(sn) => handleChange("sn", sn)}
              keyboardType="numeric"
              placeholder={"S/N"}
            />
            {/* <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.sn}
                onChangeText={(value) => handleChange("sn", value)}
                placeholder="S/N"
                keyboardType="numeric"
              />
            </View> */}
            <FloatingInput
              label="Tipo"
              value={formData.type}
              onChangeText={(type) => handleChange("type", type)}
              determinante="el"
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
              label="Estado recibido"
              value={formData.receivedStatus}
              onChangeText={(receivedStatus) =>
                handleChange("receivedStatus", receivedStatus)
              }
              placeholder={"Estado recibido"}
            />
            <FloatingInput
              label="Inventario"
              value={formData.inventory}
              onChangeText={(inventory) => handleChange("inventory", inventory)}
              keyboardType="numeric"
              placeholder={"Cant."}
            />
            <FloatingCalendar
              onPress={ShowDt}
              showDt={showDt}
              value={formData.date}
              onChange={onChangeDate}
            />
            <FloatingInput
              label="Color"
              value={formData.color}
              onChangeText={(color) => handleChange("color", color)}
              determinante="el"
            />
            <FloatingInput
              label="Descripción de la reparación"
              value={formData.case}
              onChangeText={(value) => handleChange("case", value)}
              placeholder={"...."}
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
    marginTop: height * 0.28,
    height: "75%",
  },
  container: {
    width: "95%",
    // height: "79%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: width > 400 ? 50 : 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: width > 400 ? 50 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  input: {
    height: width > 400 ? 60 : 40,
    width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    fontSize: width > 400 ? 30 : 15,
  },
  button: {
    width: width * 0.5,
    height: width * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: width * 0.08,
    marginTop: 20,
  },
  buttonCancel: {
    width: width * 0.5,
    height: width * 0.1,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: width * 0.08,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formCont: {
    width: width * 0.8,
    marginBottom: width * 0.08,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
})

export default EditDevicePage
