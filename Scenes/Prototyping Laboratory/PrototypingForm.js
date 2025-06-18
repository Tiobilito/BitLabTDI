import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import { addProjectSub } from "../../Modules/Operations DB Prototyping";
import { OpenDrive, CustomButton } from '../../Components';
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomView } from '../components/CustomView';
import { FloatingInput } from '../../Components';
import { mainStyles, toastConfig } from '../../Components/styles';
import Toast from 'react-native-toast-message';

const width = Dimensions.get("window").width;

const numberRegex = /^(\d+)?$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  /* Estados del formulario */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [roles, setRoles] = useState({ alumno: false, profesor: false });
  const [studentCode, setStudentCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [application, setApplication] = useState("");
  const [descriptionPrototype, setDescriptionPrototype] = useState("");
  const [prototypeType, setPrototypeType] = useState(0);
  const [numberOfFaces, setNumberOfFaces] = useState(0);
  const [driveUrl, setDriveUrl] = useState("");
  const [driveUrlErr, setDriveUrlErr] = useState("");
  const [driveUrlCheck, setDriveUrlCheck] = useState(false);
  const [specificRequirementsDimensions, setspecificRequirementsDimensions] =
    useState("");
  const [specialCut, setSpecialCut] = useState("");
  const [others, setOthers] = useState("");
  const [remarks, setRemarks] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  const navigation = useNavigation();

  // Función para limpiar todos los inputs
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setProjectType("");
    setRoles({ alumno: false, profesor: false });
    setStudentCode("");
    setTeacherCode("");
    setApplication("");
    setDescriptionPrototype("");
    setPrototypeType("");
    setNumberOfFaces(0);
    setDriveUrl("");
    setDriveUrlErr("");
    setDriveUrlCheck(false);
    setspecificRequirementsDimensions("");
    setSpecialCut("");
    setOthers("");
    setRemarks("");
  };

  const SentProject = async () => {
    try {
      // Asignar null al rol no seleccionado
      const finalStudentCode = roles.alumno ? Number(studentCode) : null;
      const finalTeacherCode = roles.profesor ? Number(teacherCode) : null;
      
      const newProject = {
        submission_date: new Date().toISOString().split("T")[0], // Fecha actual
        applicant_name: name, // Nombre del usuario que solicita el servicio
        contact_email: email, // Email
        contact_phone: phone, // Número de teléfono
        application: application, // Aplicación del proyecto
        student_user_code: finalStudentCode, // Código del alumno (o null)
        professor_user_code: finalTeacherCode, // Código del profesor (o null)
        project_type: projectType, // Tipo de proyecto
        prototype_description: descriptionPrototype, // Descripción del prototipo
        prototype_type: prototypeType, //Tipo de prototipo
        internal_use_pcb_faces: numberOfFaces, // Número de capas
        drive_url: driveUrl, // URL de la carpeta de google drive
        specific_requirements_dimensions: specificRequirementsDimensions, // Dimensiones del prototipo
        specific_requirements_special_cut: specialCut, // Corte específico (Opcional)
        specific_requirements_other: others, // Otros (Opcional)
        specific_requirements_comments: remarks, // Observaciones (Opcional)
        department_head: null, // Estado pendiente de revisión
        laboratory_head: null,
        service_staff: null,
        status: "awaiting_revision",
      };

      // Llamada a la función para agregar el proyecto
      const response = await addProjectSub(newProject);
      console.log("response -> ", response);
      if (response === null || !response) {
        Alert.alert("Error", "[X] No se logro enviar la solicitud.");
        return;
      }
      
      // Mostrar mensaje de éxito si todo va bien
      Toast.show({
        type: "success",
        text1: "Solicitud enviada exitosamente.",
        position: "bottom",
        onShow: () => {
          setButtonDisabled(true);
          const timeout = setTimeout(() => {
            resetForm();
            setButtonDisabled(false);
            navigation.goBack();
          }, 800);

          return () => clearInterval(timeout);
        }
      })
    
    } catch (error) {
      // El codigo de estudiante o profesor no coincide
      console.log("ERROR:::: ", error)
      console.log("ERROR CODE:::: ", error.code)
      if (error.code === "23503") {
        Toast.show({
          type: "error",
          text1: "No se encontro",
          text2: "Código de estudiante o profesor",
          position: "bottom",
        });
        return;
      } 
      // Mostrar mensaje de error si ocurre algún problema
      Toast.show({
        type: "error",
        text1: "Hubo un problema al enviar el formulario",
        text2: "Inténtalo de nuevo.",
        position: "bottom",
      });
      console.error("Error al enviar el proyecto:", error);
    }
  };

  const handleSubmit = () => {
    // Definir un arreglo de validaciones
    const validations = [
      { condition: !name, message: "Por favor, ingresa tu nombre." },
      {
        condition: !email,
        message: "Por favor, ingresa tu correo electrónico.",
      },
      {
        condition: !emailRegex.test(email),
        message: "Por favor, ingresa un correo válido."
      },
      {
        condition: !phone,
        message: "Por favor, ingresa tu número de teléfono.",
      },
      {
        condition: !roles.alumno && !roles.profesor,
        message: "Por favor, selecciona un rol (Alumno o Profesor).",
      },
      {
        condition: roles.alumno && !studentCode,
        message: "Por favor, ingresa el código de alumno.",
      },
      {
        condition: roles.profesor && !teacherCode,
        message: "Por favor, ingresa el código de profesor.",
      },
      {
        condition: !projectType,
        message: "Por favor, selecciona el tipo de proyecto.",
      },
      {
        condition: !application,
        message: "Por favor, ingresa la aplicación de tu proyecto.",
      },
      {
        condition: !descriptionPrototype,
        message: "Por favor, ingresa una descripción del prototipo.",
      },
      {
        condition: !numberOfFaces,
        message: "Por favor, ingresa el número de caras.",
      },
      {
        condition: !driveUrl,
        message: "Por favor, ingresa una URL de Google Drive.",
      },
      {
        condition: driveUrlErr !== "",
        message: "Por favor, ingresa una URL de Google Drive válida.",
      },
      {
        condition: !driveUrlCheck,
        message: "Por favor, vuelve a validar la URL de Google Drive.",
      },
      {
        condition: !specificRequirementsDimensions,
        message: "Por favor, ingresa las dimensiones del prototipo.",
      },
    ];

    // Recorrer el arreglo de validaciones
    for (const validation of validations) {
      if (validation.condition) {
        Toast.show({
          type: "error",
          text1: validation.message,
          position: "bottom",
        });
        // Alert.alert("Error", validation.message);
        return; // Detener la ejecución si hay un error
      }
    }

    // Si todas las validaciones pasan, enviar el formulario
    SentProject();
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
    
    setDriveUrlErr("Esta URL no es válida");
  }

  const handleUrlChange = async (url) => {
    setDriveUrl(url);
    await isDriveFolder(url);
  }
  
  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      const result = response.url === url && response.ok === true && response.status === 200;
      if (result) {
        setDriveUrlCheck(true);
      } else {
        if (!response.ok || response.status !== 200)
          setDriveUrlErr('El URL no es válido, comprueba que este completo');
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
    setDriveUrl("");
    setDriveUrlErr("");
    setDriveUrlCheck(false);
  }

  useEffect(() => {
    console.log(`${typeof(numberOfFaces)} -> ${numberOfFaces}`)
  }, [numberOfFaces])

  return (
    <View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <CustomView>
        <View style={{width: scale(320), marginTop: verticalScale(210)}}>
        {/* Coloca la barra de estado por encima de las ventanas */}
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f5f5f533"
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
            value={name}
            onChangeText={setName}
            maxLength={40}
          />
          <FloatingInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            maxLength={35}
            placeholder="tuemail@ejemplo.com"
          />
          <FloatingInput
            label="Número de Teléfono"
            value={phone}
            onChangeText={ text => {
              if (numberRegex.test(text))
                setPhone(text)
            }}
            maxLength={10}
            keyboardType={"phone-pad"}
          />
          <Text style={mainStyles.title}>
            Usuario(s) que solicita(n) el servicio
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
                onChangeText={ text => {
                  if (numberRegex.test(text))
                    setStudentCode(text)
                }}
                keyboardType={"numeric"}
                maxLength={9}
              />
            </View>
          ) : null}
          {roles.profesor ? (
            <View style={styles.formGroup}>
              <FloatingInput
                label="Código de Profesor"
                value={teacherCode}
                onChangeText={text => {
                  if (numberRegex.test(text))  
                    setTeacherCode(text)
                }}
                keyboardType={"numeric"}
                maxLength={9}
              />
            </View>
          ) : null}
          <Text style={[mainStyles.title, { marginTop: scale(10) }]}>Proyecto para</Text>
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
            maxLength={110}
          />
        </View>

        {/* Sección 2: Datos del Prototipo */}
        <View style={styles.formSection}>
          <Text style={styles.titleSection}>Datos del Prototipo</Text>
          <FloatingInput
            label="Descripción del prototipo"
            value={descriptionPrototype}
            onChangeText={setDescriptionPrototype}
            placeholder="Describe tu prototipo"
            maxLength={191}
          />
          <Text style={mainStyles.title}>Tipo de prototipo</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              label="Diseño de circuito impreso de alto detalle"
              value={1}
              selected={prototypeType === 1}
              onSelect={setPrototypeType}
            />
            <RadioButton
              label="Diseño de circuito impreso"
              value={2}
              selected={prototypeType === 2}
              onSelect={setPrototypeType}
            />
          </View>
          <Text style={mainStyles.title}>Número de caras</Text>
          <View style={styles.radioGroup}>
            <RadioButton
              label="1"
              value={1}
              selected={numberOfFaces === 1}
              onSelect={setNumberOfFaces}
            />
            <RadioButton
              label="2"
              value={2}
              selected={numberOfFaces === 2}
              onSelect={setNumberOfFaces}
            />
          </View>
          {/* FIXME: Agregar modal */}
          <Text style={mainStyles.title}>Seleccionar archivos</Text>
          <View style={[styles.buttonContainer, { gap: 0, marginLeft: 0, }]}>
            <OpenDrive buttonStyle={styles.buttonFiles}/>
            <View>
              <Pressable
                onPress={() => setHelpModal(true)}
                style={styles.btnPrint}
              >
                <MaterialCommunityIcons name="progress-question" size={scale(32)} color="#2272A7" />
              </Pressable>
            </View>
          </View>
          <View style={[styles.buttonContainer, { gap: 0, marginLeft: 0, }]}>
            <FloatingInput
              label=""
              value={driveUrl}
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
          <Text style={mainStyles.title}>
            Requerimientos específicos del Prototipo
          </Text>
          <FloatingInput
            label="Dimensiones en mm"
            value={specificRequirementsDimensions}
            onChangeText={setspecificRequirementsDimensions}
            maxLength={40}
            placeholder="200x100x50"
          />
          <FloatingInput
            label="Corte especial"
            value={specialCut}
            onChangeText={setSpecialCut}
            maxLength={82}
            placeholder="¿Se necesita algún corte especial?"
          />
          <FloatingInput
            label="Otros"
            value={others}
            onChangeText={setOthers}
            placeholder="Menciona algún otro requerimiento que tengas"
            maxLength={91}
          />
          <FloatingInput
            label="Observaciones"
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Menciona alguna observación"
            maxLength={79}
          />
        </View>

        <View style={styles.buttonContainer}>
        {/* Botón de envío del formulario */}
          <CustomButton
            title={"Cancelar"}
            onPress={() => navigation.goBack()}
            buttonStyles={{ backgroundColor: "#DC3545", width: width * 0.4 }}
          />
          <CustomButton
            title={"Enviar"}
            onPress={handleSubmit}
            buttonStyles={{ backgroundColor: "#007BFF", width: width * 0.4 }}
            disabled={buttonDisabled}
          />
        </View>
        </View>
        </CustomView>
      </ScrollView>
      <Toast config={toastConfig} />
    </View>
  );
}

/* Estilos */
const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    marginTop: verticalScale(-45),
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    color: "#394f66",
  },
  titleSection: {
    fontSize: scale(18),
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
  label: {
    fontSize: 16,
    marginBottom: 5,
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
  err:{
    color: "#F00",
    fontSize: scale(10),
    marginBottom: scale(10),
    paddingHorizontal: scale(8),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.02,
    marginLeft: 10,
    gap: scale(20),
  },
  buttonFiles: {
    width: "100%",
  },
  helpButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginRight: width * 0.3,
  },
  btnPrint: {
    backgroundColor: "white",
    width: scale(36),
    height: scale(36),
    borderRadius: 80,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
