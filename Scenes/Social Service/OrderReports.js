import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getCostsByOrderId, getOrderById } from "../../Modules/Operations DB Fixes";

const OrderPageReadOnly = ({ navigation }) => {
  const route = useRoute();
  const { idOrder } = route.params;
  const [ orderData, SetOrderData ] = useState(null);
  const [ costData, SetCostData ] = useState(null);

  useEffect(() => {
    const getData = async() => {
      SetOrderData(await getOrderById(idOrder));
      SetCostData(await getCostsByOrderId(idOrder));
      console.log(orderData);
      console.log(costData);
    }
    getData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>{item.description}</Text>
      <Text style={styles.costText}>${item.price}</Text>
      <Text style={styles.costText}>{item.iva ? "IVA incluido" : "Sin IVA"}</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.text}>ID Dispositivo: </Text>
            <Text style={styles.text}>Cliente: </Text>
            <Text style={styles.text}>Email: </Text>
            <Text style={styles.text}>Teléfono: </Text>
            <Text style={styles.text}>Departamento: </Text>
            <Text style={styles.text}>Estado: </Text>
            <Text style={styles.text}>Fecha de Recepción: </Text>
            <Text style={styles.text}>Diagnóstico General: </Text>
          </View>
        }
        data={cost.length > 0 ? cost : []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay costos registrados</Text>}
        contentContainerStyle={styles.flatlist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30,
  },
  container: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  flatlist: {
    paddingBottom: 20,
  },
  costItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
    borderRadius: 5,
  },
  costText: {
    fontSize: 16,
  },
});

export default OrderPageReadOnly;
