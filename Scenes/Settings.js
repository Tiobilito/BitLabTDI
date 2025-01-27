import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { getAllDepartamentos } from "../Modules/Operations DB Generals";
import { getUserById, updateUser } from "../Modules/Operations DB Users";
import { Picker } from "@react-native-picker/picker";
import { CustomView } from "./components/CustomView";
import { GetUserData } from "../Modules/DataInfo";

const Scale = Dimensions.get("window").width;

const SettingsPage = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [nss, setNss] = useState("");
  const [rfc, setRfc] = useState("");
  const [salary, setSalary] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getAllDepartamentos();
      if (data) {
        setDepartments(data);
      }
    };

    const loadUserData = async () => {
      const dataI = await GetUserData();
      const data = await getUserById(dataI.Code);
      await setUserData(data);
      if (data) {
        await setUserData(data);
        await setCode(data.code);
        await setUsername(data.name);
        await setEmail(data.email);
        await setPassword(data.password);
        await setUserType(data.user_type);
        await setAddress(data.address);
        await setZipCode(data.zip_code);
        await setPhoneNum(data.number);
        await setNss(data.nss);
        await setRfc(data.rfc);
        await setSalary(data.salary);
        await setDepartmentID(data.department_id);
      }
    };

    loadUserData();
    loadDepartments();
  }, []);

  const isFormValid = () => {
    if (!code) {
      Alert.alert("Error", "El código es obligatorio.");
      return false;
    }
    if (!username) {
      Alert.alert("Error", "El nombre es obligatorio.");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria.");
      return false;
    }
    return true;
  };

  const Verify = async () => {
    if (isFormValid()) {
      const UserData = {
        code: parseInt(code), // Convertir a entero
        name: username,
        //user_type: parseInt(userType, 10),
        address: address,
        zip_code: zipCode,
        email: email,
        nss: userType === "2" ? nss : "",
        rfc: userType === "2" ? rfc : "",
        salary: userType === "2" ? parseFloat(salary) : null, // Convertir a número con decimales
        number: phoneNum,
        department_id: departmentID ? parseInt(departmentID) : null, // Convertir a entero si existe
        password: password,
      };
      await updateUser(UserData);
      Alert.alert("Éxito", "Usuario modificado exitosamente.");
    }
  };

  return (
    <CustomView>
      <Text
        style={{
          fontSize: Scale > 400 ? 50 : 20,
          marginBottom: Scale * 0.05,
          marginTop: Scale * 0.5,
          fontWeight: "600",
          color: "#000",
          textAlign: "center",
        }}
      >
        Configuraciones
      </Text>

      <ScrollView style={{ height: Scale * 1.4 }}>
        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <View style={styles.sectionBody}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AccountOnlyRead");
              }}
              style={styles.profile}
            >
              <FeatherIcon
                name="user"
                size={60}
                color="#858585"
                style={styles.profileAvatar}
              />

              <View style={styles.profileBody}>
                <Text style={styles.profileName}>{username}</Text>

                <Text style={styles.profileHandle}>{email}</Text>
              </View>

              <FeatherIcon color="#bcbcbc" name="chevron-right" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Editaccount");
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Actualizar datos de usuario</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>{username}</Text>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("EditPassword");
                }}
                style={styles.row}
              >
                <Text style={styles.rowLabel}>Actualizar contraseña</Text>

                <View style={styles.rowSpacer} />

                <Text style={styles.rowValue}>********</Text>

                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: "center" },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}
              >
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: Scale * 0.1 }}></View>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: Scale > 400 ? 60 : 40,
    width: "93%",
    backgroundColor: "#C5E0F2",
    borderRadius: Scale > 400 ? 20 : 15,
    padding: 10,
    margin: 10,
    fontSize: Scale > 400 ? 30 : 15,
  },
  textForm: {
    fontSize: Scale > 400 ? 50 : 15,
    fontWeight: "regular",
    marginLeft: "5%",
    color: "#000000",
  },
  formCont: {
    width: Scale * 0.8,
    marginBottom: Scale * 0.08,
  },
  loginButton: {
    width: Scale * 0.5,
    height: Scale * 0.1,
    backgroundColor: "#2272A7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: Scale * 0.08,
  },
  Logo: {
    width: Scale > 400 ? 400 : 250,
    height: Scale > 400 ? 400 : 250,
    marginTop: "10%",
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    color: "#a69f9f",
    textTransform: "uppercase",
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: "auto",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: "#858585",
  },
  /** Row */
  row: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ababab",
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    color: "#dc2626",
  },
});

export default SettingsPage;
