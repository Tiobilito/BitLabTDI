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
import { CustomView } from '../components/CustomView'
import { scale, verticalScale } from 'react-native-size-matters'
import { FloatingInput, CustomButton, OpenDrive } from '../../components'
import { mainStyles } from "../../components/styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const width = Dimensions.get("window").width;

const numberRegex = /^(\d+)?$/;

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

// Función auxiliar para las validaciones
const validateField = (field, message) => {
  if (!field) {
    Alert.alert("Error", message);
    return false;
  }
  return true;
};

export default function PrototypingFormEdit() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idReport } = route.params || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    roles: { alumno: false, profesor: false },
    studentCode: "",
    teacherCode: "",
    application: "",
    prototypeType: "",
    descriptionPrototype: "",
    driveUrl: "",
    specificRequirementsDimensions: "",
    specialCut: "",
    others: "",
    remarks: "",
  });

  const [error, setError] = useState("");
  const [dataUser, setDataUserType] = useState("");
  const [internalData, setInternalData] = useState({
    pcbFaces: 0,
    pcbProvidedByUser: null,
    requiredInputs: "",
    comments: "",
  });
  const [driveUrlErr, setDriveUrlErr] = useState("");
  const [driveUrlCheck, setDriveUrlCheck] = useState(false);

  const [state, setState] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedData, userData] = await Promise.all([
          getPrototypeById(idReport),
          GetUserData(),
        ]);
        //console.log(fetchedData.student_user_code);
        //console.log(fetchedData.professor_user_code);
        setFormData({
          name: fetchedData.applicant_name,
          email: fetchedData.contact_email,
          phone: fetchedData.contact_phone,
          projectType: fetchedData.project_type,
          roles: {
            alumno: !!fetchedData.student_user_code,
            profesor: !!fetchedData.professor_user_code,
          },
          studentCode:
            fetchedData.student_user_code !== null
              ? String(fetchedData.student_user_code)
              : "",
          teacherCode:
            fetchedData.professor_user_code !== null
              ? String(fetchedData.professor_user_code)
              : "",
          application: fetchedData.application,
          prototypeType: fetchedData.prototype_type,
          descriptionPrototype: fetchedData.prototype_description,
          driveUrl: fetchedData.drive_url,
          specificRequirementsDimensions:
            fetchedData.specific_requirements_dimensions,
          specialCut: fetchedData.specific_requirements_special_cut,
          others: fetchedData.specific_requirements_other,
          remarks: fetchedData.specific_requirements_comments,
        });
        setDataUserType(userData.User_type);
        checkUrl(fetchedData.drive_url);
      } catch (error) {
        setError("Error al cargar los datos.");
      }
    };

    fetchData();
  }, [idReport]);

  const handleUpdate = async (value) => {
    try {
      const estado = value ? "approved" : "rejected";
      const baseProject = {
        applicant_name: formData.name,
        contact_email: formData.email,
        contact_phone: formData.phone,
        project_type: formData.projectType,
        student_user_code: formData.roles.alumno
          ? Number(formData.studentCode)
          : null,
        professor_user_code: formData.roles.profesor
          ? Number(formData.teacherCode)
          : null,
        application: formData.application,
        prototype_type: formData.prototypeType,
        prototype_description: formData.descriptionPrototype,
        drive_url: formData.driveUrl,
        specific_requirements_dimensions:
          formData.specificRequirementsDimensions,
        specific_requirements_special_cut: formData.specialCut,
        specific_requirements_other: formData.others,
        specific_requirements_comments: formData.remarks,
        internal_use_pcb_faces: null,
        internal_use_pcb_provided_by_user: null,
        internal_use_required_inputs: null,
        internal_use_comments: null,
        prototype_approved_date: null,
        department_head: null,
        laboratory_head: null,
        service_staff: null,
        status: "awaiting_revision",
      };

      const updatedProject =
        dataUser === 2
          ? {
              internal_use_pcb_faces: internalData.pcbFaces,
              internal_use_pcb_provided_by_user: internalData.pcbProvidedByUser,
              internal_use_required_inputs: internalData.requiredInputs,
              internal_use_comments: internalData.comments,
              prototype_approved_date: new Date().toISOString().split("T")[0],
              status: estado,
            }
          : baseProject;

      await updateProjectSub(idReport, updatedProject);
      Alert.alert("Éxito", "Prototipo actualizado exitosamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el prototipo.");
    }
  };

  const handleSubmit = () => {
    // Validar que al menos uno de los roles esté seleccionado
    if (!formData.roles.alumno && !formData.roles.profesor) {
      alert("Por favor, selecciona al menos un rol (alumno o profesor).");
      return;
    }

    // Validaciones generales
    const validationFields = [
      { field: formData.name, message: "Por favor, ingresa tu nombre." },
      {
        field: formData.email,
        message: "Por favor, ingresa tu correo electrónico.",
      },
      {
        field: formData.phone,
        message: "Por favor, ingresa tu número de teléfono.",
      },
      // Validar el código de alumno solo si el rol de alumno está seleccionado
      ...(formData.roles.alumno
        ? [
            {
              field: formData.studentCode,
              message: "Por favor, ingresa el código de alumno.",
            },
          ]
        : []),
      // Validar el código de profesor solo si el rol de profesor está seleccionado
      ...(formData.roles.profesor
        ? [
            {
              field: formData.teacherCode,
              message: "Por favor, ingresa el código de profesor.",
            },
          ]
        : []),
      {
        field: formData.projectType,
        message: "Por favor, selecciona el tipo de proyecto.",
      },
      {
        field: formData.application,
        message: "Por favor, ingresa la aplicación de tu proyecto.",
      },
      {
        field: formData.prototypeType,
        message: "Por favor, selecciona el tipo de prototipo.",
      },
      {
        field: formData.descriptionPrototype,
        message: "Por favor, ingresa una descripción del prototipo.",
      },
      {
        field: formData.driveUrl,
        message: "Por favor, ingresa una URL de Google Drive.",
      },
      {
        field: driveUrlErr === "",
        message: "Por favor, ingresa una URL de Google Drive valida.",
      },
      {
        field: driveUrlCheck,
        message: "Por favor, vuelve a validar la URL de Google Drive.",
      },
      {
        field: formData.specificRequirementsDimensions,
        message: "Por favor, ingresa las dimensiones del prototipo.",
      },
    ];

    // Validar cada campo
    for (const { field, message } of validationFields) {
      if (!validateField(field, message)) {
        return;
      }
    }

    // Si pasa todas las validaciones, procede con la actualización
    console.log(formData);
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
    setFormData((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: !prev.roles[role] },
    }));
  };

  const handleSelectApproved = (value) => {
    if (
      internalData.pcbFaces === null ||
      internalData.pcbProvidedByUser === null ||
      !internalData.requiredInputs ||
      !internalData.comments
    ) {
      Alert.alert("Error", "Por favor, completa todos los campos internos.");
      return;
    }

    handleUpdate(value);
    updateProjectCheck(idReport, value, dataUser);
  };

  useEffect(() => {
    if (state !== null) {
      handleSelectApproved(state);
    }
  }, [state]);

  // #region URL DRIVE
  const driveFolderRegex = /^https?:\/\/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)(?:\?[\w=&%-]+)?$/;

  const isDriveFolder = async (url) => {
    if(driveUrlCheck) {
      setDriveUrlErr("Vuelve a validar el URL");
      setDriveUrlCheck(prev => !prev);
    }

    if (!url.includes("drive.google.com")) {
      setDriveUrlErr("El URL proporcionado no es de Google drive");
      return false;
    }

    const filePatterns = ["/file/d/", "/document/d/", "/spreadsheets/d/", "/presentation/d/"];
    const isFile = filePatterns.some(pattern => url.includes(pattern));
    
    const folderPatterns = ["/drive/folders/"];
    const isFolder = folderPatterns.some(pattern => url.includes(pattern)) && driveFolderRegex.test(url);

    // El link es de un archivo
    if (isFile) {
      setDriveUrlErr("El link no redirecciona a una carpeta");
      return false;
    }

    // Comprobar que es valido
    if (isFolder) {
      setDriveUrlErr("");
      const response = await checkUrl(url)
      return response.url === url;
    }
    
    setDriveUrlErr("Esta URL no es valida");
  }

  const handleUrlChange = async (url) => {
    setFormData({ ...formData, driveUrl: url });
    await isDriveFolder(url);
  }
  
  const checkUrl = async (url) => {
    if (url === "" || url === null) {
      setDriveUrlErr("");
      setDriveUrlCheck(false);
      return false;
    }

    try {
      const response = await fetch(url, { method: 'HEAD' });
      // console.log("response url -> ", response.url);
      // console.log("response status -> ", response.status);
      // console.log("response ok -> ", response.ok);
      
      const result = response.url === url && response.ok === true && response.status === 200;
      if (result) {
        setDriveUrlCheck(true);
      } else {
        if (!response.ok || response.status !== 200)
          setDriveUrlErr('El URL no es valido, comprueba que este completo');
        else
          setDriveUrlErr('Esta URL no parece ser publico\nComprueba que el acceso sea para "Cualquier persona con el enlace"');
        setDriveUrlCheck(false);
      }
      return result;
    } catch (err) {
      console.log("[x] checkUrl Err: ", err);
      setDriveUrlErr("Ocurrio un error de red, porfavor vuelva a intentarlo");
      setDriveUrlCheck(false);
      return false;
    }
  }

  const deleteUrl = () => {
    setFormData({ ...formData, driveUrl: "" });
    setDriveUrlErr("");
    setDriveUrlCheck(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Coloca la barra de estado por encima de las ventanas */}
      <CustomView>
        <View style={{width: scale(320), marginTop: verticalScale(210)}}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="black"
            translucent={true}
          />
          <Text style={styles.title}>
            Formato de requerimiento de servicio de maquinado de prototipo
          </Text>
          {/* Seccion 1: Datos de contacto */}
          <View style={styles.formSection}>
            <Text style={styles.titleSection}>Datos de contacto</Text>
            <FloatingInput
              label="Nombre completo"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              maxLength={40}
            />
            {/* <Text style={styles.label}>Nombre completo:</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              maxLength={40}
            /> */}
            <FloatingInput
              label="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              maxLength={35}
              placeholder="tuemail@ejemplo.com"
            />
            {/* <Text style={styles.label}>Correo electrónico:</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="tuemail@ejemplo.com"
              maxLength={35}
            /> */}
            <FloatingInput
              label="Número de Teléfono"
              value={formData.phone}
              onChangeText={(text) => {
                if (numberRegex.test(text))
                  setFormData({ ...formData, phone: text })}
              }
              maxLength={10}
              keyboardType={"phone-pad"}
            />
            {/* <Text style={styles.label}>Número de Teléfono:</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
              maxLength={10}
            /> */}
            <Text style={mainStyles.title}>
              Usuario(s) que solicita(n) el servicio:
            </Text>
            <View style={styles.checkboxGroup}>
              <Checkbox
                label="Alumno"
                checked={formData.roles.alumno}
                onChange={() => handleRoleChange("alumno")}
              />
              <Checkbox
                label="Profesor"
                checked={formData.roles.profesor}
                onChange={() => handleRoleChange("profesor")}
              />
            </View>

            {/* Función para desplegar los inputs del checkbox seleccionado para el tipo de usuario */}
            {formData.roles.alumno ? (
              <View style={styles.formGroup}>
                <FloatingInput
                  label="Código de Alumno"
                  value={formData.studentCode}
                  onChangeText={(text) => {
                    if (numberRegex.test(text))
                      setFormData({ ...formData, studentCode: text })
                  }}
                  keyboardType={"numeric"}
                  maxLength={9}
                />
                {/* <Text style={styles.label}>Código de Alumno</Text>
                <TextInput
                  style={styles.input}
                  value={formData.studentCode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, studentCode: text })
                  }
                  placeholder="Código de Alumno"
                  keyboardType="numeric"
                  maxLength={9}
                /> */}
              </View>
            ) : null}
            {formData.roles.profesor ? (
              <View style={styles.formGroup}>
                <FloatingInput
                  label="Código de Profesor"
                  value={formData.teacherCode}
                  onChangeText={(text) => {
                    if (numberRegex.test(text))
                      setFormData({ ...formData, teacherCode: text })
                  }}
                  keyboardType={"numeric"}
                  maxLength={9}
                />
                {/* <Text style={styles.label}>Código de Profesor</Text>
                <TextInput
                  style={styles.input}
                  value={formData.teacherCode}
                  onChangeText={(text) =>
                    setFormData({ ...formData, teacherCode: text })
                  }
                  placeholder="Código de Profesor"
                  keyboardType="numeric"
                  maxLength={9}
                /> */}
              </View>
            ) : null}
            <Text style={[mainStyles.title, { marginTop: scale(10) }]}>Proyecto para:</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                label="Licenciatura"
                value="Licenciatura"
                selected={formData.projectType === "Licenciatura"}
                onSelect={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
              />
              <RadioButton
                label="Posgrado"
                value="Posgrado"
                selected={formData.projectType === "Posgrado"}
                onSelect={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
              />
              <RadioButton
                label="Cuerpo Academico"
                value="Cuerpo Academico"
                selected={formData.projectType === "Cuerpo Academico"}
                onSelect={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
              />
            </View>
            <FloatingInput
              label="Aplicación"
              value={formData.application}
              onChangeText={(text) =>
                setFormData({ ...formData, application: text })
              }
              placeholder="¿En qué aplicarás tu proyecto?"
              maxLength={112}
            />
            {/* <Text style={styles.label}>Aplicación:</Text>
            <TextInput
              style={styles.input}
              value={formData.application}
              onChangeText={(text) =>
                setFormData({ ...formData, application: text })
              }
              placeholder="¿En qué aplicarás tu proyecto?"
              maxLength={112}
            /> */}
            {error && <Text style={styles.errorMessage}>{error}</Text>}
          </View>
          {/* Sección 2: Datos del Prototipo */}
          <View style={styles.formSection}>
            <Text style={styles.titleSection}>Datos del Prototipo</Text>

            <Text style={[mainStyles.title, { fontSize: 18 }]}>Tipo de prototipo:</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                label="Diseño de circuito impreso"
                value="impreso"
                selected={formData.prototypeType === "impreso"}
                onSelect={(value) =>
                  setFormData({ ...formData, prototypeType: value })
                }
              />
              <RadioButton
                label="Diseño de prototipo en 3D"
                value="tresD"
                selected={formData.prototypeType === "tresD"}
                onSelect={(value) =>
                  setFormData({ ...formData, prototypeType: value })
                }
              />
            </View>

            <FloatingInput
              label="Descripción del prototipo"
              value={formData.descriptionPrototype}
              onChangeText={(text) =>
                setFormData({ ...formData, descriptionPrototype: text })
              }
              placeholder="Describe tu prototipo"
              maxLength={191}
            />
            {/* <Text style={styles.label}>Descripción del prototipo:</Text>
            <TextInput
              style={styles.input}
              value={formData.descriptionPrototype}
              onChangeText={(text) =>
                setFormData({ ...formData, descriptionPrototype: text })
              }
              placeholder="Describe tu prototipo"
              maxLength={191}
            /> */}

            <Text style={mainStyles.title}>Seleccionar archivos:</Text>
            <OpenDrive buttonStyle={styles.buttonFiles}/>
            <View style={[styles.buttonContainer, { gap: 0, marginLeft: 0, }]}>
              <FloatingInput
                label=""
                value={formData.driveUrl}
                onChangeText={handleUrlChange}
                placeholder="URL carpeta de drive"
                multiline={true}
                keyboardType="url"
                inputStyle={{
                  backgroundColor: driveUrlErr !== "" ? "#F006"
                  : (driveUrlCheck === true && driveUrlErr === "") 
                  ? "#0F06" : "#C5E0F2",
                  width: width / 1.5,
                }}
              />
              <TouchableOpacity onPress={deleteUrl} style={{
                alignSelf: "center",
                marginTop: scale(11),
              }}>
                <MaterialCommunityIcons name="delete-empty" size={scale(40)} color="#2272A7" />
              </TouchableOpacity>
            </View>
            { driveUrlErr && (
              <Text style={styles.err}>{driveUrlErr}</Text>
            )}
            { (driveUrlCheck && driveUrlErr === "") && <Text style={[styles.err, { color: "#18F" }]}>Validado!</Text>}

            <Text style={mainStyles.title}>Requerimientos específicos:</Text>

            <FloatingInput
              label="Dimensiones en mm"
              value={formData.specificRequirementsDimensions}
              onChangeText={(text) =>
                setFormData({ ...formData, specificRequirementsDimensions: text })
              }
              placeholder="200x100x50"
              maxLength={40}
            />
            {/* <Text style={styles.label}>Dimensiones (en mm):</Text>
            <TextInput
              style={styles.input}
              value={formData.specificRequirementsDimensions}
              onChangeText={(text) =>
                setFormData({ ...formData, specificRequirementsDimensions: text })
              }
              placeholder="Ejemplo: 200x100x50"
              maxLength={40}
            /> */}
            <FloatingInput
              label="Corte especial"
              value={formData.specialCut}
              onChangeText={(text) =>
                setFormData({ ...formData, specialCut: text })
              }
              maxLength={82}
              placeholder="¿Se necesita algún corte especial?"
            />
            {/* <Text style={styles.label}>Corte especial:</Text>
            <TextInput
              style={styles.input}
              value={formData.specialCut}
              onChangeText={(text) =>
                setFormData({ ...formData, specialCut: text })
              }
              placeholder="¿Se necesita algún corte especial?"
              maxLength={82}
            /> */}

            <FloatingInput
              label="Otros"
              value={formData.others}
              onChangeText={(text) => setFormData({ ...formData, others: text })}
              placeholder="Menciona algún otro requerimiento que tengas"
              maxLength={91}
            />
            {/* <Text style={styles.label}>Otros requisitos:</Text>
            <TextInput
              style={styles.input}
              value={formData.others}
              onChangeText={(text) => setFormData({ ...formData, others: text })}
              placeholder="Describe otros requisitos específicos"
              maxLength={91}
            /> */}

            <FloatingInput
              label="Observaciones"
              value={formData.remarks}
              onChangeText={(text) => setFormData({ ...formData, remarks: text })}
              placeholder="Menciona alguna observación"
              maxLength={79}
            />
            {/* <Text style={styles.label}>Comentarios adicionales:</Text>
            <TextInput
              style={styles.input}
              value={formData.remarks}
              onChangeText={(text) => setFormData({ ...formData, remarks: text })}
              placeholder="Comentarios adicionales sobre el prototipo"
              maxLength={79}
            /> */}
          </View>
          {/* Seccion para llenado de datos del staff */}
          {dataUser === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.titleSection}>Información interna</Text>

              <Text style={styles.label}>Número de caras PCB:</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="1 cara"
                  value={1}
                  selected={internalData.pcbFaces === 1}
                  onSelect={(value) =>
                    setInternalData({ ...internalData, pcbFaces: value })
                  }
                />
                <RadioButton
                  label="2 caras"
                  value={2}
                  selected={internalData.pcbFaces === 2}
                  onSelect={(value) =>
                    setInternalData({ ...internalData, pcbFaces: value })
                  }
                />
              </View>

              <Text style={styles.label}>¿PCB proporcionado por el usuario?</Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Sí"
                  value={true}
                  selected={internalData.pcbProvidedByUser === true}
                  onSelect={(value) =>
                    setInternalData({ ...internalData, pcbProvidedByUser: value })
                  }
                />
                <RadioButton
                  label="No"
                  value={false}
                  selected={internalData.pcbProvidedByUser === false}
                  onSelect={(value) =>
                    setInternalData({ ...internalData, pcbProvidedByUser: value })
                  }
                />
              </View>

              <Text style={styles.label}>Insumos requeridos:</Text>
              <TextInput
                style={styles.input}
                value={internalData.requiredInputs}
                onChangeText={(text) =>
                  setInternalData({ ...internalData, requiredInputs: text })
                }
                placeholder="Especifica los insumos necesarios"
                maxLength={50}
              />

              <Text style={styles.label}>Observaciones:</Text>
              <TextInput
                style={styles.input}
                value={internalData.comments}
                onChangeText={(text) =>
                  setInternalData({ ...internalData, comments: text })
                }
                placeholder="Observaciones adicionales"
                maxLength={98}
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
            <View style={styles.buttonContainer}>
              <CustomButton
                title={"Cancelar"}
                onPress={() => navigation.goBack()}
                buttonStyles={{ backgroundColor: "#DC3545", width: width * 0.4 }}
              />
              <CustomButton
                title={"Enviar"}
                onPress={handleSubmit}
                buttonStyles={{ backgroundColor: "#007BFF", width: width * 0.4 }}
              />
            </View>
            // <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            //   <Text style={styles.submitButtonText}>Enviar</Text>
            // </TouchableOpacity>
          )}
      </View>
      </CustomView>
    </ScrollView>
  );
}

/* Estilos */
const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    marginTop: verticalScale(-45),
    alignItems: "center",
    // padding: 20,
    // flexGrow: 1,
    // backgroundColor: "#f2f2f2",
    // alignItems: "center",
    // marginLeft: 0,
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
    height: width > 400 ? 60 : 40,
    width: "100%",
    backgroundColor: "#C5E0F2",
    borderRadius: width > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    marginLeft: 0,
    fontSize: width > 400 ? 30 : 15,
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
    marginBottom: width * 0.0,
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
  approval: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.02,
    marginLeft: 10,
    gap: scale(20),
  },
  err:{
    color: "#F00",
    fontSize: scale(10),
    marginBottom: scale(10),
    paddingHorizontal: scale(8),
  },
});
