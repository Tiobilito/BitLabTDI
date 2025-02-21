import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native"
import { useRoute } from "@react-navigation/native"
import {
  getCostsByOrderId,
  getOrderById,
} from "../../Modules/Operations DB Fixes"
import { CustomView } from "../components/CustomView"
import { Form, FloatingText, CustomButton } from "../../components"

const { width, height } = Dimensions.get("window")

const OrderPageReadOnly = ({ navigation }) => {
  const route = useRoute()
  const { idOrder } = route.params
  const [orderData, setOrderData] = useState(null)
  const [costData, setCostData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const order = await getOrderById(idOrder)
      const costs = await getCostsByOrderId(idOrder)

      setOrderData(order)
      setCostData(costs)
    }
    getData()
  }, [idOrder])

  useEffect(() => console.log("cost data -> ", costData), [costData])
  useEffect(() => console.log("order data -> ", orderData), [orderData])

  const renderItem = ({ item }) => (
    <View style={styles.costItem}>
      <FloatingText
        textStyle={{ color: "#1D1D1D" }}
        title="Nombre del costo"
        text={item.cost_name}
      />
      <FloatingText
        textStyle={{ color: "#1D1D1D" }}
        title="Precio"
        text={item.price}
      />
      <FloatingText
        textStyle={{ color: "#1D1D1D" }}
        title="IVA"
        text={item.iva ? "IVA incluido" : "Sin IVA"}
      />
      <FloatingText
        textStyle={{ color: "#1D1D1D" }}
        title="ID de la orden"
        text={item.order_id}
      />
    </View>
  )

  return (
    <CustomView>
      <View style={styles.body}>
        <Form bodyStyle={{ backgroundColor: "translucent" }} shadow={false}>
          <Text style={styles.title}>Reporte de orden</Text>
          {orderData && (
            <View style={styles.costItem}>
              <FloatingText
                textStyle={{ color: "#1D1D1D" }}
                title={"ID Dispositivo"}
                text={orderData.device_id}
              />
              <FloatingText
                textStyle={{ color: "#1D1D1D" }}
                title={"Cliente"}
                text={orderData.customer_id}
              />
              <FloatingText
                textStyle={{ color: "#1D1D1D" }}
                title={"Estado"}
                text={orderData.status}
              />
              <FloatingText
                textStyle={{ color: "#1D1D1D" }}
                title={"Fecha de Recepción"}
                text={orderData.date_received}
              />
              <FloatingText
                textStyle={{ color: "#1D1D1D" }}
                title={"Diagnóstico General"}
                text={orderData.diagnosis}
              />
            </View>
          )}
          {costData && (
            <FlatList
              scrollEnabled={false}
              data={costData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No hay costos registrados</Text>}
              contentContainerStyle={styles.flatlist}
            />
          )}
          <CustomButton
            title="Volver"
            onPress={() => navigation.goBack()}
            buttonStyles={{ backgroundColor: "#DC3545" }}
          />
        </Form>
      </View>
    </CustomView>
  )
}

const styles = StyleSheet.create({
  body: {
    marginTop: height * 0.14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#394f66",
    padding: width * 0.04,
    // marginBottom: -width * 0.06,
  },
  background: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    marginTop: 30,
  },
  text: {
    fontSize: width > 400 ? 50 : 20,
    marginBottom: 5,
    color: "#000000",
  },
  flatlist: {
    paddingBottom: 20,
  },
  costItem: {
    width: width * 0.8,
    padding: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
    borderRadius: 5,
  },
  costText: {
    fontSize: 16,
  },
})

export default OrderPageReadOnly
