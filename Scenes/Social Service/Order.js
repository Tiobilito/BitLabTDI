import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  FlatList,
  Image,
  Dimensions,
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"
import { printToFileAsync } from "expo-print"
import { shareAsync } from "expo-sharing"

import { getUserById } from "../../Modules/Operations DB Users"
import {
  getDispoById,
  addOrder,
  addCostSupa,
} from "../../Modules/Operations DB Fixes"
import { getAllDepartamentos } from "../../Modules/Operations DB Generals"
import { CustomViewReverse } from "../components/CustomViewReverse"
import {
  CustomButton,
  Form,
  FloatingInput,
  FloatingText,
} from "../../components"
import { mainStyles } from "../../components/styles"

const { width, height } = Dimensions.get("window")

const OrderPage = ({ navigation }) => {
  const route = useRoute()
  const { idDevice } = route.params

  const [ShowCost, setShowCost] = useState(false)
  const [deviceData, setDeviceData] = useState(null)
  const [clientData, setClientData] = useState(null)
  const [partsUsed, setPartsUsed] = useState("")
  const [geneDiag, setGeneDiag] = useState("")
  const [status, setStatus] = useState("")
  const [department, setDepartment] = useState(0)
  const [depData, setDepData] = useState([])
  const [cost, setCost] = useState([])
  const [descripCost, setDescripCost] = useState("")
  const [iva, setIva] = useState(false)
  const [ivaBtext, setIvaBText] = useState("off")
  const [buttonColor, setButtomColor] = useState("red")
  const [price, setPrice] = useState("")

  useEffect(() => {
    GetDepData()
    GetClientDeviceData()
  }, [])

  const sendData = async () => {
    const totalCost = calculateTotalCost()
    const orderData = {
      customer_id: clientData.code,
      department_id: department,
      device_id: deviceData.id,
      date_received: new Date(deviceData.received_date),
      closing_date: new Date(),
      status: status,
      total: totalCost,
      diagnosis: geneDiag,
      payment_type: null,
    }
    const idOrder = await addOrder(orderData)

    for (let i = 0; i < cost.length; i++) {
      await addCostSupa(cost[i], idOrder)
    }
    navigation.goBack()
  }

  const GetClientDeviceData = async () => {
    const deviceD = await getDispoById(idDevice)
    const clientD = await getUserById(deviceD.customer_id)
    setDeviceData(deviceD)
    setClientData(clientD)
  }

  const GetDepData = async () => {
    try {
      const Data = await getAllDepartamentos()
      setDepData(Data || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const handleIva = () => {
    setButtomColor(buttonColor === "red" ? "blue" : "red")
    setIvaBText(buttonColor === "red" ? "On" : "Off")
    setIva(!iva)
  }

  const toggleCost = () => {
    setShowCost(!ShowCost)
  }

  const addCost = () => {
    if (descripCost && price) {
      const newCost = {
        id: Math.random().toString(),
        description: descripCost,
        price: price,
        iva: iva,
      }
      setCost([...cost, newCost])
      setDescripCost("")
      setPrice("")
      setIva(false)
      setShowCost(false)
    }
  }

  const calculateTotalCost = () => {
    const total = cost.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0
      return sum + itemPrice
    }, 0)
    return total.toFixed(2)
  }

  const renderCostItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>{item.description}</Text>
      <Text style={styles.costText}>{item.price}</Text>
      <Text style={styles.costText}>
        {item.iva ? "IVA incluido" : "Sin IVA"}
      </Text>
    </View>
  )

  const createPDF = async () => {
    const totalCost = calculateTotalCost()
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Detalles de Orden</title>
          <style>
              body { font-family: "Book Antiqua", serif; text-align: justify; }
              .center { text-align: center; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: center; }
          </style>
      </head>
      <body>
          <p class="center">facebook.com/ILabTDI</p>
          <p class="center">
            Blvd. Marcelino García Barragán #1421, esq Calzada Olímpica.<br>
            Guadalajara, Jal, México, C.P. 44430.<br>
            Tel. (33) 3025-8430.
          </p>
          <p><strong>ID Orden:</strong> ${"ID"} </p>
          <p>
            <strong>Nombre Cliente:</strong> ${
              clientData ? clientData.name : ""
            } &nbsp;
            <strong>Mail:</strong> ${clientData ? clientData.email : ""} &nbsp;
            <strong>Tel:</strong> ${clientData ? clientData.number : ""}
          </p>
          <p>
            <strong>Dirección:</strong> ${
              clientData ? clientData.address : ""
            } &nbsp;
            <strong>C.P:</strong> ${clientData ? clientData.zip_code : ""}
          </p>
          <p>
            <strong>Dispositivo:</strong> ${
              deviceData ? deviceData.id : ""
            } &nbsp;
            <strong>Tipo:</strong> ${
              deviceData ? deviceData.device_type : ""
            } &nbsp;
            <strong>Modelo:</strong> ${
              deviceData ? deviceData.model : ""
            } &nbsp;
            <strong>S/N:</strong> ${deviceData ? deviceData.serial_number : ""}
          </p>
          <p>
            <strong>Estado Físico:</strong> ${
              deviceData ? deviceData.received_status : ""
            } &nbsp;
            <strong>Estatus:</strong> ${status} &nbsp;
            <strong>Departamento:</strong> ${department} &nbsp;
            <strong>Fecha:</strong> ${
              deviceData ? deviceData.received_date : ""
            }
          </p>
          <p><strong>Partes utilizadas:</strong> ${partsUsed}</p>
          <p><strong>Solución:</strong> ${geneDiag}</p>
          <table>
              <tr>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>IVA</th>
              </tr>
              ${cost
                .map(
                  (item) =>
                    `<tr>
                      <td>${item.description}</td>
                      <td>${item.price}</td>
                      <td>${item.iva ? "Incluido" : "No incluido"}</td>
                    </tr>`
                )
                .join("")}
          </table>
          <p><strong>Total:</strong> $ ${totalCost} </p>
          <p><strong>TÉCNICO</strong></p>
          <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">
          <p><strong>CLIENTE (${clientData ? clientData.name : ""})</strong></p>
          <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">
          <div style="page-break-before: always;"></div>
          <p><strong>NO NOS RESPONSABILIZAMOS después de haber reparado o diagnosticado el equipo y notificado al cliente.</strong></p>
          <p><strong>NOTA:</strong> Favor de leer las POLÍTICAS de SERVICIO y GARANTÍA.</p>
          <hr>
          <p><strong>Fecha:</strong> ${new Date()}</p>
      </body>
      </html>
    `

    const file = await printToFileAsync({
      html: htmlContent,
      base64: false,
      fileName: "OrderDetails.pdf",
    })
    await shareAsync(file.uri)
  }

  return (
    <CustomViewReverse>
      <View style={styles.body}>
        <FlatList
          style={styles.Scroll}
          data={[{ key: "dummy" }]}
          renderItem={() => null}
          ListHeaderComponent={
            <Form title="Orden de Servicio">
              <View style={styles.formCont}>
                <FloatingText
                  title="ID Dispositivo"
                  text={idDevice}
                  containerStyle={{ marginBottom: 0 }}
                />
                <FloatingInput
                  label={""}
                  multiline={true}
                  value={partsUsed}
                  onChangeText={setPartsUsed}
                  placeholder={"Partes utilizadas"}
                  containerStyle={{ marginBottom: -10 }}
                />
                <FloatingInput
                  label={""}
                  multiline={true}
                  value={geneDiag}
                  onChangeText={setGeneDiag}
                  placeholder={"Diagnóstico general"}
                />

                <View style={{ marginTop: 10 }}>
                  <Text style={mainStyles.title}>Estado</Text>
                  <View style={[mainStyles.input, styles.pickerContainer]}>
                    <Picker
                      selectedValue={status}
                      onValueChange={(itemValue) => setStatus(itemValue)}
                    >
                      <Picker.Item label="Recibido" value="Recibido" />
                      <Picker.Item label="Pendiente" value="Pendiente" />
                      <Picker.Item label="Reparado" value="Reparado" />
                      <Picker.Item label="No Reparado" value="No Reparado" />
                    </Picker>
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text style={mainStyles.title}>Departamento</Text>
                  <View style={[mainStyles.input, styles.pickerContainer]}>
                    <Picker
                      selectedValue={department}
                      onValueChange={(itemValue) => setDepartment(itemValue)}
                    >
                      {depData.map((dep) => (
                        <Picker.Item
                          key={dep.id}
                          label={dep.name}
                          value={dep.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={toggleCost}
                    style={styles.addCostButton}
                  >
                    <Image
                      source={require("../../Resources/imagenes/agregar3.png")}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
                {ShowCost && (
                  <View style={styles.subWin}>
                    <FloatingInput
                      label={"Descripción del costo"}
                      value={descripCost}
                      onChangeText={setDescripCost}
                      placeholder={"...."}
                      inputStyle={{ backgroundColor: "#FFF" }}
                      multiline={true}
                    />
                    <FloatingInput
                      label={"Precio"}
                      value={price}
                      onChangeText={setPrice}
                      placeholder={"xxxx.xx"}
                      keyboardType={"numeric"}
                      inputStyle={{ backgroundColor: "#FFF" }}
                    />

                    <View
                      style={{
                        justifyContent: "center",
                        marginLeft: 10,
                        marginVertical: 5,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 20,
                        }}
                      >
                        <Text
                          style={[mainStyles.title, { fontSize: width * 0.08 }]}
                        >
                          IVA
                        </Text>
                        <CustomButton
                          title={ivaBtext}
                          onPress={handleIva}
                          buttonStyles={{
                            backgroundColor: buttonColor,
                            width: width * 0.3,
                          }}
                        />
                      </View>
                      <CustomButton title="Agregar Costo" onPress={addCost} />
                    </View>
                  </View>
                )}
                {cost.length > 0 && (
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>
                      Total: ${calculateTotalCost()}
                    </Text>
                  </View>
                )}
                <FlatList
                  data={cost}
                  renderItem={renderCostItem}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <Text
                      style={[
                        mainStyles.title,
                        { fontSize: width * 0.08, alignSelf: "center" },
                      ]}
                    >
                      No hay costos aún
                    </Text>
                  }
                  contentContainerStyle={styles.flatlist}
                  nestedScrollEnabled={true}
                />

                <View style={styles.approval}>
                  <CustomButton
                    title="Generar PDF"
                    onPress={createPDF}
                    buttonStyles={{
                      width: width * 0.32,
                      backgroundColor: "#DC3545",
                    }}
                  />
                  <CustomButton
                    title="Añadir registro"
                    onPress={sendData}
                    buttonStyles={{
                      width: width * 0.32,
                      backgroundColor: "#007BFF",
                    }}
                  />
                </View>
              </View>
            </Form>
          }
        />
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    height: height * 0.85,

    paddingHorizontal: 20,
  },
  formCont: {
    width: width * 0.7,
    alignSelf: "center",
    marginBottom: width * 0.08,
  },
  title: {
    fontSize: width > 400 ? 50 : 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
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
  pickerContainer: {
    height: height * 0.05,
    justifyContent: "center",
  },
  addCostButton: {
    backgroundColor: "#C5E0F2",
    borderRadius: 100,
    width: 90,
    height: 90,
    marginVertical: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  image: {
    width: 70,
    height: 70,
  },
  subWin: {
    backgroundColor: "#C5E0F2",
    padding: 10,
    borderRadius: width > 400 ? 20 : 15,
    margin: 10,
  },
  flatlist: {
    paddingBottom: 20,
  },
  costItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 5,
  },
  costText: {
    fontSize: 16,
  },
  totalContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  approval: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
    marginBottom: -width * 0.05,
  },
})

export default OrderPage
