import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getPrototypeById } from "../../Modules/Operations DB Prototyping";
import { generatePDF } from "./PDFGenerator"; // Archivo PDFGenerator.js que genera el PDF

export default function GeneratePrototypePDF() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idReport } = route.params;

  useEffect(() => {
    const fetchDataAndGeneratePDF = async () => {
      try {
        const fetchedData = await getPrototypeById(idReport); // Obtiene los datos del reporte
        await generatePDF(fetchedData); // Genera y comparte el PDF
      } catch (error) {
        Alert.alert("Error", "No se pudo generar el PDF: " + error.message);
      } finally {
        navigation.goBack(); // Regresar automáticamente a la pantalla anterior
      }
    };

    fetchDataAndGeneratePDF();
  }, [idReport, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#2272A7" />
    </View>
  );
}
