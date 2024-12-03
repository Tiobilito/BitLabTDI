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
import { addUser } from "../../Modules/Operations DB Users";

const AddCPage = ({ navigation }) => {
  const [formData, setFormData] = useState({
    code: "",     // Campo para el código definido por el usuario
    name: "",
    address: "",
    zipCode: "",
    email: "",
    phone: "",
    phone2: "",
    password: "",  // Campo para la contraseña
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAllContents = async () => {
    const { code, name, address, zipCode, email, phone, phone2, password } = formData;

    // Verificación básica de los campos obligatorios
    if (code && name && address && zipCode && email && phone && password) {
      const data = {
        code: parseInt(code),  // Aseguramos que el código sea un número entero
        name: name.toUpperCase(),
        address: address,
        zip_code: zipCode,
        email: email,
        number: phone,
        second_number: phone2,
        password: password,  // Agregar la contraseña
      };

      await addUser(data);
      navigateToSocialService();
    } else {
      Alert.alert("Por favor rellene todos los datos obligatorios");
    }
  };

  const navigateToSocialService = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={{ margin: 20 }}>
          <Text style={styles.title}>Registro de Usuario</Text>

          {/* Campo para el código */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código *</Text>
            <TextInput
              style={styles.input}
              value={formData.code}
              onChangeText={(value) => handleChange("code", value)}
              placeholder="Código"
              keyboardType="numeric"  // Asegura que solo se ingresen números
            />
          </View>

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
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="Dirección"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código Postal</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña *</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              placeholder="Contraseña"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={verifyAllContents}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCancel} onPress={navigateToSocialService}>
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
