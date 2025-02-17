import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native"
import { addProjectSub } from "../../Modules/Operations DB Prototyping"
import { CustomView } from "../components/CustomView"
import { CustomButton, FloatingInput } from "../../components"
import { mainStyles } from "../../components/styles"
import { useRoute, useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

// Componente personalizado de RadioButton
const RadioButton = ({ label, value, selected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      style={styles.radioButtonContainer}
    >
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      />
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

export default function PrototypingForm() {
  const navigation = useNavigation()
  const SentProject = async () => {
    try {
      // Asignar null al rol no seleccionado
      const finalStudentCode = roles.alumno ? Number(studentCode) : null
      const finalTeacherCode = roles.profesor ? Number(teacherCode) : null

      const newProject = {
        submission_date: new Date().toISOString().split("T")[0], // Fecha actual
        applicant_name: name, // Nombre del usuario que solicita el servicio
        contact_email: email, // Email
        contact_phone: phone, // Número de teléfono
        application: application, // Aplicación del proyecto
        student_user_code: finalStudentCode, // Código del alumno (o null)
        professor_user_code: finalTeacherCode, // Código del profesor (o null)
        project_type: projectType, // Tipo de proyecto
        prototype_type: prototypeType, // Tipo de prototipo
        prototype_description: descriptionPrototype, // Descripción del prototipo
        specific_requirements_dimensions: specificRequirementsDimensions, // Dimensiones del prototipo
        specific_requirements_special_cut: specialCut, // Corte específico (Opcional)
        specific_requirements_other: others, // Otros (Opcional)
        specific_requirements_comments: remarks, // Observaciones (Opcional)
        department_head: null, // Estado pendiente de revisión
        laboratory_head: null,
        service_staff: null,
        status: "awaiting_revision",
      }

      // Llamada a la función para agregar el proyecto
      await addProjectSub(newProject)

      // Mostrar mensaje de éxito si todo va bien
      Alert.alert("Éxito", "Solicitud enviada exitosamente.")
    } catch (error) {
      // Mostrar mensaje de error si ocurre algún problema
      Alert.alert(
        "Error",
        "Hubo un problema al enviar el formulario. Inténtalo de nuevo."
      )
      console.error("Error al enviar el proyecto:", error)
    }
  }

  /* Datos del contacto */
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState("")
  const [phone, setPhone] = useState("")
  const [projectType, setProjectType] = useState("")
  const [error, setError] = useState("")
  const [roles, setRoles] = useState({ alumno: false, profesor: false })
  const [studentCode, setStudentCode] = useState("")
  const [teacherCode, setTeacherCode] = useState("")
  const [application, setApplication] = useState("")
  const [descriptionProject, setDescriptionProject] = useState("")

  /* Datos del prototipo */
  const [prototypeType, setPrototypeType] = useState("")
  const [descriptionPrototype, setDescriptionPrototype] = useState({
    impreso: false,
    tresD: false,
  })
  const [specificRequirementsDimensions, setspecificRequirementsDimensions] =
    useState("")
  const [specialCut, setSpecialCut] = useState("")
  const [others, setOthers] = useState("")
  const [remarks, setRemarks] = useState("")

  const handleSubmit = () => {
    // Validaciones de los campos de contacto
    if (!name) {
      Alert.alert("Error", "Por favor, ingresa tu nombre.")
      return
    }
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico.")
      return
    }
    if (!phone) {
      Alert.alert("Error", "Por favor, ingresa tu número de teléfono.")
      return
    }

    // Validaciones de roles y códigos correspondientes
    if (!roles.alumno && !roles.profesor) {
      Alert.alert("Error", "Por favor, selecciona un rol (Alumno o Profesor).")
      return
    }
    if (roles.alumno && !studentCode) {
      Alert.alert("Error", "Por favor, ingresa el código de alumno.")
      return
    }
    if (roles.profesor && !teacherCode) {
      Alert.alert("Error", "Por favor, ingresa el código de profesor.")
      return
    }

    // Validaciones adicionales
    if (!projectType) {
      Alert.alert("Error", "Por favor, selecciona el tipo de proyecto.")
      return
    }
    if (!application) {
      Alert.alert("Error", "Por favor, ingresa la aplicación de tu proyecto.")
      return
    }
    if (!descriptionProject) {
      Alert.alert("Error", "Por favor, ingresa una descripción del proyecto.")
      return
    }

    // Validaciones del prototipo
    if (!prototypeType) {
      Alert.alert("Error", "Por favor, selecciona el tipo de prototipo.")
      return
    }
    if (!descriptionPrototype) {
      Alert.alert("Error", "Por favor, ingresa una descripción del prototipo.")
      return
    }
    if (!specificRequirementsDimensions) {
      Alert.alert("Error", "Por favor, ingresa las dimensiones del prototipo.")
      return
    }

    // Si todas las validaciones pasan, limpiar errores y enviar el formulario
    //Alert.alert("Éxito", "Formulario enviado exitosamente");
    SentProject()
    // Aquí va la lógica para enviar el formulario
  }

  /* Función para los checkbox */
  const Checkbox = ({ label, checked, onChange }) => {
    return (
      <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    )
  }

  /* Función para elegir el tipo de usuario que solicita el prototipo */
  const handleRoleChange = (role) => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }))
  }

  return (
    <View style={styles.container}>
      {/* Coloca la barra de estado por encima de las ventanas */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
      />
      <CustomView>
        <View style={styles.scrollContainer}>
          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* <View style={styles.backTriangle} />
      <View style={styles.mainTriangle} /> */}
            <Text style={styles.title}>
              Formato de requerimiento de servicio de maquinado de prototipo
            </Text>

            {/* Seccion 1: Datos de contacto */}
            <View style={styles.formSection}>
              <Text style={styles.titleSection}>Datos de contacto</Text>
              <FloatingInput
                label="Nombre completo"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
              />
              <FloatingInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="tuemail@dominio"
              />
              <FloatingInput
                label="Número de Teléfono"
                value={phone}
                onChangeText={setPhone}
                placeholder="Número de teléfono"
                keyboardType="phone-pad"
                maxLength={10}
              />
              <Text style={mainStyles.title}>
                Usuario(s) que solicita(n) el servicio:
              </Text>
              <View style={styles.checkboxGroup}>
                <Checkbox
                  label="Alumno"
                  checked={roles.alumno}
                  onChange={() => handleRoleChange("alumno")}
                />
                <Checkbox
                  label="Profesor"
                  checked={roles.profesor}
                  onChange={() => handleRoleChange("profesor")}
                />
              </View>

              {/* Función para desplegar los inputs del checkbox seleccionado para el tipo de usuario */}
              {roles.alumno ? (
                <View style={styles.formGroup}>
                  <FloatingInput
                    label="Código de Alumno"
                    value={studentCode}
                    onChangeText={setStudentCode}
                    placeholder="xxxxxxxxx"
                    keyboardType="phone-pad"
                    maxLength={9}
                  />
                </View>
              ) : null}
              {roles.profesor ? (
                <FloatingInput
                  label="Código de Profesor"
                  value={teacherCode}
                  onChangeText={setTeacherCode}
                  placeholder="xxxxxxxxx"
                  keyboardType="phone-pad"
                  maxLength={9}
                />
              ) : null}
              <Text style={mainStyles.title}>Proyecto para:</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Licenciatura"
                  value="Licenciatura"
                  selected={projectType === "Licenciatura"}
                  onSelect={setProjectType}
                />
                <RadioButton
                  label="Posgrado"
                  value="Posgrado"
                  selected={projectType === "Posgrado"}
                  onSelect={setProjectType}
                />
                <RadioButton
                  label="Cuerpo Academico"
                  value="Cuerpo Academico"
                  selected={projectType === "Cuerpo Academico"}
                  onSelect={setProjectType}
                />
              </View>
              <FloatingInput
                label="Aplicación"
                value={application}
                onChangeText={setApplication}
                placeholder="¿En qué aplicarás tu proyecto?"
              />
              <FloatingInput
                label="Descripción"
                value={descriptionProject}
                onChangeText={setDescriptionProject}
                placeholder="Describe tu proyecto"
                multiline={true}
              />
              {error && <Text style={styles.errorMessage}>{error}</Text>}
            </View>

            {/* Sección 2: Datos del Prototipo */}
            <View style={styles.formSection}>
              <Text style={styles.titleSection}>Datos del Prototipo</Text>
              <Text style={mainStyles.title}>
                Selecciona el tipo de prototipo:
              </Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Diseño de circuito impreso"
                  value="impreso"
                  selected={prototypeType === "impreso"}
                  onSelect={setPrototypeType}
                />
                <RadioButton
                  label="Diseño de prototipo en 3D"
                  value="tresD"
                  selected={prototypeType === "tresD"}
                  onSelect={setPrototypeType}
                />
              </View>
              <FloatingInput
                label="Descripción del prototipo"
                value={descriptionPrototype}
                onChangeText={setDescriptionPrototype}
                placeholder="Describe tu prototipo"
                multiline={true}
              />
              <Text style={[mainStyles.title, { marginTop: 20 }]}>
                Requerimientos específicos del Prototipo:
              </Text>
              <FloatingInput
                label="Dimensiones"
                value={specificRequirementsDimensions}
                onChangeText={setspecificRequirementsDimensions}
                placeholder="200x100x50"
              />
              <FloatingInput
                label="Corte especial"
                value={specialCut}
                onChangeText={setSpecialCut}
                placeholder="¿Se necesita algún corte especial?"
              />
              <FloatingInput
                label="Otros requisitos"
                value={others}
                onChangeText={setOthers}
                placeholder="Requisitos específicos"
                multiline={true}
              />
              <FloatingInput
                label="Observaciones"
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Comentarios sobre el prototipo"
                multiline={true}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Cancelar"
                onPress={() => navigation.goBack()}
                buttonStyles={{
                  width: width * 0.32,
                  backgroundColor: "#DC3545",
                }}
              />
              {/* Botón de envío del formulario */}
              <CustomButton
                title="Enviar"
                onPress={handleSubmit}
                buttonStyles={{
                  width: width * 0.32,
                  backgroundColor: "#007BFF",
                }}
              />
            </View>
            {/* <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </View>
      </CustomView>
    </View>
  )
}

/* Estilos */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 200,
    overflow: "hidden",
    width: "95%",
  },
  formContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    // backgroundColor: "#F5F5F5",
    // borderTopEndRadius: 200,
    // borderTopLeftRadius: 200,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#394f66",
    padding: width * 0.04,
  },
  titleSection: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#394f66",
    textAlign: "center",
  },
  formSection: {
    width: "100%",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionSubTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2C3E50",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#2c3e50",
  },
  labelprojectType: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 15,
    color: "#2c3e50",
  },
  input: {
    height: width > 400 ? 60 : 40,
    // width: "100%",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    marginLeft: 0,
    // fontSize: width > 400 ? 30 : 15,
    fontSize: width * 0.04,
  },
  radioGroup: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  radioGroupImpreso: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#394f66",
    marginRight: 10,
    marginBottom: 15,
  },
  radioButtonSelected: {
    backgroundColor: "#C5E0F2",
  },
  radioButtonLabel: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 15,
  },
  submitButton: {
    width: width * 0.25,
    height: width * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    // marginBottom: width * 0.0,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
  checkboxGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#394f66",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#C5E0F2",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#2c3e50",
  },
  formGroup: {
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.05,
    marginLeft: 10,
  },
})
