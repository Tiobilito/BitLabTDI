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
    name: "",
    email: "",
    phone: "",
    roles: { alumno: false, profesor: false },
    studentCode: "",
    teacherCode: "",
    projectType: "",
    application: "",
    descriptionProject: "",
    prototypeType: "",
    descriptionPrototype: "",
    specificRequirementsDimensions: "",
    specialCut: "",
    others: "",
    remarks: "",
  });
  const [showStudent, SetShowStudent] = useState(false);
  const [showTeacher, SetShowTeacher] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    // Validación simplificada para todos los campos obligatorios
    const requiredFields = [
      "name",
      "email",
      "phone",
      "projectType",
      "application",
      "descriptionProject",
      "prototypeType",
      "descriptionPrototype",
      "specificRequirementsDimensions",
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
    if (validateForm()) {
      try {
        await addProjectSub({
          ...formData,
          submission_date: new Date().toISOString().split("T")[0],
        });
        Alert.alert("Éxito", "Formulario enviado exitosamente.");
      } catch (error) {
        Alert.alert(
          "Error",
          "No se pudo enviar el formulario. Inténtalo de nuevo."
        );
      }
    }
  };

  const formSections = [
    {
      title: "Datos de Contacto",
      fields: [
        {
          key: "name",
          label: "Nombre completo:",
          value: formData.name,
          placeholder: "Ingresa tu nombre",
          onChange: (text) => handleInputChange("name", text),
        },
        {
          key: "email",
          label: "Correo electrónico:",
          value: formData.email,
          placeholder: "tuemail@ejemplo.com",
          onChange: (text) => handleInputChange("email", text),
        },
        {
          key: "phone",
          label: "Número de Teléfono:",
          value: formData.phone,
          placeholder: "Número de teléfono",
          onChange: (text) => handleInputChange("phone", text),
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
                    value={formData.studentCode}
                    placeholder="Ingresa código del alumno"
                    onChangeText={(text) =>
                      handleInputChange("studentCode", text)
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
                    value={formData.teacherCode}
                    placeholder="Ingresa código del profesor"
                    onChangeText={(text) =>
                      handleInputChange("teacherCode", text)
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
                selected={formData.projectType === "Licenciatura"}
                onSelect={() =>
                  handleInputChange("projectType", "Licenciatura")
                }
              />
              <RadioButton
                label="Posgrado"
                value="Posgrado"
                selected={formData.projectType === "Posgrado"}
                onSelect={() => handleInputChange("projectType", "Posgrado")}
              />
              <RadioButton
                label="Cuerpo Academico"
                value="Cuerpo Academico"
                selected={formData.projectType === "Cuerpo Academico"}
                onSelect={() =>
                  handleInputChange("projectType", "Cuerpo Academico")
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
          key: "descriptionProject",
          label: "Descripción:",
          value: formData.descriptionProject,
          placeholder: "Describe tu proyecto",
          onChange: (text) => handleInputChange("descriptionProject", text),
        },
      ],
    },
    {
      title: "Datos del Prototipo",
      fields: [
        {
          key: "prototypeType",
          label: "Tipo de prototipo:",
          renderCustom: (
            <View style={styles.radioGroup}>
              <RadioButton
                label="Diseño de circuito impreso"
                value="Diseño de circuito impreso"
                selected={
                  formData.prototypeType === "Diseño de circuito impreso"
                }
                onSelect={() =>
                  handleInputChange(
                    "prototypeType",
                    "Diseño de circuito impreso"
                  )
                }
              />
              <RadioButton
                label="Diseño de prototipo en 3D"
                value="Diseño de prototipo en 3D"
                selected={
                  formData.prototypeType === "Diseño de prototipo en 3D"
                }
                onSelect={() =>
                  handleInputChange(
                    "prototypeType",
                    "Diseño de prototipo en 3D"
                  )
                }
              />
            </View>
          ),
        },
        {
          key: "descriptionPrototype",
          label: "Descripción del prototipo:",
          value: formData.descriptionPrototype,
          placeholder: "Describe el prototipo",
          onChange: (text) => handleInputChange("descriptionPrototype", text),
        },
        {
          key: "specificRequirementsDimensions",
          label: "Requerimientos específicos/dimensiones:",
          value: formData.specificRequirementsDimensions,
          placeholder: "Especifica los requerimientos o dimensiones",
          onChange: (text) =>
            handleInputChange("specificRequirementsDimensions", text),
        },
        {
          key: "specialCut",
          label: "Corte especial:",
          value: formData.specialCut,
          placeholder: "Ingresa detalles de corte especial (si aplica)",
          onChange: (text) => handleInputChange("specialCut", text),
        },
        {
          key: "others",
          label: "Otros requerimientos:",
          value: formData.others,
          placeholder: "Especifica otros requerimientos",
          onChange: (text) => handleInputChange("others", text),
        },
      ],
    },
    {
      title: "Observaciones",
      fields: [
        {
          key: "remarks",
          label: "Observaciones adicionales:",
          value: formData.remarks,
          placeholder: "Ingresa observaciones adicionales (opcional)",
          onChange: (text) => handleInputChange("remarks", text),
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
