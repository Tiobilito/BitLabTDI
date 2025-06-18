import { React, useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import FeatherIcon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import { GetUserData } from "../../Modules/DataInfo"
import { getAllDepartamentos } from "../../Modules/Operations DB Generals"
import { getUserById } from "../../Modules/Operations DB Users"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { CustomButton, FloatingText, Form } from "../../Components"
import { scale } from "react-native-size-matters"

const { width, height } = Dimensions.get("window")

export default function ViewAccount() {
  const navigation = useNavigation()
  const [code, setCode] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState("")
  const [address, setAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [phoneNum, setPhoneNum] = useState("")
  const [nss, setNss] = useState("")
  const [rfc, setRfc] = useState("")
  const [salary, setSalary] = useState("")
  const [departmentID, setDepartmentID] = useState("")
  const [departments, setDepartments] = useState([])
  const [userData, setUserData] = useState([])

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getAllDepartamentos()
      if (data) {
        setDepartments(data)
      }
    }

    const loadUserData = async () => {
      const dataI = await GetUserData()
      const data = await getUserById(dataI.Code)
      await setUserData(data)
      if (data) {
        await setCode(data.code)
        await setUsername(data.name)
        await setEmail(data.email)
        await setUserType(data.user_type)
        await setAddress(data.address)
        await setZipCode(data.zip_code)
        await setPhoneNum(data.number)
        await setNss(data.nss)
        await setRfc(data.rfc)
        await setSalary(data.salary)
        await setDepartmentID(data.department_id)
      }
    }

    loadUserData()
    loadDepartments()
  }, [])

  return (
    <CustomViewReverse>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.headerAction}
        >
          <FeatherIcon color="#000" name="arrow-left" size={28} />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Ver datos de cuenta
        </Text>
      </View>

      <View style={styles.body}>
        <Form title={"Información Personal"}>
          <FloatingText title={"Nombre"} text={username} />
          {/* <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <Text style={styles.input}>{username}</Text>
              </View> */}
          <FloatingText title={"Email"} text={email} />
          <FloatingText title={"Teléfono"} text={phoneNum} />
          <FloatingText title={"Código"} text={code} />
          <FloatingText title={"Dirección"} text={address} />
          <FloatingText title={"C.P."} text={zipCode} />

          {/* Muestra estos datos solo si el tipo de usuario es 2 */}
          {userType === 2 && (
            <>
              <FloatingText title={"NSS"} text={nss} />
              <FloatingText title={"RFC"} text={rfc} />
              <FloatingText title={"Salario"} text={salary} />
            </>
          )}

          <FloatingText
            title={"Departamento"}
            text={departments.find((dep) => dep.id === departmentID)?.name}
          />
          <CustomButton
            title={"Regresar"}
            onPress={() => navigation.goBack()}
            buttonStyles={{ backgroundColor: "#DC3545", marginTop: 20 }}
          />
        </Form>
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 35,
  },
  headerAction: {
    position: "absolute",
    width: 32,
    height: 32,
    justifyContent: "center",
    marginLeft: scale(20),
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    flexGrow: 1,
    textAlign: "center",
    alignSelf: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#394F66",
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: "#555",
    backgroundColor: "#C5E0F2",
    padding: 8,
    borderRadius: width > 400 ? 20 : 15,
  },
})
