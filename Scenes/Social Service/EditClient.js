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
import { getUserById, updateUser } from "../../Modules/Operations DB Users";
import { CustomView } from "../components/CustomView";

const Scale = Dimensions.get("window").width;

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
    const { name } = formData;
  
    if (name.trim() !== "") {
      sendData();
    } else {
      Alert.alert("Por favor rellene el nombre correctamente");
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
    <CustomView>
      <ScrollView style={styles.Scroll}>
        <View style={styles.formCont}>
          <Text style={styles.title}>Editar Usuario</Text>

          <View style={styles.container}>
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
            <Text style={styles.label}>Dirección </Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="Dirección"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código Postal </Text>
            <TextInput
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(value) => handleChange("zipCode", value)}
              placeholder="Código Postal"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico </Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="Correo"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono </Text>
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
    height: "72%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10, // Añadido padding
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

export default EditClientPage;