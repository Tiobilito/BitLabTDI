import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { addProjectSub } from "../../Modules/OperacionesBD";

const Scale = Dimensions.get("window").width;

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
  );
};

export default function PrototypingForm() {
  const SentProject = async () => {
    try {
      const newProject = {
        submission_date: new Date().toISOString().split("T")[0], // Fecha actual
        applicant_name: name, // Nombre del usuario que solicita el servicio
        contact_email: email, // Email
        contact_phone: phone, // Número de teléfono
        application: application, // Aplicación del proyecto
        student_user_code: Number(studentCode), // Código del alumno
        professor_user_code: Number(teacherCode), // Código del profesor seleccionado
        project_type: projectType, // Tipo de proyecto
        prototype_type: prototypeType, // Tipo de prototipo
        prototype_description: descriptionPrototype, // Descripción del prototipo
        specific_requirements_dimensions: specificRequirementsDimensions, // Dimensiones del prototipo
        specific_requirements_special_cut: specialCut, // Corte específico (Opcional)
        specific_requirements_other: others, // Otros (Opcional)
        specific_requirements_comments: remarks, // Observaciones (Opcional)
        department_head: "awaiting_revision", // Estado pendiente de revisión
        laboratory_head: "awaiting_revision",
        service_staff: "awaiting_revision",
      };

      // Llamada a la función para agregar el proyecto
      await addProjectSub(newProject);

      // Mostrar mensaje de éxito si todo va bien
      Alert.alert("Éxito", "Solicitud enviada exitosamente.");
    } catch (error) {
      // Mostrar mensaje de error si ocurre algún problema
      Alert.alert(
        "Error",
        "Hubo un problema al enviar el formulario. Inténtalo de nuevo."
      );
      console.error("Error al enviar el proyecto:", error);
    }
  };

  /* Datos del contacto */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState({ alumno: false, profesor: false });
  const [studentCode, setStudentCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [application, setApplication] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");

  /* Datos del prototipo */
  const [prototypeType, setPrototypeType] = useState("");
  const [descriptionPrototype, setDescriptionPrototype] = useState({
    impreso: false,
    tresD: false,
  });
  const [specificRequirementsDimensions, setspecificRequirementsDimensions] =
    useState("");
  const [specialCut, setSpecialCut] = useState("");
  const [others, setOthers] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    // Validaciones de los campos de contacto
    if (!name) {
      Alert.alert("Error", "Por favor, ingresa tu nombre.");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa tu correo electrónico.");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Por favor, ingresa tu número de teléfono.");
      return;
    }

    // Validaciones de roles y códigos correspondientes
    if (!roles.alumno && !roles.profesor) {
      Alert.alert("Error", "Por favor, selecciona un rol (Alumno o Profesor).");
      return;
    }
    if (roles.alumno && !studentCode) {
      Alert.alert("Error", "Por favor, ingresa el código de alumno.");
      return;
    }
    if (roles.profesor && !teacherCode) {
      Alert.alert("Error", "Por favor, ingresa el código de profesor.");
      return;
    }

    // Validaciones adicionales
    if (!projectType) {
      Alert.alert("Error", "Por favor, selecciona el tipo de proyecto.");
      return;
    }
    if (!application) {
      Alert.alert("Error", "Por favor, ingresa la aplicación de tu proyecto.");
      return;
    }
    if (!descriptionProject) {
      Alert.alert("Error", "Por favor, ingresa una descripción del proyecto.");
      return;
    }

    // Validaciones del prototipo
    if (!prototypeType) {
      Alert.alert("Error", "Por favor, selecciona el tipo de prototipo.");
      return;
    }
    if (!descriptionPrototype) {
      Alert.alert("Error", "Por favor, ingresa una descripción del prototipo.");
      return;
    }
    if (!specificRequirementsDimensions) {
      Alert.alert("Error", "Por favor, ingresa las dimensiones del prototipo.");
      return;
    }

    // Si todas las validaciones pasan, limpiar errores y enviar el formulario
    //Alert.alert("Éxito", "Formulario enviado exitosamente");
    SentProject();
    // Aquí va la lógica para enviar el formulario
  };

  /* Función para los checkbox */
  const Checkbox = ({ label, checked, onChange }) => {
    return (
      <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  /* Función para elegir el tipo de usuario que solicita el prototipo */
  const handleRoleChange = (role) => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Coloca la barra de estado por encima de las ventanas */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
      />
      <Text style={styles.title}>
        UNIVERSIDAD DE GUADALAJARA - CENTRO UNIVERSITARIO DE CIENCIAS EXACTAS E
        INGENIERIAS
      </Text>
      <Text style={styles.title}>
        DEPARTAMENTO DE ELECTRONICA - LABORATORIO DE ELECTRONICA
      </Text>
      <Text style={styles.titleTwo}>LABORATORIO DE PROTOTIPADO</Text>
      <Text style={styles.titleTwo}>
        Formato de requerimiento de servicio de maquinado de prototipo.
      </Text>
      {/* Seccion 1: Datos de contacto */}
      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos de contacto</Text>
        <Text style={styles.label}>Nombre completo:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
        />
        <Text style={styles.label}>Correo electrónico:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tuemail@ejemplo.com"
        />
        <Text style={styles.label}>Número de Teléfono:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Número de teléfono"
          keyboardType="phone-pad"
          maxLength={10}
        />
        <Text style={styles.sectionSubTitle}>
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
            <Text style={styles.label}>Código de Alumno</Text>
            <TextInput
              style={styles.input}
              value={studentCode}
              onChangeText={setStudentCode}
              placeholder="Código de Alumno"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>
        ) : null}
        {roles.profesor ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Código de Profesor</Text>
            <TextInput
              style={styles.input}
              value={teacherCode}
              onChangeText={setTeacherCode}
              placeholder="Código de Profesor"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>
        ) : null}
        <Text style={styles.labelprojectType}>Proyecto para:</Text>
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
        <Text style={styles.label}>Aplicación:</Text>
        <TextInput
          style={styles.input}
          value={application}
          onChangeText={setApplication}
          placeholder="¿En qué aplicarás tu proyecto?"
        />
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.input}
          value={descriptionProject}
          onChangeText={setDescriptionProject}
          placeholder="Describe tu proyecto"
        />
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>

      {/* Sección 2: Datos del Prototipo */}
      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos del Prototipo</Text>
        <Text style={[styles.label, { fontSize: 18 }]}>
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
        <Text style={styles.label}>Descripción del prototipo:</Text>
        <TextInput
          style={styles.input}
          value={descriptionPrototype}
          onChangeText={setDescriptionPrototype}
          placeholder="Describe tu prototipo"
        />
        <Text style={styles.sectionSubTitle}>
          Requerimientos específicos del Prototipo:
        </Text>
        <Text style={styles.label}>Dimensiones:</Text>
        <TextInput
          style={styles.input}
          value={specificRequirementsDimensions}
          onChangeText={setspecificRequirementsDimensions}
          placeholder="Dime tus dimensiones"
        />
        <Text style={styles.label}>Corte especial:</Text>
        <TextInput
          style={styles.input}
          value={specialCut}
          onChangeText={setSpecialCut}
          placeholder="Dime tu corte especial"
        />
        <Text style={styles.label}>Otros:</Text>
        <TextInput
          style={styles.input}
          value={others}
          onChangeText={setOthers}
          placeholder="Menciona algún otro requerimiento que tengas"
        />
        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={styles.input}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Menciona alguna observación que tengas"
        />
      </View>

      {/* Botón de envío del formulario */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Estilos */
const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    marginLeft: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#394f66",
  },
  titleTwo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#394f66",
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
    color: "#2c3e50",
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
    height: Scale > 400 ? 60 : 40,
    width: "100%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    marginLeft: 0,
    fontSize: Scale > 400 ? 30 : 15,
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
    width: "10%",
    height: Scale * 0.04,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.0,
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
});
