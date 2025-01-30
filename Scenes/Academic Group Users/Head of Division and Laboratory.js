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

const WIDTH = Dimensions.get("screen").width
const HEIGHT = Dimensions.get("screen").height

const HeadDivisionLaboratoryPage = ({ navigation }) => {
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

  const fetchData = async () => {
    try {
      const UData = await GetUserData()
      let Data = await getAllOrdersByUserId(UData.Code)
      let ReportsData = await getAllProjectSubmissions(UData.Code)
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
      <View style={{ marginTop: HEIGHT * 0.03, gap: HEIGHT * 0.02 }}></View>
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
              <Pressable onPress={() => toggleDetailsReports(item.id)}>
                <Text style={styles.TextHeader}>{item.application}</Text>
              </Pressable>

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
    fontSize: WIDTH > 400 ? 32 : 24,
    fontWeight: "bold",
    color: "#2272A7",
  },
  textShowStats: {
    fontSize: WIDTH > 400 ? 24 : 16,
    fontWeight: "bold",
    color: "#2272A7",
  },
  iconShowStats: {
    fontSize: WIDTH > 400 ? 24 : 16,
    color: "#2272A7",
  },
  iconPrint: {
    fontSize: WIDTH > 400 ? 60 : 55,
    color: "red",
  },
  btnPrint: {
    backgroundColor: "white",
    width: 45,
    height: 45,
    borderRadius: 80,
    marginLeft: WIDTH * 1.2,
    marginTop: -45,
  },
  buttonImage: {
    width: 28,
    height: 28,
    marginLeft: 7,
    marginTop: 8,
  },
  btnAction: {
    width: WIDTH * 0.85,
    height: HEIGHT * 0.08,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    gap: WIDTH * 0.04,
  },
  btnShowStats: {
    flexDirection: "row",
    gap: WIDTH * 0.04,
    marginTop: HEIGHT * 0.02,
  },
  btnShow: {
    width: WIDTH * 0.45,
    height: HEIGHT * 0.07,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: WIDTH * 0.04,
  },
  tables: {
    width: WIDTH * 0.9,
    height: HEIGHT * 0.55,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
  },
  itemContainer: {
    backgroundColor: "#2272A7",
    margin: HEIGHT * 0.008,
    padding: WIDTH * 0.02,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#2272A7",
    fontSize: 16,
    marginTop: HEIGHT * 0.02,
  },
  TextHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  statusMargin: {
    backgroundColor: "white",
    borderRadius: 80,
    alignItems: "center",
    height: 30,
    width: "40%",
    // marginLeft: 120,
    marginTop: 4,
    // alignContent: "center",
    justifyContent: "center",
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
