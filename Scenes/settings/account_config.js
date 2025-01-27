import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { GetUserData } from "../../Modules/DataInfo";
import { getAllDepartamentos } from "../../Modules/Operations DB Generals";
import { getUserById, updateUser } from "../../Modules/Operations DB Users";

export default function UpdateAccount() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    codeU: "",
    nss: "",
    rfc: "",
    salary: "",
    departmentID: "",
  });

  const [departments, setDepartments] = useState([]);
  const [userType, setUserType] = useState(null);

  // Cargar los datos de usuario y departamentos
  useEffect(() => {
    const loadData = async () => {
      const userData = await GetUserData();
      const user = await getUserById(userData.Code);
      const departmentData = await getAllDepartamentos();
      console.log(userData.Code);
      console.log(user.code);
      if (user) {
        setUserType(user.user_type);
        setForm({
          name: user.name,
          email: user.email,
          phone: user.number,
          address: user.address,
          codeU: user.code,
          nss: user.nss,
          rfc: user.rfc,
          salary: user.salary,
          departmentID: user.department_id,
        });
      }

      if (departmentData) {
        setDepartments(departmentData);
      }
    };

    loadData();
  }, []);

  // Manejar actualización de datos
  const handleUpdate = () => {
    try {
      const updatedAccount = {
        name: form.name,
        address: form.address,
        zip_code: form.zip_code,
        email: form.email,
        //nss: updatedUser.nss,
        //rfc: updatedUser.rfc,
        number: form.phone,
        //second_number: updatedUser.second_number,
        //salary: parseInt(updatedUser.salary, 10),
        //password: updatedUser.password,
        //department_id: updatedUser.department_id,
      };

      updateUser(form.codeU, updatedAccount);
      Alert.alert("Éxito", "Prototipo actualizado exitosamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el prototipo.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerAction}
        >
          <FeatherIcon color="#000" name="arrow-left" size={24} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Actualizar datos de cuenta
        </Text>

        <TouchableOpacity
          style={[styles.headerAction, { alignItems: "flex-end" }]}
        >
          <FeatherIcon color="#000" name="more-vertical" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.sectionBody}>
            {[
              {
                label: "Nombre",
                value: form.name,
                onChange: (name) => setForm({ ...form, name }),
              },
              {
                label: "Email",
                value: form.email,
                onChange: (email) => setForm({ ...form, email }),
                keyboardType: "email-address",
              },
              {
                label: "Teléfono",
                value: form.phone,
                onChange: (phone) => setForm({ ...form, phone }),
                keyboardType: "phone-pad",
              },
              {
                label: "Código",
                value: form.codeU,
                onChange: (codeU) => setForm({ ...form, codeU }),
                keyboardType: "numeric",
              },
              {
                label: "Dirección (Opcional)",
                value: form.address,
                onChange: (address) => setForm({ ...form, address }),
              },
            ].map(({ label, value, onChange, keyboardType }) => (
              <View style={styles.inputWrapper} key={label}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Ingresa tu ${label.toLowerCase()}`}
                  value={value}
                  onChangeText={onChange}
                  keyboardType={keyboardType}
                />
              </View>
            ))}

            {/* Condicional para NSS, RFC, y Salario */}
            {userType === 2 && (
              <>
                {[
                  {
                    label: "NSS",
                    value: form.nss,
                    onChange: (nss) => setForm({ ...form, nss }),
                  },
                  {
                    label: "RFC",
                    value: form.rfc,
                    onChange: (rfc) => setForm({ ...form, rfc }),
                  },
                  {
                    label: "Salario",
                    value: form.salary,
                    onChange: (salary) => setForm({ ...form, salary }),
                    keyboardType: "numeric",
                  },
                ].map(({ label, value, onChange }) => (
                  <View style={styles.inputWrapper} key={label}>
                    <Text style={styles.inputLabel}>{label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`Ingresa tu ${label.toLowerCase()}`}
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                ))}
              </>
            )}

            {/* Mostrar nombre del departamento */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Departamento</Text>
              <TextInput
                style={styles.input}
                placeholder="Departamento"
                value={
                  departments.find((dep) => dep.id === form.departmentID)?.name
                }
                editable={false}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    flexGrow: 1,
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    color: "#a69f9f",
    textTransform: "uppercase",
  },
  sectionBody: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
