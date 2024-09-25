import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import {
  addProjectSub,
  getAllTeachers,
  getClientById,
} from "../../Modules/OperacionesBD";

const Prototype_Form = ({ navigation }) => {
  const route = useRoute();
  const { UserId } = route.params;
  const [teachers, SetTeachers] = useState(null);
  const [user, SetUser] = useState(null);
  const [applicantName, setApplicantName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [application, setApplication] = useState("");
  const [projectType, setProjectType] = useState("Licenciatura");
  const [prototypeType, setPrototypeType] = useState(
    "Diseño de circuito impreso"
  );
  const [prototypeDescription, setPrototypeDescription] = useState("");
  const [specificRequirementsDimensions, setSpecificRequirementsDimensions] =
    useState("");
  const [specificRequirementsSpecialCut, setSpecificRequirementsSpecialCut] =
    useState("");
  const [specificRequirementsOther, setSpecificRequirementsOther] =
    useState("");
  const [specificRequirementsComments, setSpecificRequirementsComments] =
    useState("");
  const [internalUsePcbFaces, setInternalUsePcbFaces] = useState(1);
  const [internalUsePcbProvidedByUser, setInternalUsePcbProvidedByUser] =
    useState(false);
  const [internalUseRequiredInputs, setInternalUseRequiredInputs] =
    useState("");
  const [internalUseComments, setInternalUseComments] = useState("");
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  useEffect(() => {
    GetDbData();
  }, []);

  const GetDbData = async () => {
    const TeachersData = await getAllTeachers();
    const UserData = await getClientById(UserId);
    SetTeachers(TeachersData);
    SetUser(UserData);
    setApplicantName(user.name);
    setContactEmail(user.email);
    setContactPhone(user.number);
  };

  const SentProject = async () => {
    const newProject = {
      submission_date: new Date().toISOString().split("T")[0], // Fecha actual
      applicant_name: applicantName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      application,
      student_user_code: UserData.code, // Código del alumno
      professor_user_code: selectedProfessor, // Código del profesor seleccionado
      project_type: projectType,
      prototype_type: prototypeType,
      prototype_description: prototypeDescription,
      specific_requirements_dimensions: specificRequirementsDimensions,
      specific_requirements_special_cut: specificRequirementsSpecialCut,
      specific_requirements_other: specificRequirementsOther,
      specific_requirements_comments: specificRequirementsComments,
      internal_use_pcb_faces: parseInt(internalUsePcbFaces),
      internal_use_pcb_provided_by_user: internalUsePcbProvidedByUser,
      internal_use_required_inputs: internalUseRequiredInputs,
      internal_use_comments: internalUseComments,
      prototype_approved_date: null,
      prototype_approved_signature: null,
      prototype_delivered_date: null,
      prototype_delivered_signature: null,
    };
    await addProjectSub(newProject);
  };

  return (
    <View style={styles.background}>
      <ScrollView>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setApplication(text);
          }}
          value={application}
          placeholder="Nombre aplicación"
        />
        <Text>Profesor</Text>
        <Picker
          selectedValue={selectedProfessor}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedProfessor(itemValue)
          }
        >
          {teachers.map((teacher) => (
            <Picker.Item
              key={teacher.code} // Asegúrate de que cada elemento tenga una clave única
              label={teacher.name} // Usa el nombre correcto de la propiedad
              value={teacher.code} // Usa el id correcto para el valor
            />
          ))}
        </Picker>
        <Text>Proyecto</Text>
        <Picker
          selectedValue={projectType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setProjectType(itemValue)}
        >
          <Picker.Item label="Lincenciatura" value="Lincenciatura" />
          <Picker.Item label="Posgrado" value="Posgrado" />
          <Picker.Item label="Cuerpo Academico" value="Cuerpo Academico" />
        </Picker>
        <Text>Tipo de prototipo</Text>
        <Picker
          selectedValue={prototypeType}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setPrototypeType(itemValue)}
        >
          <Picker.Item
            label="Diseño de circuito impreso"
            value="Diseño de circuito impreso"
          />
          <Picker.Item
            label="Diseño de prototipo en 3d"
            value="Diseño de prototipo en 3d"
          />
        </Picker>
        <Text>Descripcion del prototipo</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setPrototypeDescription(text);
          }}
          value={prototypeDescription}
          placeholder="Descripcion"
        />
        <Text>Requerimientos especificos del Prototipo</Text>
        <Text>Dimensiones</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setSpecificRequirementsDimensions(text);
          }}
          value={specificRequirementsDimensions}
          placeholder="Dimensiones"
        />
        <Text>Corte especial</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setSpecificRequirementsSpecialCut(text);
          }}
          value={specificRequirementsSpecialCut}
          placeholder="Corte especial"
        />
        <Text>Otros</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setSpecificRequirementsOther(text);
          }}
          value={specificRequirementsOther}
          placeholder="Otros"
        />
        <Text>Observaciones</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setSpecificRequirementsComments(text);
          }}
          value={specificRequirementsComments}
          placeholder="Observaciones"
        />
        <Text>Para uso interno</Text>
        <Text>Numero de caras PCB</Text>
        <Picker
          selectedValue={internalUsePcbFaces}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setInternalUsePcbFaces(itemValue)}
        >
          <Picker.Item
            label="1"
            value={1}
          />
          <Picker.Item
            label="2"
            value={2}
          />
        </Picker>
        <Text>Pcb proporcionado por el usuario</Text>
        <Picker
          selectedValue={internalUsePcbProvidedByUser}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setInternalUsePcbProvidedByUser(itemValue)}
        >
          <Picker.Item
            label="No"
            value={false}
          />
          <Picker.Item
            label="Si"
            value={true}
          />
        </Picker>
        <Text>Insumos requeridos</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setInternalUseRequiredInputs(text);
          }}
          value={internalUseRequiredInputs}
          placeholder="Insumos requeridos"
        />
        <Text>Observaciones</Text>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={(text) => {
            setInternalUseComments(text);
          }}
          value={internalUseComments}
          placeholder="Observaciones"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30,
  },
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: "white",
  },
});

export default Prototype_Form;
