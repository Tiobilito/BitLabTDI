import React, { useState, useCallback, useEffect } from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { getAllOrdersByUserId } from "../../Modules/Operations DB Fixes"
import {
  getAllProjectSubmissionsByUserId,
  getDeviceModelById,
} from "../../Modules/Operations DB Prototyping"
import { GetUserData } from "../../Modules/DataInfo"
import { scale, verticalScale } from "react-native-size-matters"
import { StatusIndicator } from '../../components'

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const TeacherStudentPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [dataOrders, setDataOrders] = useState([])
  const [dataReports, setDataReports] = useState([]) // Nueva lista de reportes
  const [showListOrders, setShowListOrders] = useState(true) // Estado para alternar entre listas
  const [devices, setDevices] = useState({})

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      fetchData()
    }, [])
  )

  // useEffect(() => console.log("dataOrders -> ", dataOrders), [dataOrders])
  // useEffect(() => console.log("dataReports -> ", dataReports), [dataReports])
  useEffect(() => console.log("devices -> ", devices), [devices])

  const navigateToPDF = (id) => {
    navigation.navigate("GeneratePDF", { idReport: id })
  }

  const navigateToOrder = (id) => {
    navigation.navigate("OrderRead", { idOrder: id })
  }

  const fetchData = async () => {
    try {
      const UData = await GetUserData()
      let Data = await getAllOrdersByUserId(UData.Code)
      let ReportsData = await getAllProjectSubmissionsByUserId(UData.Code)
      let BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }))
      let BRData = ReportsData.map((registro) => ({
        ...registro,
        Details: false,
      }))
      let devices = {}
      await Promise.all(
        Data.map(
          async (registro) =>
            (devices[registro.device_id] = await getDeviceModelById(
              registro.device_id
            ))
        )
      )
      // console.log("devices -> ", devices)
      setDataOrders(BData)
      setDataReports(BRData)
      setDevices(devices)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const toggleList = (Option) => {
    switch (Option) {
      case "Ordenes":
        setShowListOrders(true)
        break
      case "Reportes":
        setShowListOrders(false)
        break
      default:
        break
    }
  }

  const toggleDetailsOrders = (itemId) => {
    const updatedData = dataOrders.map((registro) => {
      if (registro.id === itemId) {
        return { ...registro, Details: !registro.Details }
      }
      return registro
    })
    setDataOrders(updatedData)
  }

  const toggleDetailsReports = (itemId) => {
    const updatedData = dataReports.map((registro) => {
      if (registro.id === itemId) {
        return { ...registro, Details: !registro.Details }
      }
      return registro
    })
    setDataReports(updatedData)
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  return (
    <CustomViewReverse style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.btnAction}
        onPress={() => navigation.navigate("ReportForm")}
      >
        <Ionicons name="clipboard" style={styles.reportIcon} />
        <Text style={styles.text}>Añadir Reporte</Text>
      </TouchableOpacity>

      <View style={styles.btnShowContainer}>
        <TouchableOpacity
          style={styles.btnShow}
          onPress={() => toggleList("Ordenes")}
        >
          <Ionicons name="clipboard" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Ordenes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnShow}
          onPress={() => toggleList("Reportes")}
        >
          <Ionicons name="clipboard" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Reportes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tables}>
        {showListOrders ? (
          <FlatList
            data={dataOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.itemContainer}
                onPress={() => toggleDetailsOrders(item.id)}
              >
                <View style={styles.orderContainer}>
                  <Text style={styles.itemText}>{item.id}</Text>
                  <Pressable
                    onPress={() => navigateToOrder(item.id)}
                    style={styles.btnReadOnlyO}
                  >
                    <Ionicons name={"reader"} style={styles.iconOrders} />
                  </Pressable>
                </View>
                {item.Details && (
                  <View>
                    <Text style={styles.dateTitle}>
                      Num. Serial:{" "}
                      <Text style={styles.dateText}>{devices[item.device_id].serial_number}</Text>
                    </Text>
                    <Text style={styles.dateTitle}>
                      Modelo:{" "}
                      <Text style={styles.dateText}>{devices[item.device_id].model}</Text>
                    </Text>
                    <Text style={styles.dateTitle}>{item.status}</Text>
                  </View>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay ordenes disponibles</Text>
            }
          />
        ) : (
          <FlatList
            data={dataReports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <View style={styles.contentContainer}>
                  <Pressable
                    onPress={() => toggleDetailsReports(item.id)}
                    style={{ flex: 1 }}
                  >
                    <Text style={styles.TextHeader}>{item.application}</Text>
                  </Pressable>
                  <View style={styles.statusContainer}>
                    <StatusIndicator status={item.status} size={10} />
                  </View>
                </View>
                {item.Details && (
                  <View style={styles.contentContainer}>
                    <Text style={styles.dateTitle}>
                      Enviado:{" "}
                      <Text style={styles.dateText}>
                        {item.submission_date}
                      </Text>
                    </Text>
                    {item.department_head &&
                      item.laboratory_head &&
                      item.service_staff && (
                        <Pressable
                          onPress={() => navigateToPDF(item.id)}
                          style={styles.btnPrint}
                        >
                          <Image
                            source={require("../../Resources/imagenes/pdf.png")}
                            style={styles.buttonImage}
                          />
                        </Pressable>
                      )}
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay reportes disponibles</Text>
            }
          />
        )}
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  btnAction: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 100,
    padding: scale(6),
    width: width * 0.8,
    alignSelf: "center",
    justifyContent: "center",
    gap: scale(10),
  },
  reportIcon: {
    fontSize: scale(20),
    color: "#2272A7",
    marginTop: scale(7),
  },
  text: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#2272A7",
  },
  btnShowContainer: {
    flexDirection: "row",
    // gap: scale(10),
    marginVertical: scale(10),
    justifyContent: "space-between",
    width: width * 0.8,
  },
  btnShow: {
    padding: scale(6),
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: "48%",
  },
  textShowStats: {
    fontSize: scale(22),
    fontWeight: "bold",
    color: "#2272A7",
  },
  iconShowStats: {
    fontSize: scale(18),
    color: "#2272A7",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  btnReadOnlyO: {
    backgroundColor: "white",
    padding: scale(6),
    borderRadius: 80,
  },
  iconOrders: {
    fontSize: scale(24),
    textAlign: "center",
    color: "gray",
  },
  // #region title
  dateTitle: {
    color: "white",
    fontSize: scale(16),
    marginTop: verticalScale(14),
    fontWeight: "bold",
  },
  dateText: {
    fontWeight: "normal",
    // marginLeft: 15,
  },
  tables: {
    minWidth: "80%",
    width: "80%",
    height: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10, // Añadido padding
  },
  TextHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    flexWrap: "wrap",
    // width: width * 0.4,
  },
  statusContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "stretch",
    flex: 1,
    // width: width * 0.45,
  },
  statusMargin: {
    borderRadius: 80,
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: "100%",
    // height: height * 0.03,
    textAlign: "center",
    textAlignVertical: "center",
    // marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    // margin: height * 0.008,
    padding: width * 0.03, // Aumentado padding
    borderRadius: 10,
    marginVertical: height * 0.01,
    // flexDirection: "row", // Añadido para alinear elementos en fila
    // justifyContent: "space-between", // Añadido para espaciar elementos
    // alignItems: "center", // Añadido para centrar elementos verticalmente
  },
  orderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "flex-start",
  },
  itemText: {
    color: "white", // Añadido color de texto
    fontSize: scale(16), // Añadido tamaño de texto
    fontWeight: "bold",
    // textDecorationLine: "underline",
  },
  emptyText: {
    textAlign: "center",
    color: "#2272A7",
    fontSize: scale(14),
    marginTop: height * 0.02,
  },
  // #region btn
  btnPrint: {
    backgroundColor: "white",
    width: scale(30),
    height: scale(30),
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  buttonImage: {
    width: scale(20),
    height: scale(20),
  },
})

export default TeacherStudentPage
