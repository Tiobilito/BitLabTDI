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

  const createPDF = async () => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Formato de Requerimiento de Servicio de Maquinado de Prototipo</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                    text-decoration: underline;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .section-title {
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                }
                .signature {
                    width: 45%;
                    text-align: center;
                    padding-top: 60px;
                    border-top: 1px solid black;
                }
                .checkbox {
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    border: 1px solid black;
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
  
            <h1>Formato de requerimiento de servicio de maquinado de prototipo</h1>
  
            <table>
                <tr>
                    <th>Nombre</th>
                    <td colspan="3">${applicantName}</td>
                    <th>Fecha</th>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th>Aplicación</th>
                    <td colspan="3">${application}</td>
                </tr>
                <tr>
                    <th>Correo electrónico</th>
                    <td>${contactEmail}</td>
                    <th>Teléfono</th>
                    <td>${contactPhone}</td>
                </tr>
                <tr>
                    <th>Código Alumno</th>
                    <td>${user?.code}</td>
                    <th>Código Profesor</th>
                    <td>${selectedProfessor}</td>
                    <th>Proyecto</th>
                    <td>
                        <div class="checkbox">${
                          projectType === "Licenciatura" ? "X" : ""
                        }</div> Licenciatura <br>
                        <div class="checkbox">${
                          projectType === "Posgrado" ? "X" : ""
                        }</div> Posgrado <br>
                        <div class="checkbox">${
                          projectType === "Cuerpo Academico" ? "X" : ""
                        }</div> Cuerpo Académico
                    </td>
                </tr>
            </table>
  
            <div class="section-title">Tipo de Prototipo</div>
            <table>
                <tr>
                    <th>Diseño de circuito impreso</th>
                    <td><div class="checkbox">${
                      prototypeType === "Diseño de circuito impreso" ? "X" : ""
                    }</div></td>
                </tr>
                <tr>
                    <th>Diseño de prototipo en 3D</th>
                    <td><div class="checkbox">${
                      prototypeType === "Diseño de prototipo en 3d" ? "X" : ""
                    }</div></td>
                </tr>
                <tr>
                    <th>Descripción del prototipo</th>
                    <td colspan="5">${prototypeDescription}</td>
                </tr>
            </table>
  
            <div class="section-title">Requerimientos específicos del prototipo</div>
            <table>
                <tr>
                    <th>Dimensiones</th>
                    <td>${specificRequirementsDimensions}</td>
                    <th>Corte especial</th>
                    <td><div class="checkbox">${
                      specificRequirementsSpecialCut ? "X" : ""
                    }</div> Sí <div class="checkbox">${
      !specificRequirementsSpecialCut ? "X" : ""
    }</div> No</td>
                </tr>
                <tr>
                    <th>Otros</th>
                    <td colspan="3">${specificRequirementsOther}</td>
                </tr>
                <tr>
                    <th>Observaciones</th>
                    <td colspan="5">${specificRequirementsComments}</td>
                </tr>
            </table>
  
            <div class="section-title">Para uso interno</div>
            <table>
                <tr>
                    <th>Número de caras PCB</th>
                    <td>${internalUsePcbFaces}</td>
                    <th>PCB proporcionado por usuario</th>
                    <td><div class="checkbox">${
                      internalUsePcbProvidedByUser ? "X" : ""
                    }</div> Sí <div class="checkbox">${
      !internalUsePcbProvidedByUser ? "X" : ""
    }</div> No</td>
                </tr>
                <tr>
                    <th>Insumos requeridos</th>
                    <td colspan="5">${internalUseRequiredInputs}</td>
                </tr>
                <tr>
                    <th>Observaciones</th>
                    <td colspan="5">${internalUseComments}</td>
                </tr>
            </table>
  
            <div class="signature-section">
                <div class="signature">
                    Fecha: ${new Date().toLocaleDateString()} <br>
                    Firma del jefe del departamento
                </div>
                <div class="signature">
                    Fecha: ${new Date().toLocaleDateString()} <br>
                    Firma del jefe del laboratorio de prototipado
                </div>
            </div>
  
        </body>
        </html>
    `;

    const file = await printToFileAsync({
      html: htmlContent,
      base64: false,
      fileName: "OrderDetails.pdf",
    });

    await shareAsync(file.uri);
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
          onValueChange={(itemValue, itemIndex) =>
            setInternalUsePcbFaces(itemValue)
          }
        >
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
        </Picker>
        <Text>Pcb proporcionado por el usuario</Text>
        <Picker
          selectedValue={internalUsePcbProvidedByUser}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setInternalUsePcbProvidedByUser(itemValue)
          }
        >
          <Picker.Item label="No" value={false} />
          <Picker.Item label="Si" value={true} />
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
        <Button onPress={SentProject} title="Learn More" color="#841584" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#ffffff", // White background for minimal look
    padding: 20,
  },
  input: {
    backgroundColor: "#f9f9f9", // Light gray background for inputs
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1, // Simple thin border
    borderColor: "#d3d3d3", // Light gray border
    fontSize: 16,
  },
  picker: {
    marginVertical: 10,
    backgroundColor: "#f9f9f9", // Same as inputs
    borderRadius: 8,
  },
});

export default Prototype_Form;
