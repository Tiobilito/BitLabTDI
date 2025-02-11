import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

import { getUserById } from "../../Modules/Operations DB Users";
import { getDispoById, addOrder, addCostSupa } from "../../Modules/Operations DB Fixes";
import { getAllDepartamentos } from "../../Modules/Operations DB Generals";
import { CustomViewReverse } from "../components/CustomViewReverse";

const Scale = Dimensions.get("window").width;

const OrderPage = ({ navigation }) => {
  const route = useRoute();
  const { idDevice } = route.params;

  const [ShowCost, setShowCost] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [partsUsed, setPartsUsed] = useState("");
  const [geneDiag, setGeneDiag] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState(0);
  const [depData, setDepData] = useState([]);
  const [cost, setCost] = useState([]);
  const [descripCost, setDescripCost] = useState("");
  const [iva, setIva] = useState(false);
  const [ivaBtext, setIvaBText] = useState("off");
  const [buttonColor, setButtomColor] = useState("red");
  const [price, setPrice] = useState("");

  useEffect(() => {
    GetDepData();
    GetClientDeviceData();
  }, []);

  const sendData = async () => {
    const totalCost = calculateTotalCost();
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
    };
    const idOrder = await addOrder(orderData);

    for (let i = 0; i < cost.length; i++) {
      await addCostSupa(cost[i], idOrder);
    }
    navigation.goBack();
  };

  const GetClientDeviceData = async () => {
    const deviceD = await getDispoById(idDevice);
    const clientD = await getUserById(deviceD.customer_id);
    setDeviceData(deviceD);
    setClientData(clientD);
  };

  const GetDepData = async () => {
    try {
      const Data = await getAllDepartamentos();
      setDepData(Data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleIva = () => {
    setButtomColor(buttonColor === "red" ? "blue" : "red");
    setIvaBText(buttonColor === "red" ? "On" : "Off");
    setIva(!iva);
  };

  const toggleCost = () => {
    setShowCost(!ShowCost);
  };

  const addCost = () => {
    if (descripCost && price) {
      const newCost = {
        id: Math.random().toString(),
        description: descripCost,
        price: price,
        iva: iva,
      };
      setCost([...cost, newCost]);
      setDescripCost("");
      setPrice("");
      setIva(false);
      setShowCost(false);
    }
  };

  const calculateTotalCost = () => {
    const total = cost.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      return sum + itemPrice;
    }, 0);
    return total.toFixed(2);
  };

  const renderCostItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>{item.description}</Text>
      <Text style={styles.costText}>{item.price}</Text>
      <Text style={styles.costText}>{item.iva ? "IVA incluido" : "Sin IVA"}</Text>
    </View>
  );

  const createPDF = async () => {
    const totalCost = calculateTotalCost();
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
            <strong>Nombre Cliente:</strong> ${clientData ? clientData.name : ""} &nbsp;
            <strong>Mail:</strong> ${clientData ? clientData.email : ""} &nbsp;
            <strong>Tel:</strong> ${clientData ? clientData.number : ""}
          </p>
          <p>
            <strong>Dirección:</strong> ${clientData ? clientData.address : ""} &nbsp;
            <strong>C.P:</strong> ${clientData ? clientData.zip_code : ""}
          </p>
          <p>
            <strong>Dispositivo:</strong> ${deviceData ? deviceData.id : ""} &nbsp;
            <strong>Tipo:</strong> ${deviceData ? deviceData.device_type : ""} &nbsp;
            <strong>Modelo:</strong> ${deviceData ? deviceData.model : ""} &nbsp;
            <strong>S/N:</strong> ${deviceData ? deviceData.serial_number : ""}
          </p>
          <p>
            <strong>Estado Físico:</strong> ${deviceData ? deviceData.received_status : ""} &nbsp;
            <strong>Estatus:</strong> ${status} &nbsp;
            <strong>Departamento:</strong> ${department} &nbsp;
            <strong>Fecha:</strong> ${deviceData ? deviceData.received_date : ""}
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
    `;

    const file = await printToFileAsync({
      html: htmlContent,
      base64: false,
      fileName: "OrderDetails.pdf",
    });
    await shareAsync(file.uri);
  };

  return (
    <CustomViewReverse>
      <FlatList
        style={styles.Scroll}
        data={[{ key: "dummy" }]}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.formCont}>
            <Text style={styles.title}>Orden de Servicio</Text>
            <View style={styles.container}>
              <Text style={styles.label}>ID Dispositivo: {idDevice}</Text>
              <TextInput
                multiline
                style={styles.input}
                onChangeText={setPartsUsed}
                value={partsUsed}
                placeholder="Partes utilizadas"
              />
              <TextInput
                multiline
                style={styles.input}
                onChangeText={setGeneDiag}
                value={geneDiag}
                placeholder="Diagnóstico general"
              />
              <Text style={styles.label}>Estado</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                >
                  <Picker.Item label="Recibido" value="Recibido" />
                  <Picker.Item label="Pendiente" value="Pendiente" />
                  <Picker.Item label="Reparado" value="Reparado" />
                  <Picker.Item label="No Reparado" value="No Reparado" />
                </Picker>
              </View>
              <Text style={styles.label}>Departamento</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={department}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  onValueChange={(itemValue) => setDepartment(itemValue)}
                >
                  {depData.map((dep) => (
                    <Picker.Item key={dep.id} label={dep.name} value={dep.id} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity onPress={toggleCost} style={styles.addCostButton}>
                <Image
                  source={require("../../Resources/imagenes/agregar3.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
              {ShowCost && (
                <View style={styles.subWin}>
                  <TextInput
                    multiline
                    style={styles.input}
                    onChangeText={setDescripCost}
                    value={descripCost}
                    placeholder="Descripción del costo"
                  />
                  <TextInput
                    style={styles.input}
                    onChangeText={setPrice}
                    value={price}
                    placeholder="Precio"
                    keyboardType="numeric"
                  />
                  <Text style={styles.label}>IVA</Text>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: buttonColor, width: Scale * 0.3 }]}
                    onPress={handleIva}
                  >
                    <Text style={styles.buttonText}>{ivaBtext}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={addCost}>
                    <Text style={styles.buttonText}>Agregar Costo</Text>
                  </TouchableOpacity>
                </View>
              )}
              {cost.length > 0 && (
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Total: ${calculateTotalCost()}</Text>
                </View>
              )}
              <FlatList
                data={cost}
                renderItem={renderCostItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.label}>No hay costos aún</Text>}
                contentContainerStyle={styles.flatlist}
                nestedScrollEnabled={true}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={createPDF}>
              <Text style={styles.buttonText}>Generar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={sendData}>
              <Text style={styles.buttonText}>Añadir registro</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </CustomViewReverse>
  );
};

const styles = StyleSheet.create({
  Scroll: {
    marginTop: 35,
  },
  formCont: {
    width: Scale * 0.8,
    alignSelf: "center",
    marginBottom: Scale * 0.08,
  },
  container: {
    width: "95%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: Scale > 400 ? 50 : 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: Scale > 400 ? 50 : 15,
    marginLeft: "5%",
    color: "#000000",
    marginTop: 10,
  },
  input: {
    height: Scale > 400 ? 60 : 40,
    width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    fontSize: Scale > 400 ? 30 : 15,
  },
  pickerContainer: {
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    margin: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#000",
  },
  image: {
    width: 70,
    height: 70,
    alignSelf: "center",
    marginVertical: 10,
  },
  addCostButton: {
    alignSelf: "center",
    marginVertical: 10,
  },
  subWin: {
    backgroundColor: "#C5E0F2",
    padding: 10,
    borderRadius: Scale > 400 ? 20 : 15,
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
  button: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonCancel: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerItem: {
    fontSize: 1,
  },
});

export default OrderPage;
