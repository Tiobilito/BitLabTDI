import React, { useState, useEffect } from "react";
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
import { getUserById, updateUser } from "../../Modules/Operations DB Users";

const EditClientPage = ({ navigation }) => {
  const route = useRoute();
  const { idClient } = route.params;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    zipCode: "",
    email: "",
    phone: "",
    phone2: "",
  });

  useEffect(() => {
    getClientData();
  }, []);

  const getClientData = async () => {
    const item = await getUserById(idClient);
    if (item) {
      setFormData({
        name: item.name,
        address: item.address,
        zipCode: item.zip_code,
        email: item.email,
        phone: item.number,
        phone2: item.second_number,
      });
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAndSendData = () => {
    const { name, address, zipCode, email, phone, phone2 } = formData;

    if (
      name.trim() !== "" &&
      address.trim() !== "" &&
      zipCode.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== ""
    ) {
      sendData();
    } else {
      Alert.alert("Por favor rellene todos los datos correctamente");
    }
  };

  const sendData = async () => {
    const updatedData = {
      name: formData.name,
      address: formData.address,
      zip_code: formData.zipCode,
      email: formData.email,
      number: formData.phone,
      second_number: formData.phone2,
    };

    await updateUser(idClient, updatedData);
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={styles.title}>Editar Usuario</Text>

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
            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="Correo"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono *</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#095ea7",
    marginTop: 30,
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

export default EditClientPage;
