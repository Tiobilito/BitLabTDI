import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getPrototypeById } from "../../Modules/Operations DB Prototyping";
import { generatePDF } from "./PDFGenerator"; // Archivo PDFGenerator.js que genera el PDF

export default function GeneratePrototypePDF() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idReport } = route.params;

  const formatApprovedDate = (date) => {
    const parts = date.split("-");
    const shortAge = parts[0].slice("2");
    return `${parts[2]}       ${parts[1]}       ${shortAge}`;
  }
  
  const formatSubmissionDate = (date) => {
    const parts = date.split("-");
    const shortAge = parts[0].slice("2");
    return `${parts[2]}  ${parts[1]}  ${shortAge}`;
  }

  useEffect(() => {
    const fetchDataAndGeneratePDF = async () => {
      try {
        let fetchedData = await getPrototypeById(idReport); // Obtiene los datos del reporte

        // Formato de fechas
        const approved_date = formatApprovedDate(fetchedData.prototype_approved_date)
        const submission_date = formatSubmissionDate(fetchedData.submission_date)
        
        // Si no hay datos registrados volverlos string vacios
        const comments = fetchedData.internal_use_comments === null ? "Sin observaciones" : fetchedData.internal_use_comments

        fetchedData = {...fetchedData, prototype_approved_date: approved_date }
        fetchedData = {...fetchedData, submission_date: submission_date }
        fetchedData = {...fetchedData, internal_use_comments: comments }
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
