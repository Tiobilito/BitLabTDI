import React, { useState, useCallback } from "react";
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
} from "react-native";
import filter from "lodash.filter";
import { useFocusEffect } from "@react-navigation/native";
import { getAllProjectSubmissions } from "../../Modules/Operations DB Prototyping";
import { GetUserData } from "../../Modules/DataInfo";
import { CustomViewReverse } from "../components/CustomViewReverse";
import Icon from "react-native-vector-icons/Ionicons";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const PrototypesOnStandby = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const userData = await GetUserData();
      const fetchedPrototypes = await getAllProjectSubmissions();
      const filteredPrototypes = filterPrototypesByRole(
        fetchedPrototypes,
        userData.User_type,
        userData.Code
      );

      setData(filteredPrototypes);
      setFullData(filteredPrototypes);
      setDataUser(userData);
    } catch (error) {
      setError("Error en la obtención de datos");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPrototypesByRole = (prototypes, role, userCode) => {
    let filteredPrototypes;

    switch (role) {
      case 0:
        filteredPrototypes = prototypes.filter(
          (p) => !p.department_head && p.status !== "rejected" // Excluir rechazados
        );
        break;
      case 1:
        filteredPrototypes = prototypes.filter(
          (p) =>
            p.department_head && !p.laboratory_head && p.status !== "rejected"
        );
        break;
      case 2:
        filteredPrototypes = prototypes.filter(
          (p) =>
            p.department_head &&
            p.laboratory_head &&
            !p.service_staff &&
            p.status !== "rejected"
        );
        break;
      case 3:
        filteredPrototypes = prototypes.filter(
          (p) => p.professor_user_code === userCode
        );
        break;
      case 4:
        filteredPrototypes = prototypes.filter(
          (p) => p.student_user_code === userCode
        );
        break;
      default:
        filteredPrototypes = [];
    }

    if (filteredPrototypes.length === 0) {
      alert("Sin solicitudes pendientes");
    }

    return filteredPrototypes;
  };

  const toggleDetails = (itemId) => {
    const updatedData = data.map((registro) => {
      if (registro.id === itemId) {
        return { ...registro, showDetails: !registro.showDetails };
      }
      return registro;
    });
    setData(updatedData);
  };

  const navigateToEditSubmission = (id, user) => {
    switch (user) {
      case 0:
      case 1:
        navigation.navigate("ReportCheck", { idReport: id });
        break;
      case 2:
      case 3:
      case 4:
        navigation.navigate("EditSubmission", { idReport: id });
        break;
      default:
        alert("Hola");
    }
  };

  const navigateToPDF = (id) => {
    navigation.navigate("GeneratePDF", { idReport: id });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const contains = ({ applicant_name, contact_email }, query) => {
    return (
      applicant_name.toLowerCase().includes(query.toLowerCase()) ||
      contact_email.toLowerCase().includes(query.toLowerCase())
    );
  };

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
            setSearchQuery(query);
            const filteredData = filter(fullData, (item) =>
              contains(item, query)
            );
            setData(filteredData);
          }}
          value={searchQuery}
          placeholder="Buscar contactos"
        />
        <View
          style={{
            width: WIDTH * 0.9,
            height: HEIGHT * 0.65,
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

                  {/* Verificar si alguno de los campos está pendiente */}
                  {item.status === "rejected" ? (
                    <Icon
                      name="close-circle-outline" // Ícono de rechazado
                      size={24}
                      color="#ff0000"
                      style={styles.rejectedIcon}
                    />
                  ) : !item.department_head ||
                    !item.laboratory_head ||
                    !item.service_staff ? (
                    <Icon
                      name="timer-outline" // Ícono de advertencia
                      size={24}
                      color="#ffcc00"
                      style={styles.warningIcon}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle-outline" // Ícono de aprobado
                      size={24}
                      color="00ff32"
                      style={styles.approvedIcon}
                    />
                  )}
                </TouchableOpacity>

                {item.showDetails && (
                  <View style={styles.details}>
                    <Text style={styles.detailText}>
                      Fecha de Solicitud: {item.submission_date}
                    </Text>
                    <Text style={styles.detailText}>
                      Teléfono de Contacto: {item.contact_phone}
                    </Text>
                    <Text style={styles.detailText}>
                      Proyecto: {item.application}
                    </Text>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToEditSubmission(item.id, dataUser.User_type)
                        }
                      >
                        <Image
                          source={require("../../Resources/imagenes/editar.png")}
                          style={styles.buttonImage}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigateToPDF(item.id)}>
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
  );
};

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
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
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
  toggleText: {
    fontSize: 18,
    color: "#ffffff",
    paddingHorizontal: 5,
  },
  details: {
    padding: 10,
    backgroundColor: "#095ea7",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
  buttonImage: {
    width: 24,
    height: 24,
  },
});

export default PrototypesOnStandby;
