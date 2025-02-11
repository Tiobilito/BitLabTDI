import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getCostsByOrderId, getOrderById } from "../../Modules/Operations DB Fixes";
import { CustomView } from "../components/CustomView";

const Scale = Dimensions.get("window").width;

const OrderPageReadOnly = ({ navigation }) => {
  const route = useRoute();
  const { idOrder } = route.params;
  const [orderData, setOrderData] = useState(null);
  const [costData, setCostData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const order = await getOrderById(idOrder);
      const costs = await getCostsByOrderId(idOrder);
      setOrderData(order);
      setCostData(costs);
      console.log("Orden: ", orderData);
      console.log("Costos: ", costData);
    };
    getData();
  }, [idOrder]);

  const renderItem = ({ item }) => (
    <View style={styles.costItem}>
      <Text style={styles.costText}>Nombre del costo: {item.cost_name}</Text>
      <Text style={styles.costText}>Precio: ${item.price}</Text>
      <Text style={styles.costText}>IVA: {item.iva ? "IVA incluido" : "Sin IVA"}</Text>
      <Text style={styles.costText}>ID de la orden: {item.order_id}</Text>
    </View>
  );

  return (
    <CustomView>
      {orderData && (
        <View style={styles.container}>
          <Text style={styles.text}>ID Dispositivo: {orderData.device_id}</Text>
          <Text style={styles.text}>Cliente: {orderData.customer_id}</Text>
          <Text style={styles.text}>Estado: {orderData.status}</Text>
          <Text style={styles.text}>Fecha de Recepción: {orderData.date_received}</Text>
          <Text style={styles.text}>Diagnóstico General: {orderData.diagnosis}</Text>
        </View>
      )}
      <FlatList
        data={costData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No hay costos registrados</Text>}
        contentContainerStyle={styles.flatlist}
      />
    </CustomView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30,
  },
  container: {
    width: "95%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    marginTop: 36,
  },
  text: {
    fontSize: Scale > 400 ? 50 : 20,
    marginBottom: 5,
    color: "#000000",
  },
  flatlist: {
    paddingBottom: 20,
  },
  costItem: {
    flexDirection: "column",
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