import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { getPrototypeById, updateProjectCheck } from "../../Modules/Operations DB Prototyping";
import { useRoute } from "@react-navigation/native";
import { GetUserData } from "../../Modules/DataInfo";

const Scale = Dimensions.get("window").width;

export default function PrototypingFormReadOnly({ navigation }) {
  const route = useRoute();
  const { idReport } = route.params;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const UpdateCheck = async (Check) => {
    const uData = await GetUserData();
    await updateProjectCheck(idReport, Check, uData.User_type);
    navigation.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getPrototypeById(idReport);
        setData(fetchedData);
      } catch (error) {
        setError("Error al cargar los datos del prototipo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idReport]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#394f66" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const {
    applicant_name,
    contact_email,
    contact_phone,
    application,
    student_user_code,
    professor_user_code,
    project_type,
    prototype_type,
    prototype_description,
    specific_requirements_dimensions,
    specific_requirements_special_cut,
    specific_requirements_other,
    specific_requirements_comments,
  } = data;

  // Verifica el tipo de prototipo y muestra una mejor descripción al usuario
  const getPrototypeDisplayName = (prototypeType) => {
    switch (prototypeType) {
      case "impreso":
        return "Diseño de tipo impreso";
      case "tresD":
        return "Diseño de prototipo en 3D";
      default:
        return "Diseño desconocido";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
      />
      <View style={styles.backTriangle} />
      <View style={styles.mainTriangle} />
      <Text style={styles.title}>
        Detalles de la solicitud de servicio de prototipo
      </Text>

      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos de contacto</Text>
        <Text style={styles.label}>Nombre completo:</Text>
        <Text style={styles.value}>{applicant_name}</Text>
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.value}>{contact_email}</Text>
        <Text style={styles.label}>Número de Teléfono:</Text>
        <Text style={styles.value}>{contact_phone}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Información del Proyecto</Text>
        <Text style={styles.label}>Tipo de proyecto:</Text>
        <Text style={styles.value}>{project_type}</Text>
        <Text style={styles.label}>Aplicación:</Text>
        <Text style={styles.value}>{application}</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Detalles del Usuario</Text>
        {student_user_code && (
          <>
            <Text style={styles.label}>Código de Alumno:</Text>
            <Text style={styles.value}>{student_user_code}</Text>
          </>
        )}
        {professor_user_code && (
          <>
            <Text style={styles.label}>Código de Profesor:</Text>
            <Text style={styles.value}>{professor_user_code}</Text>
          </>
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos del Prototipo</Text>
        <Text style={styles.label}>Tipo de Prototipo:</Text>
        <Text style={styles.value}>
          {getPrototypeDisplayName(prototype_type)}
        </Text>
        <Text style={styles.label}>Descripción del Prototipo:</Text>
        <Text style={styles.value}>{prototype_description}</Text>
        <Text style={styles.label}>Dimensiones:</Text>
        <Text style={styles.value}>{specific_requirements_dimensions}</Text>
        <Text style={styles.label}>Corte especial:</Text>
        <Text style={styles.value}>
          {specific_requirements_special_cut || "No especificado"}
        </Text>
        <Text style={styles.label}>Otros:</Text>
        <Text style={styles.value}>
          {specific_requirements_other || "No especificado"}
        </Text>
        <Text style={styles.label}>Observaciones:</Text>
        <Text style={styles.value}>
          {specific_requirements_comments || "Sin comentarios adicionales"}
        </Text>
      </View>

      {/* Botones para aprobar o rechazar la solicitud*/}
      <View style={styles.approval}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => UpdateCheck(true)}
        >
          <Text style={styles.submitButtonText}>Aprobar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => UpdateCheck(false)}
        >
          <Text style={styles.submitButtonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#394f66",
  },
  formSection: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  titleSection: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#394f66",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#394f66",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  mainTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 450,
    borderRightWidth: 280,
    borderBottomWidth: 280,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#328EC5",
    transform: [{ rotate: "30deg" }],
    marginTop: "-70%",
    marginBottom: "10%",
    marginRight: "-30%",
  },
  backTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 350,
    borderRightWidth: 200,
    borderBottomWidth: 250,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#57A9D9",
    transform: [{ rotate: "95deg" }],
    marginTop: "-40%",
    marginBottom: "5%",
    marginLeft: "-70%",
  },
  submitButton: {
    width: Scale * 0.25,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.0,
    marginRight: 10,
  },

  submitButtonText: {
    color: "white",
    fontSize: 18,
  },
  approval: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
