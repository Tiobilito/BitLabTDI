import React, { useState, useCallback } from "react"
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
import { getAllProjectSubmissionsByUserId } from "../../Modules/Operations DB Prototyping"
import { GetUserData } from "../../Modules/DataInfo"

const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height

const TeacherStudentPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [dataOrders, setDataOrders] = useState([])
  const [dataReports, setDataReports] = useState([]) // Nueva lista de reportes
  const [showListOrders, setShowListOrders] = useState(true) // Estado para alternar entre listas

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      fetchData()
    }, [])
  )

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
      setDataOrders(BData)
      setDataReports(BRData)
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
    <CustomViewReverse>
      <View style={{ marginTop: height * 0.05, gap: height * 0.02 }}>
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => navigation.navigate("ReportForm")}
        >
          <Ionicons
            name="clipboard"
            style={{
              fontSize: width > 400 ? 32 : 24,
              color: "#2272A7",
            }}
          />
          <Text style={styles.text}>Añadir Reporte</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnShowStats}>
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
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.id}</Text>
                <Pressable
                  onPress={() => navigateToOrder(item.id)}
                  style={styles.btnReadOnlyO}
                >
                  <Ionicons name={"reader"} style={styles.iconOrders} />
                </Pressable>
              </View>
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
                  <Pressable onPress={() => toggleDetailsReports(item.id)}>
                    <Text style={styles.TextHeader}>{item.application}</Text>
                  </Pressable>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusMargin,
                        {
                          backgroundColor:
                            item.status === "approved"
                              ? "#5ED52C"
                              : item.status === "rejected"
                              ? "#EF3131"
                              : item.status === "awaiting_revision"
                              ? "#57C9E1"
                              : "white",
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                </View>
                {item.Details && (
                  <View style={styles.contentContainer}>
                    <Text
                      style={styles.dateText}
                    >
                      {item.submission_date}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  text: {
    fontSize: width > 400 ? 32 : 24,
    fontWeight: "bold",
    color: "#2272A7",
  },
  textShowStats: {
    fontSize: width > 400 ? 24 : 16,
    fontWeight: "bold",
    color: "#2272A7",
  },
  iconShowStats: {
    fontSize: width > 400 ? 24 : 16,
    color: "#2272A7",
  },
  iconOrders: {
    fontSize: width > 400 ? 40 : 30,
    color: "gray",
    marginLeft: 7,
    marginTop: 6,
  },
  iconPrint: {
    fontSize: width > 400 ? 60 : 55,
    color: "red",
  },
  btnPrint: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 80,
    // marginLeft: 200,
    // marginTop: -25,
  },
  btnReadOnlyO: {
    backgroundColor: "white",
    width: 55,
    height: 55,
    borderRadius: 80,
    marginLeft: 250,
    marginTop: -20,
  },
  buttonImage: {
    width: 24,
    height: 24,
    marginLeft: 4,
    marginTop: 5,
  },
  btnAction: {
    width: width * 0.85,
    height: height * 0.08,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    gap: width * 0.04,
  },
  btnShowStats: {
    flexDirection: "row",
    gap: width * 0.04,
    marginTop: height * 0.02,
  },
  btnShow: {
    width: width * 0.45,
    height: height * 0.07,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: width * 0.04,
  },
  dateText: {
    color: "white",
    fontSize: 20,
    marginLeft: 15,
    marginTop: 5,
  },
  tables: {
    width: width * 0.9,
    height: height * 0.55,
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
    width: width * 0.4,
  },
  statusContainer: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "stretch",
    // width: width * 0.45,
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    margin: height * 0.008,
    padding: width * 0.04, // Aumentado padding
    borderRadius: 10,
    // flexDirection: "row", // Añadido para alinear elementos en fila
    // justifyContent: "space-between", // Añadido para espaciar elementos
    // alignItems: "center", // Añadido para centrar elementos verticalmente
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemText: {
    color: "white", // Añadido color de texto
    fontSize: 18, // Añadido tamaño de texto
  },
  emptyText: {
    textAlign: "center",
    color: "#2272A7",
    fontSize: 16,
    marginTop: height * 0.02,
  },
  statusMargin: {
    borderRadius: 80,
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: width * 0.35,
    height: height * 0.03,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 5,
  },
  statusText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
})

export default TeacherStudentPage
