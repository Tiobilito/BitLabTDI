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
import { AddClient } from "../../Modules/OperacionesBD";

const Scale = Dimensions.get("window").width;

const AddCPage = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    neighborhood: "",
    city: "",
    zipCode: "",
    email: "",
    phone: "",
    phone2: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAllContents = async () => {
    const { name, address, neighborhood, city, zipCode, email, phone, phone2 } =
      formData;

    if (name && address && neighborhood && city && zipCode && email && phone && phone2) {
      const data = {
        idCliente: 0,
        nombre: name.toUpperCase(),
        direccion: address,
        colonia: neighborhood,
        ciudad: city,
        cp: zipCode,
        correo: email,
        telefono: phone,
        telefono2: phone2,
      };

      await AddClient(data);
      navigateToWorker();
    } else {
      Alert.alert("Por favor rellene todos los datos");
    }
  };

  const navigateToWorker = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={styles.title}>Registro de Cliente</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Nombre"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="Dirección"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colonia *</Text>
            <TextInput
              style={styles.input}
              value={formData.neighborhood}
              onChangeText={(value) => handleChange("neighborhood", value)}
              placeholder="Colonia"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(value) => handleChange("city", value)}
              placeholder="Ciudad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código Postal *</Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleChange("zipCode", value)}
              placeholder="Código Postal"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="Correo"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Otro Teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.phone2}
              onChangeText={(value) => handleChange("phone2", value)}
              placeholder="Otro Teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={verifyAllContents}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCancel} onPress={navigateToWorker}>
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
    marginTop: 30
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

export default AddCPage;
