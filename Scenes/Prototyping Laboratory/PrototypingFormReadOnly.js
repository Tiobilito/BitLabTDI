import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import {
  getPrototypeById,
  updateProjectCheck,
  updateProjectStatus,
} from "../../Modules/Operations DB Prototyping"
import { useRoute } from "@react-navigation/native"
import { GetUserData } from "../../Modules/DataInfo"
import { CustomView } from "../components/CustomView"
import { CustomButton, OpenDrive, SwapButton } from "../../components"
import { Feather } from "@expo/vector-icons"
import { scale } from "react-native-size-matters"
import * as Clipboard from "expo-clipboard"
import Toast from "react-native-toast-message"

const { width, height } = Dimensions.get("window")

export default function PrototypingFormReadOnly({ navigation }) {
  const route = useRoute()
  const { idReport } = route.params
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userType, setUserType] = useState(null)

  const updateCheck = async (Check) => {
    await updateProjectCheck(idReport, Check, userType)
    navigation.goBack()
  }

  const updateStatus = async () => {
    const status = data.status === "approved" ? "finished" : "approved"

    if (await updateProjectStatus(idReport, status)) {
      setData(prev => ({
        ...prev,
        status: status
      }))
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error al cambiar el estado",
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      const userData = await GetUserData()
      setUserType(userData.User_type)
    }
    init()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getPrototypeById(idReport)
        setData(fetchedData)
        console.log("fetchedData -> ", fetchedData);
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
        <ActivityIndicator size="large" color="#095EA7" />
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
    prototype_description,
    prototype_type,
    internal_use_pcb_faces,
    specific_requirements_dimensions,
    specific_requirements_special_cut,
    specific_requirements_other,
    specific_requirements_comments,
    drive_url,
  } = data

  const copyOnClipboard = async () => {
    await Clipboard.setStringAsync(drive_url)
    Toast.show({
      type: "info",
      text1: "URL copiado al portapapeles!",
      position: "bottom",
      visibilityTime: 1200,
    })
  }

  const dictionary = {
    "approved": "Aprobado",
    "rejected": "Rechazado",
    "awaiting_revision": "Esperando revisión",
    "finished": "Terminado"
  }

  return (
    <View style={styles.container}>
      <CustomView>
        <View style={styles.scrollContainer}>
          <View style={styles.blured}/>
          <ScrollView contentContainerStyle={styles.formContainer}>
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
              <Text style={styles.label}>Estado:</Text>
              <View style={styles.approval}>
                <CustomButton
                  title={dictionary[data.status]}
                  buttonStyles={{
                    width: width * 0.4,
                    backgroundColor:
                      data.status === "approved" ? "#10B981" :
                      data.status === "finished" ? "#6B7280" :
                      data.status === "awaiting_revision" ? "#F59E0B" :
                      "#EF4444"
                  }}
                  disabled={true}
                />
                {((data.status === "approved" || data.status === "finished") && userType === 2) && (
                  <SwapButton onPress={updateStatus} />
                )}
              </View>
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
              <Text style={styles.label}>Descripción del Prototipo:</Text>
              <Text style={styles.value}>{prototype_description}</Text>
              <Text style={styles.label}>Tipo de prototipo:</Text>
              <Text style={styles.value}>{
                prototype_type === 1 ? "Diseño de circuito impreso de alto detalle"
                : prototype_type === 2 ? "Diseño de circuito impreso"
                : "No asignado"}
              </Text>
              <Text style={styles.label}>Caras del PCB:</Text>
              <Text style={styles.value}>{internal_use_pcb_faces}</Text>
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
              <Text style={styles.label}>Carpeta de archivos:</Text>
              <View style={styles.approval}>
                <OpenDrive link={drive_url} buttonStyle={{width: "100%"}}/>
                <TouchableOpacity style={styles.copyButton} onPress={copyOnClipboard}>
                  <Feather name="copy" size={30} color="#2272A7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botones para aprobar o rechazar la solicitud*/}
            <View style={[styles.approval, { marginLeft: 10 }]}>
              <CustomButton
                title={"Rechazar"}
                onPress={() => updateCheck(false)}
                buttonStyles={{ backgroundColor: "#DC3545", width: width * 0.4 }}
              />
              <CustomButton
                title={" Aprobar "}
                onPress={() => updateCheck(true)}
                buttonStyles={{ width: width * 0.4, backgroundColor: "#007BFF" }}
              />
            </View>
          </ScrollView>
          <Toast />
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
  blured: {

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
    backgroundColor: "#FFF",
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
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#F00",
  },
  approval: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
  },
  url: {
    textDecorationLine: "underline",
    color: '#00F',
  },
  copyButton: {
    padding: scale(6),
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#2272A7"
  }
})
