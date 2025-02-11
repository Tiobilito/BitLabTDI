import React, { useState, useEffect } from "react";
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
import { getDispoById, updateDispo } from "../../Modules/Operations DB Fixes";
import { CustomView } from "../components/CustomView";

const Scale = Dimensions.get("window").width;

const EditDevicePage = ({ navigation }) => {
  const route = useRoute();
  const { idDevice } = route.params;
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
  });
  const [showDt, setShowDt] = useState(false);

  useEffect(() => {
    GetDeviceData();
  }, []);

  const GetDeviceData = async () => {
    const item = await getDispoById(idDevice);
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
      });
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAndSendData = () => {
    const { sn, type, model, brand, receivedStatus, color, inventory, case: caseDesc } = formData;

    if (
      sn.trim() !== "" &&
      type.trim() !== "" &&
      model.trim() !== "" &&
      brand.trim() !== "" &&
      receivedStatus.trim() !== "" &&
      color.trim() !== "" &&
      inventory.trim() !== ""
    ) {
      sendData();
    } else {
      Alert.alert("Por favor rellene todos los datos correctamente");
    }
  };

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
    };

    await updateDispo(idDevice, updatedData);
    navigation.goBack();
  };

  const ShowDt = () => {
    setShowDt(true);
  };

  const onChangeDate = (e, SelectedDate) => {
    setFormData((prev) => ({ ...prev, date: SelectedDate }));
    setShowDt(false);
  };

  return (
    <CustomView>
      <ScrollView style={styles.Scroll}>
        <View style={styles.formCont}>
          <Text style={styles.title}>Editar Dispositivo</Text>

          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numero de serie</Text>
              <TextInput
                style={styles.input}
                value={formData.sn}
                onChangeText={(value) => handleChange("sn", value)}
                placeholder="S/N"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                style={styles.input}
                value={formData.type}
                onChangeText={(value) => handleChange("type", value)}
                placeholder="Tipo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Modelo</Text>
              <TextInput
                style={styles.input}
                value={formData.model}
                onChangeText={(value) => handleChange("model", value)}
                placeholder="Modelo"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Marca</Text>
              <TextInput
                style={styles.input}
                value={formData.brand}
                onChangeText={(value) => handleChange("brand", value)}
                placeholder="Marca"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Estado recibido</Text>
              <TextInput
                style={styles.input}
                value={formData.receivedStatus}
                onChangeText={(value) => handleChange("receivedStatus", value)}
                placeholder="Estado recibido"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Inventario</Text>
              <TextInput
                style={styles.input}
                value={formData.inventory}
                onChangeText={(value) => handleChange("inventory", value)}
                placeholder="Inventario"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={ShowDt}>
                <Text style={styles.label}>Fecha (click para seleccionar):</Text>
                {showDt && (
                  <DateTimePicker value={formData.date} mode="date" onChange={onChangeDate} />
                )}
                <Text style={styles.label}>
                  {formData.date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(value) => handleChange("color", value)}
                placeholder="Color"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descripcion de la reparacion</Text>
              <TextInput
                style={styles.input}
                value={formData.case}
                onChangeText={(value) => handleChange("case", value)}
                placeholder="Caso"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={verifyAndSendData}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomView>
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

export default EditDevicePage;