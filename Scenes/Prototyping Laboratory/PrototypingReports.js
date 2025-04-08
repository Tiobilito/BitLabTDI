import React, { useState, useCallback } from "react"
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native"
import filter from "lodash.filter"
import { useFocusEffect } from "@react-navigation/native"
import { getAllProjectSubmissionsByUserId } from "../../Modules/Operations DB Prototyping"
import { GetUserData } from "../../Modules/DataInfo"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { Info, StatusIndicator } from "../../components"

const { width, height } = Dimensions.get("window")

const PrototypingReportsPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [nameQuery, setNameQuery] = useState("")
  const [showNameFilter, setShowNameFilter] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    try {
      const User = await GetUserData()
      const Data = await getAllProjectSubmissionsByUserId(User.Code)
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }))
      setData(BData)
      setFullData(BData)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      console.log(error)
      setIsLoading(false)
    }
  }

  const toggleDetails = (itemId) => {
    const updatedData = data.map((registro) => {
      if (registro.id === itemId) {
        return { ...registro, Details: !registro.Details }
      }
      return registro
    })
    setData(updatedData)
  }

  const applyFilters = () => {
    const filteredData = filter(fullData, (item) => {
      return (
        containsApplication(item, searchQuery) &&
        containsApplicantName(item, nameQuery)
      )
    })
    setData(filteredData)
  }

  const containsApplication = ({ application }, query) => {
    return application.toLowerCase().includes(query.toLowerCase())
  }

  const containsApplicantName = ({ applicant_name }, query) => {
    return applicant_name.toLowerCase().includes(query.toLowerCase())
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error en la obtención de datos</Text>
      </View>
    )
  }

  const navigateToEditSubmission = (id) => {
    navigation.navigate("EditSubmission", { idReport: id })
  }

  const navigateToPDF = (id) => {
    navigation.navigate("GeneratePDF", { idReport: id })
  }

  return (
    <CustomViewReverse>
      <View
        style={{
          flex: 1,
          height: "80%",
          width: width * 0.9,
          marginTop: height * 0.04,
        }}
      >
        {/* Input para filtrar por application */}
        <TextInput
          style={styles.searchBox}
          onChangeText={(query) => {
            setSearchQuery(query)
            applyFilters()
          }}
          value={searchQuery}
          placeholder="Buscar por aplicación"
        />

        {/* Botón para mostrar u ocultar el filtro de nombre */}
        <TouchableOpacity
          onPress={() => setShowNameFilter(!showNameFilter)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showNameFilter
              ? "Ocultar filtro por nombre"
              : "Mostrar filtro por nombre"}
          </Text>
        </TouchableOpacity>

        {/* Input para filtrar por applicant_name */}
        {showNameFilter && (
          <TextInput
            style={styles.searchBox}
            onChangeText={(query) => {
              setNameQuery(query)
              applyFilters()
            }}
            value={nameQuery}
            placeholder="Buscar por nombre del solicitante"
          />
        )}

        <View
          style={{
            justifyContent: "center",
            alignSelf: "center",
            width: width * 0.80,
            height: height * 0.70,
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 8,
            marginTop: 8,
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => toggleDetails(item.id)}
                  style={styles.item}
                >
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.applicant_name}</Text>
                    <Text style={styles.email}>{item.application}</Text>
                  </View>
                </TouchableOpacity>

                {/* Mostrar el status del reporte */}
                <View style={styles.statusContainer}>
                  <StatusIndicator status={item.status}/>
                  {/* <View
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
                  </View> */}
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
                            style={styles.buttonImagePrint}
                          />
                        </Pressable>
                      </View>
                    )}
                </View>
                {item.Details && (
                  <View style={styles.details}>
                    <Info title="ID: " text={item.id} />
                    <Info
                      title="Fecha de Solicitud: "
                      text={item.submission_date}
                    />
                    <Info
                      title="Teléfono de Contacto: "
                      text={item.contact_phone}
                    />
                    <Info title="Proyecto: " text={item.application} />
                    {/* Agrega más campos según sea necesario */}
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() => navigateToEditSubmission(item.id)}
                        style={styles.buttonContainer}
                      >
                        <Image
                          source={require("../../Resources/imagenes/editar.png")}
                          style={styles.buttonImage}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </CustomViewReverse>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#095ea7",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
  },
  searchBox: {
    padding: 10,
    margin: 5,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    borderColor: "#ddd",
  },
  toggleButton: {
    margin: 5,
    padding: 10,
    backgroundColor: "#2272A7",
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#2272A7",
    borderRadius: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  email: {
    fontSize: 14,
    color: "#ffffff",
  },
  details: {
    padding: 10,
    backgroundColor: "#2272A7",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#ffffff",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 100,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  buttonImage: {
    width: 24,
    height: 24,
  },
  warningIcon: {
    marginLeft: 10,
  },
  statusMargin: {
    backgroundColor: "white",
    borderRadius: 80,
    height: 30,
    width: "45%",
    marginTop: 4,
    marginLeft: 10,
    marginBottom: 10,
    // textAlign: "center",
    // textAlignVertical: "center",
  },
  statusText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlignVertical: "center",
  },
  btnPrint: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 80,
    marginRight: width * 0.02,
    // marginLeft: 200,
    // marginTop: -25,
  },
  buttonImagePrint: {
    width: 24,
    height: 24,
    marginLeft: 4,
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  }
})

export default PrototypingReportsPage
