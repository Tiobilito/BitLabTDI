import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDispo } from "../../Modules/OperacionesBD";

const AddDevicePage = ({ navigation }) => {
  const route = useRoute();
  const { idCli } = route.params;

  const [formData, setFormData] = useState({
    sn: "",
    type: "",
    model: "",
    physiCond: "",
    brand: "",
    receidStat: "",
    color: "",
    case: "",
    inventory: "",
    date: new Date(),
  });

  const [showDt, setShowDt] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAndSendData = async () => {
    const { type, receidStat, color, brand } = formData;
    if (
      type.trim() !== "" &&
      receidStat.trim() !== "" &&
      color.trim() !== "" &&
      brand.trim() !== ""
    ) {
      await sendData();
    } else {
      Alert.alert("Por favor rellene los campos obligatorios");
    }
  };

  const sendData = async () => {
    const newDeviceData = {
      sn: formData.sn,
      tipo_dis: formData.type,
      id_cliente: idCli,
      modelo: formData.model,
      estado_fisi: formData.physiCond,
      esta_recep: formData.receidStat,
      color: formData.color,
      marca: formData.brand,
      caso: formData.case,
      fecha: formData.date.toISOString(),
      inventario: parseInt(formData.inventory, 10),
    };
    await addDispo(newDeviceData);
    navigation.navigate("Devices", { idClient: idCli });
  };

  const showDatePicker = () => {
    setShowDt(true);
  };

  const onDateChange = (e, selectedDate) => {
    setFormData((prev) => ({ ...prev, date: selectedDate }));
    setShowDt(false);
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={styles.title}>Añadir Dispositivo</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>S/N:</Text>
            <TextInput
              style={styles.input}
              value={formData.sn}
              onChangeText={(value) => handleChange("sn", value)}
              placeholder="S/N"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo *:</Text>
            <TextInput
              style={styles.input}
              value={formData.type}
              onChangeText={(value) => handleChange("type", value)}
              placeholder="Tipo de dispositivo"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Modelo:</Text>
            <TextInput
              style={styles.input}
              value={formData.model}
              onChangeText={(value) => handleChange("model", value)}
              placeholder="Modelo"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado Físico:</Text>
            <TextInput
              style={styles.input}
              value={formData.physiCond}
              onChangeText={(value) => handleChange("physiCond", value)}
              placeholder="Estado Físico"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Marca *:</Text>
            <TextInput
              style={styles.input}
              value={formData.brand}
              onChangeText={(value) => handleChange("brand", value)}
              placeholder="Marca"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Caso:</Text>
            <TextInput
              style={styles.input}
              value={formData.case}
              onChangeText={(value) => handleChange("case", value)}
              placeholder="Caso"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado recibido *:</Text>
            <TextInput
              style={styles.input}
              value={formData.receidStat}
              onChangeText={(value) => handleChange("receidStat", value)}
              placeholder="Estado recibido"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Inventario:</Text>
            <TextInput
              style={styles.input}
              value={formData.inventory}
              onChangeText={(value) =>
                /^\d+$/.test(value) || value === ""
                  ? handleChange("inventory", value)
                  : null
              }
              placeholder="Inventario"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.label}>Fecha (click para seleccionar):</Text>
              {showDt && (
                <DateTimePicker
                  value={formData.date}
                  mode="date"
                  onChange={onDateChange}
                />
              )}
              <Text style={styles.label}>
                {formData.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Color *:</Text>
            <TextInput
              style={styles.input}
              value={formData.color}
              onChangeText={(value) => handleChange("color", value)}
              placeholder="Color"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => verifyAndSendData()}
          >
            <Text style={styles.buttonText}>Añadir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#095ea7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonCancel: {
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddDevicePage;
