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
import { getAllDepartamentos } from "../../Modules/OperacionesBD";

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
  const [depData, setDepData] = useState([]);
  const [cost, setCost] = useState([]);
  const [descripCost, setDescripCost] = useState("");
  const [iva, setIva] = useState(false);
  const [ivaBtext, setIvaBText] = useState("off");
  const [buttonColor, setButtomColor] = useState("red");
  const [price, setPrice] = useState("");

  useEffect(() => {
    GetDepData();
    setIdOrder(Math.floor(Math.random() * 9000000) + 1);
  }, []);

  const GetDepData = async () => {
    try {
      const Data = await getAllDepartamentos();
      console.log("Registros de departamentos:", Data);
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
      setShowCost(false); // Ocultar ventana emergente al agregar
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>{item.description}</Text>
      <Text style={styles.costText}>{item.price}</Text>
      <Text style={styles.costText}>{item.iva ? "IVA incluido" : "Sin IVA"}</Text>
    </View>
  );

  const createPDF = async () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <h1>Orden de Servicio</h1>
        <p><strong>ID Orden:</strong> ${idOrder}</p>
        <p><strong>ID Dispositivo:</strong> ${idDevice}</p>
        <p><strong>Partes Utilizadas:</strong> ${partsUsed}</p>
        <p><strong>Diagnóstico General:</strong> ${geneDiag}</p>
        <h2>Costos:</h2>
        <table border="1" cellpadding="5">
          <tr>
            <th>Descripción</th>
            <th>Precio</th>
            <th>IVA</th>
          </tr>
          ${cost
            .map(
              (item) =>
                `<tr><td>${item.description}</td><td>${item.price}</td><td>${
                  item.iva ? "Incluido" : "No incluido"
                }</td></tr>`
            )
            .join("")}
        </table>
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
            <Text style={styles.text}>ID Orden: {idOrder}</Text>
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
                  key={dep.id_departamento} // Asegúrate de que cada elemento tenga una clave única
                  label={dep.nombre_depa} // Usa el nombre correcto de la propiedad
                  value={dep.id_departamento} // Usa el id correcto para el valor
                />
              ))}
            </Picker>

            <TouchableOpacity onPress={toggleCost}>
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
        data={cost.length > 0 ? cost : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay costos aún</Text>}
        contentContainerStyle={styles.flatlist}
      />
      <Button onPress={createPDF} title="Generar PDF" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30
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
    width: 40,
    height: 40,
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
});

export default OrderPage;
