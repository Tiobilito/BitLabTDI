import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { addProjectSub } from "../../Modules/Operations DB Prototyping";

const Scale = Dimensions.get("window").width;

// Componente personalizado de RadioButton
const RadioButton = ({ label, value, selected, onSelect }) => (
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

const Checkbox = ({ label, value, selected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(value)}
    style={styles.checkboxContainer}
  >
    <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function PrototypingForm() {
  const [formData, setFormData] = useState({
    applicant_name: "",
    contact_email: "",
    contact_phone: "",
    student_user_code: "",
    professor_user_code: "",
    project_type: "",
    application: "",
    prototype_type: "",
    prototype_description: "",
    specific_requirements_dimensions: "",
    specific_requirements_special_cut: "",
    specific_requirements_other: "",
    specific_requirements_comments: "",
    roles: { alumno: false, profesor: false },
  });
  const [showStudent, SetShowStudent] = useState(false);
  const [showTeacher, SetShowTeacher] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    // Validación simplificada para todos los campos obligatorios
    const requiredFields = [
      "applicant_name",
      "contact_email",
      "contact_phone",
      "student_user_code",
      "professor_user_code",
      "project_type",
      "application",
      "prototype_type",
      "prototype_description",
      "specific_requirements_dimensions",
      "specific_requirements_special_cut",
      "specific_requirements_other",
      "specific_requirements_comments",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        Alert.alert(
          "Error",
          "Por favor, completa todos los campos obligatorios."
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      const projectData = {
        applicant_name: formData.applicant_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        student_user_code: showStudent
          ? parseInt(formData.student_user_code, 10)
          : null,
        professor_user_code: showTeacher
          ? parseInt(formData.professor_user_code, 10)
          : null,
        project_type: formData.project_type,
        application: formData.application,
        prototype_type: formData.prototype_type,
        prototype_description: formData.prototype_description,
        specific_requirements_dimensions:
          formData.specific_requirements_dimensions,
        specific_requirements_special_cut:
          formData.specific_requirements_special_cut,
        specific_requirements_other: formData.specific_requirements_other,
        specific_requirements_comments: formData.specific_requirements_comments,
        submission_date: new Date().toISOString().split("T")[0],
      };
      await addProjectSub(projectData);
      Alert.alert("Éxito", "Formulario enviado exitosamente.");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert(
        "Error",
        "No se pudo enviar el formulario. Inténtalo de nuevo."
      );
    }
  };

  const formSections = [
    {
      title: "Datos de Contacto",
      fields: [
        {
          key: "name",
          label: "Nombre completo:",
          value: formData.applicant_name,
          placeholder: "Ingresa tu nombre",
          onChange: (text) => handleInputChange("applicant_name", text),
        },
        {
          key: "email",
          label: "Correo electrónico:",
          value: formData.contact_email,
          placeholder: "tuemail@ejemplo.com",
          onChange: (text) => handleInputChange("contact_email", text),
        },
        {
          key: "phone",
          label: "Número de Teléfono:",
          value: formData.contact_phone,
          placeholder: "Número de teléfono",
          onChange: (text) => handleInputChange("contact_phone", text),
        },
        {
          label: "Selecciona los códigos",
          renderCustom: (
            <View>
              <View style={styles.checkboxGroup}>
                {/* Checkbox para Alumno */}
                <Checkbox
                  label="Alumno"
                  value="Alumno"
                  selected={showStudent}
                  onSelect={() => SetShowStudent(!showStudent)}
                />
                {/* Checkbox para Profesor */}
                <Checkbox
                  label="Profesor"
                  value="Profesor"
                  selected={showTeacher}
                  onSelect={() => SetShowTeacher(!showTeacher)}
                />
              </View>
              {/* Input de código de alumno si está seleccionado */}
              {showStudent && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Código de Alumno:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.student_user_code}
                    placeholder="Ingresa código del alumno"
                    onChangeText={(text) =>
                      handleInputChange("student_user_code", text)
                    }
                  />
                </View>
              )}
              {/* Input de código de profesor si está seleccionado */}
              {showTeacher && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Código de Profesor:</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.professor_user_code}
                    placeholder="Ingresa código del profesor"
                    onChangeText={(text) =>
                      handleInputChange("professor_user_code", text)
                    }
                  />
                </View>
              )}
            </View>
          ),
        },
      ],
    },
    {
      title: "Datos del Proyecto",
      fields: [
        {
          key: "projectType",
          label: "Proyecto para:",
          renderCustom: (
            <View style={styles.radioGroup}>
              <RadioButton
                label="Licenciatura"
                value="Licenciatura"
                selected={formData.project_type === "Licenciatura"}
                onSelect={() =>
                  handleInputChange("project_type", "Licenciatura")
                }
              />
              <RadioButton
                label="Posgrado"
                value="Posgrado"
                selected={formData.project_type === "Posgrado"}
                onSelect={() => handleInputChange("project_type", "Posgrado")}
              />
              <RadioButton
                label="Cuerpo Academico"
                value="Cuerpo Academico"
                selected={formData.project_type === "Cuerpo Academico"}
                onSelect={() =>
                  handleInputChange("project_type", "Cuerpo Academico")
                }
              />
            </View>
          ),
        },
        {
          key: "application",
          label: "Aplicación:",
          value: formData.application,
          placeholder: "¿En qué aplicarás tu proyecto?",
          onChange: (text) => handleInputChange("application", text),
        },
        {
          key: "prototype_description",
          label: "Descripción:",
          value: formData.prototype_description,
          placeholder: "Describe tu proyecto",
          onChange: (text) => handleInputChange("prototype_description", text),
        },
      ],
    },
    {
      title: "Datos del Prototipo",
      fields: [
        {
          key: "prototype_type",
          label: "Tipo de prototipo:",
          renderCustom: (
            <View style={styles.radioGroup}>
              <RadioButton
                label="Diseño de circuito impreso"
                value="Diseño de circuito impreso"
                selected={
                  formData.prototype_type === "Diseño de circuito impreso"
                }
                onSelect={() =>
                  handleInputChange(
                    "prototype_type",
                    "Diseño de circuito impreso"
                  )
                }
              />
              <RadioButton
                label="Diseño de prototipo en 3D"
                value="Diseño de prototipo en 3D"
                selected={
                  formData.prototype_type === "Diseño de prototipo en 3D"
                }
                onSelect={() =>
                  handleInputChange(
                    "prototype_type",
                    "Diseño de prototipo en 3D"
                  )
                }
              />
            </View>
          ),
        },
        {
          key: "specific_requirements_dimensions",
          label: "Requerimientos específicos/dimensiones:",
          value: formData.specific_requirements_dimensions,
          placeholder: "Especifica los requerimientos o dimensiones",
          onChange: (text) =>
            handleInputChange("specific_requirements_dimensions", text),
        },
        {
          key: "specific_requirements_special_cut",
          label: "Corte especial:",
          value: formData.specific_requirements_special_cut,
          placeholder: "Ingresa detalles de corte especial (si aplica)",
          onChange: (text) =>
            handleInputChange("specific_requirements_special_cut", text),
        },
        {
          key: "specific_requirements_other",
          label: "Otros requerimientos:",
          value: formData.specific_requirements_other,
          placeholder: "Especifica otros requerimientos",
          onChange: (text) =>
            handleInputChange("specific_requirements_other", text),
        },
      ],
    },
    {
      title: "Observaciones",
      fields: [
        {
          key: "specific_requirements_other",
          label: "Observaciones adicionales:",
          value: formData.specific_requirements_comments,
          placeholder: "Ingresa observaciones adicionales (opcional)",
          onChange: (text) =>
            handleInputChange("specific_requirements_comments", text),
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, marginTop: "5%" }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <FlatList
        data={formSections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.formSection}>
            <Text style={styles.titleSection}>{item.title}</Text>
            {item.fields.map((field) =>
              field.renderCustom ? (
                field.renderCustom
              ) : (
                <View key={field.key} style={styles.formGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={field.value}
                    placeholder={field.placeholder}
                    onChangeText={field.onChange}
                  />
                </View>
              )
            )}
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  titleSection: {
    fontSize: 18,
    marginBottom: 10,
    color: "#2c3e50",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  radioButton: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  radioButtonLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  submitButton: {
    width: Scale * 0.25,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.0,
    marginLeft: "35%",
    marginBottom: "2%",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
    borderColor: "#007bff", // Puedes ajustar el color del borde
  },
  checkboxSelected: {
    backgroundColor: "#007bff", // Color cuando está seleccionado
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap", // Si tienes más checkboxes, estos se distribuirán en varias filas
    justifyContent: "flex-start",
    marginVertical: 10,
  },
});
