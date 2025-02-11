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
import { getAllProjectSubmissions } from "../../Modules/Operations DB Prototyping"
import { GetUserData } from "../../Modules/DataInfo"

const { width, height } = Dimensions.get("screen")

const HeadDivisionLaboratoryPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
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

  const fetchData = async () => {
    try {
      const UData = await GetUserData()
      let ReportsData = await getAllProjectSubmissions(UData.Code)
      let BRData = ReportsData.map((registro) => ({
        ...registro,
        Details: false,
      }))
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
      <View style={styles.btnShowStats}>
        <TouchableOpacity
          style={styles.btnShow}
          onPress={() => toggleList("Reportes")}
        >
          <Ionicons name="clipboard" style={styles.iconShowStats} />
          <Text style={styles.textShowStats}>Reportes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tables}>
        <FlatList
          data={dataReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.info}>
                <Pressable onPress={() => toggleDetailsReports(item.id)}>
                  <Text style={styles.TextHeader}>{item.application}</Text>
                </Pressable>
                {/* Status */}
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

                {/* Details */}
                <View>
                  {item.Details && (
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 20,
                          marginLeft: 15,
                          marginTop: 5,
                        }}
                      >
                        {item.submission_date}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* PDF Button */}
              <View style={styles.pdfButtonContainer}>
                {item.department_head &&
                  item.laboratory_head &&
                  item.service_staff && (
                    <View>
                      <Pressable
                        onPress={() => navigateToPDF(item.id)}
                        style={styles.btnPrint}
                      >
                        <Image
                          source={require("../../Resources/imagenes/pdf.png")}
                          style={styles.buttonImage}
                        />
                      </Pressable>
                    </View>
                  )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay reportes disponibles</Text>
          }
        />
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
  pdfButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconPrint: {
    fontSize: width > 400 ? 60 : 55,
    color: "red",
  },
  btnPrint: {
    backgroundColor: "white",
    width: 45,
    height: 45,
    borderRadius: 80,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: 28,
    height: 28,
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
  },
  btnShow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  tables: {
    width: "95%",
    height: "75%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10, // Añadido padding
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    margin: height * 0.008,
    padding: width * 0.04, // Aumentado padding
    borderRadius: 10,
    flexDirection: "row", // Añadido para alinear elementos en fila
    justifyContent: "space-between", // Añadido para espaciar elementos
    alignItems: "center", // Añadido para centrar elementos verticalmente
  },
  emptyText: {
    textAlign: "center",
    color: "#2272A7",
    fontSize: 16,
    marginTop: height * 0.02,
  },
  TextHeader: {
    color: "white",
    fontSize: width > 500 ? 20 : 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  statusMargin: {
    backgroundColor: "white",
    borderRadius: 80,
    height: 30,
    marginTop: 4,
    justifyContent: "center",
    width: width > 400 ? 150 : 100,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    alignSelf: "center",
    alignItems: "center",
  },
})

export default HeadDivisionLaboratoryPage