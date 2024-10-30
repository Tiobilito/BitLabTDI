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
import { getPrototypeStndby } from "../../Modules/OperacionesBD";
import { CustomViewReverse } from "../components/CustomViewReverse";
import PDFGenerator from "./PDFGenerator";
import PrototypingFormReadOnly from "./PrototypingFormReadOnly";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const PrototypesOnStandby = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const Data = await getPrototypeStndby();
      const BData = Data.map((registro) => ({
        ...registro,
        Details: false,
      }));
      setData(BData);
      setFullData(BData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
      setIsLoading(false);
    }
  };

  const toggleDetails = (item) => {
    navigation.navigate("PrototypingFormReadOnly");
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
        <Text style={styles.errorText}>Error en la obtención de datos</Text>
      </View>
    );
  }

  const contains = ({ applicant_name, contact_email }, query) => {
    return (
      applicant_name.toLowerCase().includes(query.toLowerCase()) ||
      contact_email.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleGeneratePDF = (item) => {
    setSelectedData(item); // Guarda los datos seleccionados para pasar al generador de PDF
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
            height: HEIGHT * 0.8,
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
                  <View style={styles.avatarContainer}>
                    <Image
                      source={
                        item.avatar
                          ? { uri: item.avatar }
                          : require("../../Resources/imagenes/default-avatar.jpg")
                      }
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.applicant_name}>
                      {item.applicant_name}
                    </Text>
                    <Text style={styles.contact_email}>
                      {item.contact_email}
                    </Text>
                  </View>
                </TouchableOpacity>
                {item.Details && (
                  <View style={styles.details}>
                    <Text style={styles.detailText}>
                      Fecha de solicitud: {item.submission_date}
                    </Text>
                    {/* Verifica si hay un código de estudiante */}
                    {item.student_user_code ? (
                      <Text style={styles.detailText}>
                        Codigo: {item.student_user_code}
                      </Text>
                    ) : (
                      ""
                    )}
                    {/* Verifica si hay un código de profesor */}
                    {item.professor_user_code ? (
                      <Text style={styles.detailText}>
                        Codigo de Profesor: {item.professor_user_code}
                      </Text>
                    ) : (
                      ""
                    )}
                    <Text style={styles.detailText}>
                      Teléfono: {item.contact_phone}
                    </Text>
                    <Text style={styles.detailText}>
                      Tipo de proyecto: {item.project_type}
                    </Text>
                    <Text style={styles.detailText}>
                      Aplicación del proyecto: {item.application}
                    </Text>
                    <Text style={styles.detailText}>
                      Descripción del prototipo: {item.prototype_description}
                    </Text>
                    <Text style={styles.detailText}>
                      Dimensiones específicas:{" "}
                      {item.specific_requirements_dimensions}
                    </Text>
                    {/* Verifica si hay algún corte especial */}
                    {item.specific_requirements_special_cut ? (
                      <Text style={styles.detailText}>
                        Corte especial: {item.specific_requirements_special_cut}
                      </Text>
                    ) : (
                      ""
                    )}
                    {/* Verifica si hay algún requerimiento extra */}
                    {item.specific_requirements_other ? (
                      <Text style={styles.detailText}>
                        Otros: {item.specific_requirements_other}
                      </Text>
                    ) : (
                      ""
                    )}
                    {/* Verifica si hay algúna observación extra */}
                    {item.specific_requirements_comments ? (
                      <Text style={styles.detailText}>
                        Observaciónes: {item.specific_requirements_comments}
                      </Text>
                    ) : (
                      ""
                    )}

                    {/* Botón para generar PDF */}
                    <TouchableOpacity
                      onPress={() => handleGeneratePDF(item)}
                      style={styles.generatePDFButton}
                    >
                      <Text style={styles.buttonText}>Generar PDF</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </View>
        {/* Renderiza el componente PDFGenerator solo si hay datos seleccionados */}
        {selectedData && <PDFGenerator data={selectedData} />}
      </View>
    </CustomViewReverse>
  );
};

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
    //overflow: "hidden",
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
    resizeMode: "cover",
  },
  info: {
    flex: 1,
  },
  applicant_name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  contact_email: {
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
  buttonImage: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
  generatePDFButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default PrototypesOnStandby;
