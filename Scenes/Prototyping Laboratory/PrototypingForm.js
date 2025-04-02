import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { addProjectSub } from "../../Modules/Operations DB Prototyping";
import { OpenDrive, CustomButton } from '../../components';
import { scale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CustomView } from '../components/CustomView';
import { FloatingInput } from '../../components';
import { mainStyles } from '../../components/styles';

const width = Dimensions.get("window").width;

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
  const [prototypeType, setPrototypeType] = useState("");
  const [descriptionPrototype, setDescriptionPrototype] = useState("");
  const [url, setDriveUrl] = useState("");
  const [driveUrlErr, setDriveUrlErr] = useState("");
  const [driveUrlCheck, setDriveUrlCheck] = useState(false);
  const [specificRequirementsDimensions, setspecificRequirementsDimensions] =
    useState("");
  const [specialCut, setSpecialCut] = useState("");
  const [others, setOthers] = useState("");
  const [remarks, setRemarks] = useState("");

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
    setPrototypeType("");
    setDescriptionPrototype("");
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

      // TODO: Añadir URL a supabase
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
        drive_url: url, // URL de la carpeta de google drive
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
      }
      
      // Mostrar mensaje de éxito si todo va bien
      Alert.alert("Éxito", "Solicitud enviada exitosamente.");
      
      // Limpiar el formulario después de enviar
      resetForm();
    } catch (error) {
      // Mostrar mensaje de error si ocurre algún problema
      Alert.alert(
        "Error",
        "Hubo un problema al enviar el formulario. Inténtalo de nuevo."
      );
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
        condition: !prototypeType,
        message: "Por favor, selecciona el tipo de prototipo.",
      },
      {
        condition: !descriptionPrototype,
        message: "Por favor, ingresa una descripción del prototipo.",
      },
      {
        condition: !url,
        message: "Por favor, ingresa una URL de Google Drive",
      },
      {
        condition: driveUrlErr !== "",
        message: "Por favor, ingresa una URL de Google Drive valida",
      },
      {
        condition: !driveUrlCheck,
        message: "Por favor, vuelve a validar la URL de Google Drive",
      },
      {
        condition: !specificRequirementsDimensions,
        message: "Por favor, ingresa las dimensiones del prototipo.",
      },
    ];

    // Recorrer el arreglo de validaciones
    for (const validation of validations) {
      if (validation.condition) {
        Alert.alert("Error", validation.message);
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

  // const driveFolderRegex = /^https?:\/\/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)$/;
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
    setDriveUrl(url);
    await isDriveFolder(url);
  }
  
  const checkUrl = async (url) => {
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
          setDriveUrlErr('Esta URL no parece ser publica\nComprueba que el acceso sea para "Cualquier persona con el enlace"');
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

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <CustomView>
      <View style={{width: scale(320), marginTop: verticalScale(210)}}>
      {/* Coloca la barra de estado por encima de las ventanas */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f5f5f5"
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
        {/* <Text style={styles.label}>Nombre completo:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
          maxLength={40}
        /> */}
        <FloatingInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          maxLength={35}
          placeholder="tuemail@ejemplo.com"
        />
        {/* <Text style={styles.label}>Correo electrónico:</Text>
        <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="tuemail@ejemplo.com"
        maxLength={35}
        /> */}
        
        <FloatingInput
          label="Número de Teléfono"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
          keyboardType={"phone-pad"}
        />
        {/* <Text style={styles.label}>Número de Teléfono:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
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
              keyboardType={"numeric"}
              maxLength={9}
            />
            {/* <Text style={styles.label}>Código de Alumno</Text>
            <TextInput
              style={styles.input}
              value={studentCode}
              onChangeText={setStudentCode}
              placeholder="Código de Alumno"
              keyboardType="numeric"
              maxLength={9}
            /> */}
          </View>
        ) : null}
        {roles.profesor ? (
          <View style={styles.formGroup}>
            <FloatingInput
              label="Código de Profesor"
              value={teacherCode}
              onChangeText={setTeacherCode}
              keyboardType={"numeric"}
              maxLength={9}
            />
            {/* <Text style={styles.label}>Código de Profesor</Text>
            <TextInput
              style={styles.input}
              value={teacherCode}
              onChangeText={setTeacherCode}
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
        {/* <Text style={mainStyles.title}>Aplicación:</Text>
        <TextInput
          style={styles.input}
          value={application}
          onChangeText={setApplication}
          placeholder="¿En qué aplicarás tu proyecto?"
          maxLength={110}
        /> */}
      </View>

      {/* Sección 2: Datos del Prototipo */}
      <View style={styles.formSection}>
        <Text style={styles.titleSection}>Datos del Prototipo</Text>
        <Text style={[mainStyles.title, { fontSize: 18 }]}>
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
          maxLength={191}
        />
        {/* <Text style={styles.label}>Descripción del prototipo:</Text>
        <TextInput
          style={styles.input}
          value={descriptionPrototype}
          onChangeText={setDescriptionPrototype}
          placeholder="Describe tu prototipo"
          maxLength={191}
        /> */}
        <Text style={mainStyles.title}>Seleccionar archivos:</Text>
        <OpenDrive buttonStyle={styles.buttonFiles}/>
        <View style={[styles.buttonContainer, { gap: 0, marginLeft: 0, }]}>
          <FloatingInput
            label=""
            value={url}
            onChangeText={handleUrlChange}
            placeholder="URL carpeta de drive"
            multiline={true}
            keyboardType="url"
            inputStyle={{
              backgroundColor: driveUrlErr !== "" ? "#F006"
              : (driveUrlCheck === true && driveUrlErr === "") 
              ? "#0F06" : "#C5E0F2",
              width: width / 1.5,
              // height: scale(75),
              // lineHeight: 30,
              // height: "auto",
            }}
          />
          <TouchableOpacity onPress={deleteUrl} style={{
            // justifyContent: "flex-end",
            // alignItems: "flex-end",
            // alignContent: "flex-end",
            alignSelf: "center",
            marginTop: scale(11),
            // backgroundColor: "#000"
          }}>
            <MaterialCommunityIcons name="delete-empty" size={scale(40)} color="#2272A7" />
          </TouchableOpacity>
        </View>
        { driveUrlErr && (
          <Text style={styles.err}>{driveUrlErr}</Text>
        )}
        { (driveUrlCheck && driveUrlErr === "") && <Text style={[styles.err, { color: "#18F" }]}>Validado!</Text>}
        <Text style={mainStyles.title}>
          Requerimientos específicos del Prototipo:
        </Text>
        <FloatingInput
          label="Dimensiones"
          value={specificRequirementsDimensions}
          onChangeText={setspecificRequirementsDimensions}
          maxLength={40}
        />
        {/* <Text style={styles.label}>Dimensiones:</Text>
        <TextInput
          style={styles.input}
          value={specificRequirementsDimensions}
          onChangeText={setspecificRequirementsDimensions}
          placeholder="Dime tus dimensiones"
          maxLength={40}
        /> */}
        <FloatingInput
          label="Corte especial"
          value={specialCut}
          onChangeText={setSpecialCut}
          // placeholder="Describe tu prototipo"
          maxLength={82}
        />
        {/* <Text style={styles.label}>Corte especial:</Text>
        <TextInput
          style={styles.input}
          value={specialCut}
          onChangeText={setSpecialCut}
          placeholder="Dime tu corte especial"
          maxLength={82}
        /> */}
        <FloatingInput
          label="Otros"
          value={others}
          onChangeText={setOthers}
          placeholder="Menciona algún otro requerimiento que tengas"
          maxLength={91}
        />
        {/* <Text style={styles.label}>Otros:</Text>
        <TextInput
          style={styles.input}
          value={others}
          onChangeText={setOthers}
          placeholder="Menciona algún otro requerimiento que tengas"
          maxLength={91}
        /> */}
        <FloatingInput
          label="Observaciones"
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Menciona alguna observación"
          maxLength={79}
        />
        {/* <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={styles.input}
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Menciona alguna observación que tengas"
          maxLength={79}
        /> */}
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
        />
      {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enviar</Text>
      </TouchableOpacity> */}
      </View>
      </View>
      </CustomView>
    </ScrollView>
  );
}

/* Estilos */
const styles = StyleSheet.create({
  formContainer: {
    flexGrow: 1,
    // padding: 25,
    // backgroundColor: "#f2f2f2",
    marginTop: verticalScale(-45),
    alignItems: "center",
    // marginLeft: 20,
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
    // width: 100%,
    height: width * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: width * 0.0,
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
  err:{
    color: "#F00",
    fontSize: scale(10),
    marginBottom: scale(10),
    paddingHorizontal: scale(8),
  },
  selectFiles: {
    backgroundColor: "#CCC6",
    borderRadius: 5,
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
    // backgroundColor: "#FFF",
  },
});
