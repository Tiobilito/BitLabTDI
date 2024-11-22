import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

import { getUserById } from "../../Modules/Operations DB Users";
import { getDispoById, addOrder, addCostSupa } from "../../Modules/Operations DB Fixes";
import { getAllDepartamentos } from "../../Modules/Operations DB Generals";

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
      payment_type: null
    };
    const idOrder = await addOrder(orderData);
  
    for (let i = 0; i < cost.length; i++) {
      //console.log(cost[i]);
      await addCostSupa(cost[i], idOrder);
    }
  };  

  const GetClientDeviceData = async () => {
    const deviceD = await getDispoById(idDevice);
    const clientD = await getUserById(deviceD.customer_id);
    setDeviceData(deviceD);
    setClientData(clientD);
    console.log("Cliente: ", clientData);
    console.log("dispositivo: ", deviceData);
  };

  const GetDepData = async () => {
    try {
      const Data = await getAllDepartamentos();
      //console.log("Registros de departamentos:", Data);
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
      setShowCost(false); // Ocultar ventana emergente al agregar
    }
  };

  const calculateTotalCost = () => {
    const total = cost.reduce((sum, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      return sum + itemPrice;
    }, 0);
    return total.toFixed(2); // Return a formatted total with two decimal places
  };

  const renderItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>{item.description}</Text>
      <Text style={styles.costText}>{item.price}</Text>
      <Text style={styles.costText}>
        {item.iva ? "IVA incluido" : "Sin IVA"}
      </Text>
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
          <title>Detalles de Contacto</title>
          <style>
              body {
                  font-family: "Book Antiqua", serif;
                  text-align: justify;
              }
              .center {
                  text-align: center;
              }
              .left {
                  text-align: left;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid black;
                  padding: 8px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <!-- Información del taller -->
          <p class="center">facebook.com/ILabTDI</p>
          <p class="center">Blvd. Marcelino García Barragán #1421, esq Calzada Olímpica.<br>
          Guadalajara, Jal, México, C.P. 44430.<br>
          Tel. (33) 3025-8430.</p>

          <!-- Información del cliente -->
          <p><strong>ID Orden:</strong> ${idOrder}</p>
          <p><strong>Nombre Cliente:</strong> ${
            clientData.name
          } <strong>Mail:</strong> ${clientData.emal} <strong>Tel:</strong> ${
      clientData.number
    } </p>
          <p><strong>Dirección:</strong> ${
            clientData.address
          } <strong>C.P:</strong> ${clientData.zip_code} </p>

          <!-- Información del dispositivo -->
          <p><strong>Dispositivo:</strong> ${
            deviceData.id
          } <strong>Tipo:</strong> ${
      deviceData.device_type
    } <strong>Modelo:</strong> ${deviceData.model} <strong>S/N:</strong> ${
      deviceData.serial_number
    } <strong>Marca:</strong> ${deviceData.brand} <strong>Color:</strong> ${
      deviceData.color
    } <strong>Inventario:</strong> ${deviceData.inventory_items} </p>
          <p><strong>Estado Físico:</strong> ${
            deviceData.received_status
          } <strong>Estatus:</strong> ${status} <strong>Departamento:</strong> ${department} <strong>Fecha:</strong> ${
      deviceData.received_date
    } </p>

          <!-- Descripción y solución -->
          <p><strong>Descripción:</strong> ${deviceData.rework_description} </p>
          <p><strong>Solución:</strong> ${geneDiag}</p>

          <!-- Costos -->
          <table>
              <tr>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>IVA</th>
              </tr>
              ${cost
                .map(
                  (item) =>
                    `<tr><td>${item.description}</td><td>${
                      item.price
                    }</td><td>${
                      item.iva ? "Incluido" : "No incluido"
                    }</td></tr>`
                )
                .join("")}
          </table>
          
          <p><strong>Total:</strong> $ ${totalCost} </p>

          <!-- Firmas -->
          <p><strong>TÉCNICO</strong></p>
          <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">
          <p><strong>CLIENTE ( ${clientData.name} )</strong></p>
          <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">

          <div style="page-break-before: always;"></div>

          <!-- Nota legal -->
          <p><strong>NO NOS RESPONSABILIZAMOS después de haber reparado o diagnosticado el equipo y notificado al cliente.</strong></p>
          <p><strong>NOTA: </strong>Para prestarte un mejor servicio, favor de leer las POLÍTICAS de SERVICIO y GARANTÍA.</p>
          <p>Reparamos COMPAQ, DELL, HP, GATEWAY, IBM, MAC, SONY, etc.</p>
          <hr>
          <p><strong>Fecha:</strong> ${new Date()}</p>
          <p><strong>Políticas de Servicio:</strong></p>
          <p>Reconozco y acepto las siguientes condiciones y términos relacionados con el servicio de reparación de computadoras ofrecido por el taller BitLabTDI:</p>
          <ul>
              <li>Servicio Gratuito: Entiendo que el servicio de reparación de computadora ofrecido es completamente gratuito y no conlleva ningún costo para el cliente.</li>
              <li>Responsabilidad Limitada: Estoy consciente de que los técnicos se esforzarán por reparar mi equipo de la mejor manera posible. Sin embargo, comprendo que no se garantiza la reparación exitosa y que el taller no se hace responsable de cualquier daño adicional que pueda ocurrir durante el proceso de reparación.</li>
          </ul>
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
    <View style={styles.background}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.text}>ID Dispositivo: {idDevice}</Text>
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
            <Picker
              selectedValue={status}
              style={styles.picker}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Recibido" value="Recibido" />
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="Reparado" value="Reparado" />
              <Picker.Item label="No Reparado" value="No Reparado" />
            </Picker>

            {/* Picker para departamentos */}
            <Picker
              selectedValue={department}
              style={styles.picker}
              onValueChange={(itemValue) => setDepartment(itemValue)}
            >
              {depData.map((dep) => (
                <Picker.Item
                  key={dep.id} // Asegúrate de que cada elemento tenga una clave única
                  label={dep.name} // Usa el nombre correcto de la propiedad
                  value={dep.id} // Usa el id correcto para el valor
                />
              ))}
            </Picker>

            <TouchableOpacity
              onPress={toggleCost}
              style={{ marginLeft: 120, width: 70, height: 70 }}
            >
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
                <Text>Iva </Text>
                <Button
                  title={ivaBtext}
                  color={buttonColor}
                  onPress={handleIva}
                />
                <Button title="Agregar Costo" onPress={addCost} />
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          cost.length > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: ${calculateTotalCost()}
              </Text>
            </View>
          )
        }
        data={cost.length > 0 ? cost : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay costos aún</Text>}
        contentContainerStyle={styles.flatlist}
      />
      <Button onPress={createPDF} title="Generar PDF" />
      <Button onPress={sendData} title="Añadir registro" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30,
  },
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: "white",
  },
  image: {
    width: 70,
    height: 70,
    marginVertical: 10,
  },
  subWin: {
    backgroundColor: "#e3f2fd",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
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
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default OrderPage;
