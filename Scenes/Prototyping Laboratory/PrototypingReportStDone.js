import React, { useState, useCallback, useEffect } from "react"
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import filter from "lodash.filter"
import { useFocusEffect } from "@react-navigation/native"
import { getAllProjectSubmissionsFinished } from "../../Modules/Operations DB Prototyping"
import { CustomViewReverse } from "../components/CustomViewReverse"
import Icon from "react-native-vector-icons/Ionicons"
import { Info } from "../../components"

const { width, height } = Dimensions.get("window")

const PrototypingReportStDone = ({ navigation }) => {
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
    let Data
    try {
      Data = await getAllProjectSubmissionsFinished()
      //console.log(Data);
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
      const matchesApplication = containsApplication(item, searchQuery)
      const matchesApplicantName = containsApplicantName(item, nameQuery)
      return matchesApplication && matchesApplicantName
    })
    setData(filteredData)
  }

  const containsApplication = ({ application }, query) => {
    return application.toLowerCase().includes(query.toLowerCase())
  }

  const containsApplicantName = ({ applicant_name }, query) => {
    return applicant_name.toLowerCase().includes(query.toLowerCase())
  }

  useEffect(() => {
    if (!searchQuery && !nameQuery) {
      setData(fullData) // Restablece los datos originales si ambos campos están vacíos
    } else {
      applyFilters() // Aplica los filtros si hay valores en los campos
    }
  }, [searchQuery, nameQuery]) // Observa los cambios en searchQuery y nameQuery

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

  const navigateToCheck = (id) => {
    navigation.navigate("ReportCheck", { idReport: id })
  }

  const navigateToPDF = (id) => {
    navigation.navigate("GeneratePDF", { idReport: id })
  }

  const navigateToRemaning = () => {
    navigation.navigate("Check")
  }

  return (
    <CustomViewReverse style={{ flex: 1, justifyContent: "center" }}>
      <View
        style={{
          height: "90%",
          width: width * 0.9,
          // marginTop: height * 0.04,
        }}
      >
        <View style={styles.arrowContainer}>
          <Pressable style={styles.arrow} onPress={navigateToRemaning}>
            <Icon name="arrow-back-outline" size={40} color="#007BFF" />
          </Pressable>
        </View>
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
            flex: 1,
            width: width * 0.9,
            // height: height * 0.65,
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

                  {/* Verifica que la solicitud ya fue aprobada po el jefe de departamento, el jefe de laboratorio y el prestador de servicio */}
                  {/* Mostrar el icono de advertencia o el icono de aprobado */}
                  {!item.department_head ||
                  !item.laboratory_head ||
                  !item.service_staff ? (
                    <View style={styles.iconCheck}>
                      <Icon name="close-circle-outline" size={24} color="red" />
                    </View>
                  ) : (
                    <View style={styles.iconCheck}>
                      <Icon
                        name="checkmark-circle-outline"
                        size={24}
                        color="green"
                      />
                    </View>
                  )}
                </TouchableOpacity>

                {item.Details && (
                  <View style={styles.details}>
                    <Info title={"ID: "} text={item.id} />
                    <Info
                      title={"Fecha de Solicitud: "}
                      text={item.submission_date}
                    />
                    <Info
                      title={"Teléfono de contacto: "}
                      text={item.contact_phone}
                    />
                    <Info title={"Proyecto: "} text={item.application} />
                    {/* Agrega más campos según sea necesario */}
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() => navigateToCheck(item.id)}
                        style={styles.buttonContainer}
                      >
                        <Image
                          source={require("../../Resources/imagenes/editar.png")}
                          style={styles.buttonImage}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigateToPDF(item.id)}
                        style={styles.buttonContainer}
                      >
                        <Image
                          source={require("../../Resources/imagenes/pdf.png")}
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
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: width * 0.06,
  },
  arrow: {
    borderWidth: 2,
    borderColor: "#007BFF",
    borderRadius: 100,
    padding: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    // marginHorizontal: 10,
  },
  warningIcon: {
    marginLeft: 10,
  },
  iconCheck: {
    backgroundColor: "white",
    borderRadius: 80,
  },
})

export default PrototypingReportStDone
