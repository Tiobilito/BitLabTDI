import React, { useState, useCallback, useEffect, Fragment } from "react"
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
import { getAllProjectSubmissionsCheck } from "../../Modules/Operations DB Prototyping"
import { CustomViewReverse } from "../components/CustomViewReverse"
import Icon from "react-native-vector-icons/Ionicons"
import { GetUserData } from "../../Modules/DataInfo"
import { Info, StatusIndicator } from "../../Components"

const { width, height } = Dimensions.get("window")

const PrototypingCheck = ({ navigation }) => {
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
      const UData = await GetUserData()
      console.log("UserData -> ", UData)
      Data = await getAllProjectSubmissionsCheck(UData.User_type)
      console.log("Data -> ", Data)
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }))
      setData(BData)
      setFullData(BData)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      console.log("[x]Error -> ", error)
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
        <ActivityIndicator size="large" color="#095ea7" />
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

  const navigateToEditForm = (id) => {
    navigation.navigate("EditSubmission", { idReport: id })
  }

  const navigateToAlreadyChecked = () => {
    navigation.navigate("AlreadyCheckedReports")
  }

  const navigateToDone = () => {
    navigation.navigate("DoneReports")
  }

  return (
    <CustomViewReverse style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton} onPress={navigateToDone}>
            <Text style={styles.headerButtonText}>Reportes Cerrados</Text>
          </Pressable>
          <Pressable
            style={[styles.headerButton]}
            onPress={navigateToAlreadyChecked}
          >
            <Text style={styles.headerButtonText}>Reportes Revisados</Text>
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

        <View style={styles.flatListContainer}>
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
                    <View style={{marginLeft: -10 }}>
                      <StatusIndicator status={item.status} />
                    </View>
                  </View>

                  {/* Mostrar icono si los campos department_head, laboratory_head o service_staff son false */}

                  {/* Mostrar el icono de advertencia o el icono de aprobado */}
                  {!item.service_staff ? (
                    <Icon
                      name="timer-outline"
                      size={24}
                      color="#ffcc00"
                      style={styles.warningIcon}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle-outline"
                      size={24}
                      color="#10B981"
                    />
                  )}
                </TouchableOpacity>

                {item.Details && (
                  <View style={styles.details}>
                    <Info title="ID: " text={item.id} />
                    {/* <Text style={styles.detailText}>ID: {item.id}</Text> */}
                    <Info
                      title="Fecha de Solicitud: "
                      text={item.submission_date}
                    />
                    <Info
                      title="Teléfono de contacto: "
                      text={item.contact_phone}
                    />
                    <Info title="Proyecto: " text={item.application} />
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
                      {item.service_staff && ["finished", "delivered"].includes(item.status) ? (
                        <TouchableOpacity
                          onPress={() => navigateToPDF(item.id)}
                          style={styles.buttonContainer}
                        >
                          <Image
                            source={require("../../Resources/imagenes/pdf.png")}
                            style={styles.buttonImage}
                          />
                        </TouchableOpacity>
                        ) :
                        <View/>
                      }
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
  mainContainer: {
    // marginTop: -80,
    height: "90%",
    // flex: 1,
    // justifyContent: "center",
    // alignContent: "center",
  },

  // #region Header style
  header: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    // marginVertical: 1,
    // marginLeft: 160,
  },
  headerButton: {
    backgroundColor: "#2272A7",
    borderRadius: 12,
    height: 42,
    width: "30%",
    alignContent: "stretch",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 4,
    fontSize: 15,
  },

  //#region ScrollView style
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
  flatListContainer: {
    flex: 1,
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
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
  },
  warningIcon: {
    marginLeft: 10,
  },
})

export default PrototypingCheck
