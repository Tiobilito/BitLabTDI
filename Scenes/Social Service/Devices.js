import React, { useState, useCallback } from "react"
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native"
import filter from "lodash.filter"
import { useRoute, useFocusEffect } from "@react-navigation/native"
import { getAllDevices } from "../../Modules/Operations DB Fixes"
import { CustomViewReverse } from "../components/CustomViewReverse"
import { Info } from "../../Components"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const DevicesPage = ({ navigation }) => {
  const route = useRoute()
  const { idClient } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [fullData, setFullData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      fetchData()
    }, [])
  )

  const fetchData = async () => {
    try {
      const Data = await getAllDevices()
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }))
      const filteredData = filter(BData, { customer_id: idClient })
      setData(filteredData)
      setFullData(filteredData)
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
        <Text style={styles.errorText}>Error in fetch data</Text>
      </View>
    )
  }

  const contains = ({ model }, query) => {
    return model && model.includes(query)
  }

  const navigateToEditDevice = (id) => {
    navigation.navigate("EditDevice", { idDevice: id })
  }

  const navigateToOrder = (id) => {
    navigation.navigate("Order", { idDevice: id })
  }

  const navigateToAddDevice = (id) => {
    navigation.navigate("AddDevice", { idCli: id })
  }

  return (
    <CustomViewReverse>
      <View
        style={{
          height: HEIGHT * 0.88,
          width: WIDTH * 0.9,
          marginTop: HEIGHT * 0.04,
        }}
      >
        <TextInput
          style={styles.searchBox}
          onChangeText={(query) => {
            setSearchQuery(query)
            const filteredData = filter(fullData, (item) =>
              contains(item, query)
            )
            setData(filteredData)
          }}
          value={searchQuery}
          placeholder="Buscar dispositivos"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigateToAddDevice(idClient)}
        >
          <Text style={styles.addButtonText}>Añadir Dispositivo</Text>
        </TouchableOpacity>
        <View
          style={{
            width: WIDTH * 0.9,
            height: HEIGHT * 0.7,
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
                    <Text style={styles.modelText}>Modelo: {item.model}</Text>
                    <Text style={styles.idText}> Id: {item.id}</Text>
                  </View>
                </TouchableOpacity>
                {item.Details && (
                  <View style={styles.details}>
                    <Info title="ID Cliente: " text={item.customer_id} />
                    <Info title="S/N: " text={item.serial_number} />
                    <Info
                      title="Descripción reparación: "
                      text={item.rework_description}
                    />
                    <Info title="Tipo: " text={item.device_type} />
                    <Info
                      title="Estado recibido: "
                      text={item.received_status}
                    />
                    <Info title="Marca: " text={item.brand} />
                    <Info title="Color: " text={item.color} />
                    <Info title="Inventario: " text={item.inventory_items} />
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() => navigateToEditDevice(item.id)}
                        style={styles.buttonContainer}
                      >
                        <Image
                          source={require("../../Resources/imagenes/editar.png")}
                          style={styles.buttonImage}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigateToOrder(item.id)}
                        style={styles.buttonContainer}
                      >
                        <Image
                          source={require("../../Resources/imagenes/orden.png")}
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
  background: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 30,
  },
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
  itemContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#2272A7",
    borderRadius: 8,
  },
  item: {
    padding: 10,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  modelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  idText: {
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
    // marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#2272A7",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
})

export default DevicesPage
