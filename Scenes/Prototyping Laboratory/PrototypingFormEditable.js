import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  getPrototypeById,
  updateProjectSub,
  updateProjectCheck,
} from "../../Modules/Operations DB Prototyping";
import { GetUserData } from "../../Modules/DataInfo";

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

export default function PrototypingFormEdit() {
  const route = useRoute();
  const navigation = useNavigation();

  const { idReport } = route.params || {};
  //Datos del reporte
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [roles, setRoles] = useState({ alumno: false, profesor: false });
  const [studentCode, setStudentCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [application, setApplication] = useState("");
  const [descriptionProject, setDescriptionProject] = useState("");
  const [prototypeType, setPrototypeType] = useState("");
  const [descriptionPrototype, setDescriptionPrototype] = useState("");
  const [specificRequirementsDimensions, setspecificRequirementsDimensions] =
    useState("");
  const [specialCut, setSpecialCut] = useState("");
  const [others, setOthers] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [dataUser, setDataUserType] = useState("");
  //Datos de uso interno
  const [internal_use_pcb_faces, setPcbFaces] = useState(0);
  const [internal_use_pcb_provided_by_user, setProved] = useState(null);
  const [internal_use_required_inputs, setUseRequired] = useState("");
  const [internal_use_comments, setInternalComments] = useState("");
  const [state, setState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getPrototypeById(idReport);
        // Prellenar los campos con la data obtenida
        setName(fetchedData.applicant_name);
        setEmail(fetchedData.contact_email);
        setPhone(fetchedData.contact_phone);
        setProjectType(fetchedData.project_type);
        setRoles({
          alumno: !!fetchedData.student_user_code,
          profesor: !!fetchedData.professor_user_code,
        });
        setStudentCode(fetchedData.student_user_code || "");
        setTeacherCode(fetchedData.professor_user_code || "");
        setApplication(fetchedData.application);
        setDescriptionProject(fetchedData.descriptionProject);
        setPrototypeType(fetchedData.prototype_type);
        setDescriptionPrototype(fetchedData.prototype_description);
        setspecificRequirementsDimensions(
          fetchedData.specific_requirements_dimensions
        );
        setSpecialCut(fetchedData.specific_requirements_special_cut);
        setOthers(fetchedData.specific_requirements_other);
        setRemarks(fetchedData.specific_requirements_comments);
      } catch (error) {
        setError("Error al cargar los datos del prototipo");
      }
    };

    fetchData();
  }, [idReport]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await GetUserData();
        setDataUserType(userData.User_type);
      } catch (error) {
        setError("Error al obtener datos del usuario");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (value) => {
    try {
      const estado = value ? "approved" : "rejected";
      // Crear el objeto base con los datos comunes
      const baseProject = {
        applicant_name: name,
        contact_email: email,
        contact_phone: phone,
        project_type: projectType,
        student_user_code: roles.alumno ? Number(studentCode) : null,
        professor_user_code: roles.profesor ? Number(teacherCode) : null,
        application,
        descriptionProject,
        prototype_type: prototypeType,
        prototype_description: descriptionPrototype,
        specific_requirements_dimensions: specificRequirementsDimensions,
        specific_requirements_special_cut: specialCut,
        specific_requirements_other: others,
        specific_requirements_comments: remarks,
      };

      // Solo agregar los datos del staff si el `dataUser` es 2
      const updatedProject =
        dataUser === 2
          ? {
              ...baseProject,
              internal_use_pcb_faces,
              internal_use_pcb_provided_by_user,
              internal_use_required_inputs,
              internal_use_comments,
              prototype_approved_date: new Date().toISOString().split("T")[0],
              status: estado,
            }
          : baseProject;

      console.log("Project update", updatedProject);

      // Llamar a la API para actualizar el proyecto
      await updateProjectSub(idReport, updatedProject);

      // Confirmación
      Alert.alert("Éxito", "Prototipo actualizado exitosamente.");
      console.log("Estado:", estado);

      // Volver a la pantalla anterior
      navigation.goBack();
    } catch (error) {
      // Mostrar error con detalles del mismo
      console.error("Error al actualizar el prototipo:", error);
      Alert.alert("Error", "Hubo un problema al actualizar el prototipo.");
    }
  };

  const handleSubmit = () => {
    const validationFields = [
      { field: name, message: "Por favor, ingresa tu nombre." },
      { field: email, message: "Por favor, ingresa tu correo electrónico." },
      { field: phone, message: "Por favor, ingresa tu número de teléfono." },
      {
        field: roles.alumno || roles.profesor,
        message: "Por favor, selecciona un rol (Alumno o Profesor).",
      },
      {
        field: roles.alumno && !studentCode,
        message: "Por favor, ingresa el código de alumno.",
      },
      {
        field: roles.profesor && !teacherCode,
        message: "Por favor, ingresa el código de profesor.",
      },
      {
        field: projectType,
        message: "Por favor, selecciona el tipo de proyecto.",
      },
      {
        field: application,
        message: "Por favor, ingresa la aplicación de tu proyecto.",
      },
      {
        field: descriptionProject,
        message: "Por favor, ingresa una descripción del proyecto.",
      },
      {
        field: prototypeType,
        message: "Por favor, selecciona el tipo de prototipo.",
      },
      {
        field: descriptionPrototype,
        message: "Por favor, ingresa una descripción del prototipo.",
      },
      {
        field: specificRequirementsDimensions,
        message: "Por favor, ingresa las dimensiones del prototipo.",
      },
    ];

    // Validación general
    for (const { field, message } of validationFields) {
      if (!field) {
        Alert.alert("Error", message);
        return;
      }
    }

    // Si todas las validaciones pasan, llamar a la función para actualizar el formulario
    handleUpdate(true);
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

  const handleSelectApproved = (value) => {
    // Mensajes de error
    const errorMessages = {
      pcbFaces: "Por favor, selecciona una opción (1 o 2).",
      pcbProvided: "Por favor, selecciona una opción (SI o NO).",
      requiredInputs:
        "Por favor, ingresa los insumos requeridos o escribe (Ninguno).",
      comments: "Por favor, ingresa algún comentario o escribe (Ninguno).",
    };

    // Función auxiliar para validaciones
    const validate = (condition, errorMessage) => {
      if (!condition) {
        Alert.alert("Error", errorMessage);
        return false;
      }
      return true;
    };

    // Validaciones
    if (
      !validate(internal_use_pcb_faces !== null, errorMessages.pcbFaces) ||
      !validate(
        internal_use_pcb_provided_by_user !== null,
        errorMessages.pcbProvided
      ) ||
      !validate(internal_use_required_inputs, errorMessages.requiredInputs) ||
      !validate(internal_use_comments, errorMessages.comments)
    ) {
      return;
    }

    console.log("Valor de state antes de handleUpdate:", value);

    // Acciones finales
    handleUpdate(value);
    UpdateCheck(value);
  };

  const UpdateCheck = async (check) => {
    await updateProjectCheck(idReport, check, dataUser);
  };

  useEffect(() => {
    if (state !== null) {
      handleSelectApproved(state);
    }
  }, [state]);

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Coloca la barra de estado por encima de las ventanas */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
      />
      <View style={styles.backTriangle} />
      <View style={styles.mainTriangle} />
      <Text style={styles.title}>
        Formato de requerimiento de servicio de maquinado de prototipo.
      </Text>
      {/* Seccion 1: Datos de contacto */}
      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos de contacto</Text>
        <Text style={styles.label}>Nombre completo:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
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
      {/* Seccion para llenado de datos del staff */}
      {dataUser === 2 && (
        <View style={styles.formSection}>
          <Text style={styles.titleSection}>Información interna</Text>
          <Text style={styles.label}>Número de caras PCB:</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              label="1"
              value={1}
              selected={internal_use_pcb_faces === 1}
              onSelect={setPcbFaces}
            />
            <RadioButton
              label="2"
              value={2}
              selected={internal_use_pcb_faces === 2}
              onSelect={setPcbFaces}
            />
          </View>
          <Text style={styles.label}>¿PCB proporcionado por el usuario?</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              label="SI"
              value={true}
              selected={internal_use_pcb_provided_by_user === true}
              onSelect={setProved}
            />
            <RadioButton
              label="NO"
              value={false}
              selected={internal_use_pcb_provided_by_user === false}
              onSelect={setProved}
            />
          </View>
          <Text style={styles.label}>Insumos requeridos:</Text>
          <TextInput
            style={styles.input}
            value={internal_use_required_inputs}
            onChangeText={setUseRequired}
          />
          <Text style={styles.label}>Observaciones:</Text>
          <TextInput
            style={styles.input}
            value={internal_use_comments}
            onChangeText={setInternalComments}
          />
        </View>
      )}
      {/* Botónes de envío, aprovacion y rechazo del formulario */}
      {dataUser === 2 ? (
        <View style={styles.approval}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              setState(true); // Acción 1
            }}
          >
            <Text style={styles.submitButtonText}>Aprobar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              setState(false); // Acción 1
            }}
          >
            <Text style={styles.submitButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar</Text>
        </TouchableOpacity>
      )}
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
  approval: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
