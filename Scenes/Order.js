import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

const OrderPage = ({ navigation }) => {
  const route = useRoute();
  const { idDevice } = route.params;
  const [ShowCost, setShowCost] = useState(false);
  const [idOrder, setIdOrder] = useState(0);
  const [idClient, setIdClient] = useState(0);
  const [partsUsed, setPartsUsed] = useState("");
  const [geneDiag, setGeneDiag] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [discounts, setDiscounts] = useState(0);
  const [typePay, setTypePay] = useState("");
  const [total, setTotal] = useState(0);
  const [depData, setDepData] = useState([]);
  //All cost const
  const [cost, setCost] = useState([]);
  const [cEmpty, setCEmpty] = useState(true);
  const [descripCost, setDescripCost] = useState("");
  const [iva, setIva] = useState(false);
  const [ivaBtext, setIvaBText] = useState("off");
  const [buttonColor, setButtomColor] = useState("red");
  const [price, setPrice] = useState("");
  const html = `
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
          font-family: 
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
        <p class="center">facebook.com/ILabTDI</p>
        <p class="center">Blvd. Marcelino García Barragán #1421, esq Calzada Olímpica.<br>
        Guadalajara, Jal, México, C.P. 44430.<br>
        Tel. (33) 3025-8430.</p>

        <p><strong>DANTE Mail:</strong> ass@gmail.com <strong>Tel:</strong> 1111111111 <strong>Cliente:</strong> 2</p>
        <p><strong>Dirección:</strong> 122dds <strong>Colonia:</strong> sdsdfg <strong>Ciudad:</strong> assddf <strong>C.P:</strong> 122334</p>

        <p><strong>Dispositivo:</strong> #90 <strong>Tipo:</strong> compu <strong>Modelo:</strong> Maserati <strong>S/N:</strong> SD <strong>Marca:</strong> toshiva <strong>Color:</strong> verde <strong>Inventario:</strong> 2</p>
        <p><strong>Estado Físico:</strong> obsoleto <strong>Estatus:</strong> Recibido <strong>Departamento:</strong> iLabTDI <strong>Fecha:</strong> 2024/04/22</p>
        
        <p><strong>Descripción:</strong> led dña</p>
        <p><strong>Solución:</strong> asdasdasd</p>

        <table>
            <tr>
                <th>Descripción</th>
                <th>Precio</th>
                <th>IVA</th>
            </tr>
            <tr>
                <td>N/A</td>
                <td>0.0</td>
                <td>No incluido</td>
            </tr>
        </table>
      
        <p><strong>Total:</strong> $ 0.00</p>

        <p><strong>TÉCNICO</strong></p>
        <!-- Espacio para la firma del técnico -->
        <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">

        <p><strong>CLIENTE (DANTE)</strong></p>
        <!-- Espacio para la firma del cliente -->
        <hr style="border: none; height: 2px; background-color: black; margin: 20px 0;">
      
      <div style="page-break-before: always;"></div>
      
        <p><strong>NO NOS RESPONSABILIZAMOS después de haber reparado o diagnosticado el equipo y notificado al cliente.</strong></p>
        <p><strong>NOTA: </strong>Para prestarte un mejor servicio, favor de leer las POLÍTICAS de SERVICIO y GARANTÍA.</p>
        <p>Reparamos7 COMPAQ, DELL, HP, GATEWAY, IBM, MAC, SONY, etc.</p>
        <hr>
        <p><strong>Fecha:</strong> 2024/04/22</p>
        <p><strong>Políticas de Servicio:</strong></p>
        <p>Reconozco y acepto las siguientes condiciones y términos relacionados con el servicio de reparación de computadoras ofrecido por el taller BitLabTDI:</p>
        <ul>
            <li>Servicio Gratuito: Entiendo que el servicio de reparación de computadora ofrecido es completamente gratuito y no conlleva ningún costo para el cliente.</li>
            <li>Responsabilidad Limitada: Estoy consciente de que los técnicos se esforzarán por reparar mi equipo de la mejor manera posible. Sin embargo, comprendo que no se garantiza la reparación exitosa y que el taller no se hace responsable de cualquier daño adicional que pueda ocurrir durante el proceso de reparación.</li>
    </html>	
  `;

  useEffect(() => {
    GetDepData("http://10.214.150.5:3000/departamentos");
    GetDeviceData("http://10.214.150.5:3000/dispositivos");
    setIdOrder(Math.floor(Math.random() * 9000000) + 1);
  }, []);

  const GetDepData = async (url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setDepData(json);
    } catch (error) {
      console.log(error);
    }
  };

  const GetDeviceData = async (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((item) => {
          if (item.idDispo === idDevice) {
            setIdClient(item.idCliente);
          }
        });
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  };

  let createPDF = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
      fileName: "Dante.pdf",
    });
    await shareAsync(file.uri);
  };

  const handleIva = () => {
    setButtomColor(buttonColor === "red" ? "blue" : "red");
    setIvaBText(buttonColor === "red" ? "On" : "Off");
    setIva(iva === false ? true : false);
  };

  const toggleCost = () => {
    setShowCost(!ShowCost);
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={styles.text}>ID - Orden: {idOrder}</Text>
          <Text style={styles.text}>ID - Dispositivo: {idDevice}</Text>
          <Text style={styles.text}>ID - Cliente: {idClient}</Text>
          <Text style={styles.text}>Partes utilizadas: </Text>
          <TextInput
            multiline
            style={[styles.input, styles.multilineText]}
            onChangeText={(text) => {
              setPartsUsed(text);
            }}
            value={partsUsed}
            placeholder="Partes utilizadas"
          />
          <Text style={styles.text}>Diagnostigo general: </Text>
          <TextInput
            multiline
            style={[styles.input, styles.multilineText]}
            onChangeText={(text) => {
              setGeneDiag(text);
            }}
            value={geneDiag}
            placeholder="Diagnostigo general"
          />
          <View>
            <Text style={styles.text}>Estatus: </Text>
            <Picker
              selectedValue={status}
              itemStyle={styles.text}
              onValueChange={(itemValue) => setStatus(itemValue)}
            >
              <Picker.Item label="Recibido" value="Recibido" />
              <Picker.Item label="Pendiente" value="Pendiente" />
              <Picker.Item label="Reparado" value="Reparado" />
              <Picker.Item label="No Reparado" value="No Reparado" />
              <Picker.Item label="Traer Despues" value="Traer Despues" />
              <Picker.Item label="Revisado" value="Revisado" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
            <Text style={styles.text}>Departamento: </Text>
            <Picker
              selectedValue={department}
              itemStyle={styles.text}
              onValueChange={(itemValue) => setDepartment(itemValue)}
            >
              <Picker.Item label="iLabTDI" value="iLabTDI" />
              {depData.map((item) => {
                return (
                  <Picker.Item
                    key={item.idDepartamento}
                    label={item.nombreDepa}
                    value={item.nombreDepa}
                  />
                );
              })}
            </Picker>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Costos: </Text>
              <TouchableOpacity onPress={() => toggleCost()}>
                <Image
                  source={require("../Resources/imagenes/agregar3.png")}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
            {ShowCost ? (
              <View style={styles.subWin}>
                <TextInput
                  multiline
                  style={[styles.input, styles.multilineText]}
                  onChangeText={(text) => {
                    setDescripCost(text);
                  }}
                  value={descripCost}
                  placeholder="Descripcion Costo"
                />
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Precio: </Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                      setPrice(text);
                    }}
                    value={price}
                    placeholder="Precio"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.text}>Iva: </Text>
                  <Button
                    title={ivaBtext}
                    color={buttonColor}
                    onPress={() => handleIva()}
                  />
                </View>
              </View>
            ) : null}
            <FlatList
              data={cost}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.flatlistContainer}></View>
              )}
            />
            <Button onPress={createPDF} title="Generar PDF" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subWin: {
    flex: 1,
    margin: 20,
    backgroundColor: "#0a75d1",
  },
  background: {
    flex: 1,
    backgroundColor: "#095ea7",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20, // Espacio horizontal entre elementos
    marginTop: 10,
  },
  input: {
    margin: 20,
    flex: 1,
    padding: 10,
    fontSize: 30,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },
  multilineText: {
    minHeight: 150,
    maxHeight: 150,
    textAlignVertical: "top",
  },
  image: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    marginRight: 10,
    color: "white",
  },
  flatlistContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 15,
  },
});

export default OrderPage;
