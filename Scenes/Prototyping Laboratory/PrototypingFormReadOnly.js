import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import {
  getPrototypeById,
  updateProjectCheck,
} from "../../Modules/Operations DB Prototyping"
import { useRoute } from "@react-navigation/native"
import { GetUserData } from "../../Modules/DataInfo"
import { CustomView } from "../components/CustomView"
import { CustomButton } from "../../components"

const { width, height } = Dimensions.get("window")
// const width = Dimensions.get("window").width

export default function PrototypingFormReadOnly({ navigation }) {
  const route = useRoute()
  const { idReport } = route.params
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const UpdateCheck = async (Check) => {
    const uData = await GetUserData()
    await updateProjectCheck(idReport, Check, uData.User_type)
    navigation.goBack()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getPrototypeById(idReport)
        setData(fetchedData)
      } catch (error) {
        setError("Error al cargar los datos del prototipo")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [idReport])

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#394F66" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!data) {
    return null
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
  } = data

  // Verifica el tipo de prototipo y muestra una mejor descripción al usuario
  const getPrototypeDisplayName = (prototypeType) => {
    switch (prototypeType) {
      case "impreso":
        return "Diseño de tipo impreso"
      case "tresD":
        return "Diseño de prototipo en 3D"
      default:
        return "Diseño desconocido"
    }
  }

  return (
    <View style={styles.container}>
      <CustomView>
        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <StatusBar
              barStyle="light-content"
              backgroundColor="black"
              translucent={true}
            />
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
              <Text style={styles.value}>
                {specific_requirements_dimensions}
              </Text>
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
                {specific_requirements_comments ||
                  "Sin comentarios adicionales"}
              </Text>
            </View>

            {/* Botones para aprobar o rechazar la solicitud*/}
            <View style={styles.approval}>
              <CustomButton
                title={"Rechazar"}
                onPress={() => UpdateCheck(false)}
                buttonStyles={{ backgroundColor: "#DC3545", width: width * 0.4 }}
              />
              <CustomButton
                title={" Aprobar "}
                onPress={() => UpdateCheck(true)}
                buttonStyles={{ width: width * 0.4, backgroundColor: "#007BFF" }}
              />
            </View>
          </ScrollView>
        </View>
      </CustomView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 200,
  },
  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    // fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#394F66",
    padding: width * 0.08,
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
    color: "#394F66",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#394F66",
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
  approval: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
})
