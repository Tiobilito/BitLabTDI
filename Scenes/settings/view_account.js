import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { GetUserData } from "../../Modules/DataInfo";
import { getAllDepartamentos } from "../../Modules/Operations DB Generals";
import { getUserById } from "../../Modules/Operations DB Users";
import { CustomViewReverse } from "../components/CustomViewReverse";

export default function ViewAccount() {
  const navigation = useNavigation();
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
        await setCode(data.code);
        await setUsername(data.name);
        await setEmail(data.email);
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

  return (
    <CustomViewReverse>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FeatherIcon color="#000" name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Ver datos de cuenta
        </Text>

        <View style={[styles.headerAction, { alignItems: "flex-end" }]}>
          <TouchableOpacity
            onPress={() => {
              // handle additional options
            }}
          >
            <FeatherIcon color="#000" name="more-vertical" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.sectionBody}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Nombre</Text>
              <Text style={styles.input}>{username}</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.input}>{email}</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <Text style={styles.input}>{phoneNum}</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Código</Text>
              <Text style={styles.input}>{code}</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <Text style={styles.input}>{address}</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>C.P.</Text>
              <Text style={styles.input}>{zipCode}</Text>
            </View>

            {/* Muestra estos datos solo si el tipo de usuario es 2 */}
            {userType === 2 && (
              <>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>NSS</Text>
                  <Text style={styles.input}>{nss}</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>RFC</Text>
                  <Text style={styles.input}>{rfc}</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Salario</Text>
                  <Text style={styles.input}>{salary}</Text>
                </View>
              </>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Departamento</Text>
              <Text style={styles.input}>
                {departments.find((dep) => dep.id === departmentID)?.name}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </CustomViewReverse>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 35,
  },
  headerAction: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  content: {
    paddingHorizontal: 16,
  },
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
    backgroundColor: "#fff",
    padding: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: "#555",
    backgroundColor: "#C5E0F2",
    padding: 8,
  },
});
