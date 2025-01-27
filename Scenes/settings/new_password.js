import React, { useState } from "react";
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

export default function UpdatePassword() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = () => {
    if (form.newPassword !== form.confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    // Aquí puedes agregar la lógica para actualizar la contraseña en el servidor
    console.log("Contraseña actualizada:", form);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FeatherIcon color="#000" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Actualizar Contraseña
        </Text>

        <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
          <TouchableOpacity
            onPress={() => {
              // handle additional options
            }}
          >
            <FeatherIcon color="#000" name="more-vertical" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar contraseña</Text>

          <View style={styles.sectionBody}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your current password"
                value={form.currentPassword}
                onChangeText={(currentPassword) =>
                  setForm({ ...form, currentPassword })
                }
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your new password"
                value={form.newPassword}
                onChangeText={(newPassword) =>
                  setForm({ ...form, newPassword })
                }
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Confirma tu nueva contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your new password"
                value={form.confirmPassword}
                onChangeText={(confirmPassword) =>
                  setForm({ ...form, confirmPassword })
                }
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.buttonText}>Update Password</Text>
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
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 16,
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
