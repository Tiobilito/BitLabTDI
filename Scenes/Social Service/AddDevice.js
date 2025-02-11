import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDispo } from "../../Modules/Operations DB Fixes";
import { CustomView } from "../components/CustomView";
import { CustomViewReverse } from "../components/CustomViewReverse";

const Scale = Dimensions.get("window").width;

const AddDevicePage = ({ navigation }) => {
  const route = useRoute();
  const { idCli } = route.params;

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
  });

  const [showDt, setShowDt] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAndSendData = async () => {
    const { device_type, received_status, color, brand } = formData;
    if (
      device_type.trim() !== "" &&
      received_status.trim() !== "" &&
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
      device_type: formData.device_type,
      customer_id: parseInt(idCli, 10),
      model: formData.model,
      brand: formData.brand,
      received_status: formData.received_status,
      color: formData.color,
      rework_description: formData.rework_description,
      received_date: formData.received_date.toISOString(),
      inventory_items: parseInt(formData.inventory_items, 10),
    };    
    await addDispo(newDeviceData);
    navigation.navigate("Devices", { idClient: idCli });
  };

  const showDatePicker = () => {
    setShowDt(true);
  };

  const onDateChange = (e, selectedDate) => {
    setFormData((prev) => ({ ...prev, received_date: selectedDate }));
    setShowDt(false);
  };

  return (
    <CustomViewReverse>
      <ScrollView style={styles.Scroll}>
        <View style={styles.formCont}>
          <Text style={styles.title}>Añadir Dispositivo</Text>

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numero de serie:</Text>
              <TextInput
                style={styles.input}
                value={formData.sn}
                onChangeText={(value) => handleChange("sn", value)}
                placeholder="S/N"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo *:</Text>
              <TextInput
                style={styles.input}
                value={formData.device_type}
                onChangeText={(value) => handleChange("device_type", value)}
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
              <Text style={styles.label}>Marca *:</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(value) => handleChange("brand", value)}
                placeholder="Marca"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripción de la reparacion:</Text>
              <TextInput
                style={styles.input}
                value={formData.rework_description}
                onChangeText={(value) => handleChange("rework_description", value)}
                placeholder="Descripción"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado recibido *:</Text>
              <TextInput
                style={styles.input}
                value={formData.received_status}
                onChangeText={(value) => handleChange("received_status", value)}
                placeholder="Estado recibido"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Inventario:</Text>
              <TextInput
                style={styles.input}
                value={formData.inventory_items}
                onChangeText={(value) =>
                  /^\d+$/.test(value) || value === ""
                    ? handleChange("inventory_items", value)
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
                    value={formData.received_date}
                    mode="date"
                    onChange={onDateChange}
                  />
                )}
                <Text style={styles.label}>
                  {formData.received_date.toLocaleDateString()}
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
    </CustomViewReverse>
  );
};

const styles = StyleSheet.create({
  Scroll: {
    marginTop: 35,
  },
  container: {
    width: "95%",
    height: "79%",
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
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
  button: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.08,
    marginTop: 20,
  },
  buttonCancel: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.08,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formCont: {
    width: Scale * 0.8,
    marginBottom: Scale * 0.08,
  },
});

export default AddDevicePage;