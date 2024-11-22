import { supabase } from "./Supabase";

//Devices
// Función para añadir un registro
export async function addDispo(dispositivo) {
  console.log("Datos del nuevo dispositivo:", dispositivo);
  const { data, error } = await supabase.from("devices").insert([
    {
      serial_number: dispositivo.sn,
      customer_id: dispositivo.customer_id,
      device_type: dispositivo.device_type,
      model: dispositivo.model,
      received_status: dispositivo.received_status,
      color: dispositivo.color,
      brand: dispositivo.brand,
      rework_description: dispositivo.rework_description,
      received_date: new Date(dispositivo.received_date),
      inventory_items: dispositivo.inventory_items,
    },
  ]);
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  console.log("Registro añadido:", data);
  return data;
}

// Función para obtener todos los registros de la tabla devices
export async function getAllDevices() {
  const { data, error } = await supabase.from("devices").select("*"); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  return data;
}

// Función para obtener un registro device tomando como referencia el id
export async function getDispoById(id) {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error("Error al obtener registro:", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontró el dispositivo con id:", id);
    return null;
  }
  console.log("Registro del dispositivo:", data[0]);
  return data[0];
}

// Función para modificar un registro device tomando como referencia el id
export async function updateDispo(id, updatedDevice) {
  const { data, error } = await supabase
    .from("devices")
    .update({
      serial_number: updatedDevice.sn,
      customer_id: updatedDevice.id_cliente,
      device_type: updatedDevice.tipo_dis,
      model: updatedDevice.modelo,
      received_status: updatedDevice.esta_recep,
      color: updatedDevice.color,
      brand: updatedDevice.marca,
      rework_description: updatedDevice.caso,
      received_date: new Date(updatedDevice.fecha),
      inventory_items: updatedDevice.inventario,
    })
    .eq("id", id);
  if (error) {
    console.error("Error al actualizar registro:", error);
    return null;
  }
  console.log("Registro actualizado:", data);
  return data;
}

//----------------------------------------------------------------------------

//Orders
//Añade una orden de reparacion a la tabla orders
export async function addOrder(Order) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_id: Order.customer_id,
        department_id: Order.department_id,
        device_id: Order.device_id,
        date_received: Order.date_received,
        closing_date: Order.closing_date,
        status: Order.status,
        total: Order.total,
        diagnosis: Order.diagnosis,
        payment_type: Order.payment_type,
      },
    ])
    .select("id"); // Selecciona el campo 'id'
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  if (data && data.length > 0) {
    console.log("ID de la nueva orden:", data[0].id);
    return data[0].id; // Retorna el ID de la orden insertada
  }
  return null;
}

// Función para obtener todos los registros de la tabla orders relacionadas con un usuario en especifico
export async function getAllOrdersByUserId(idUser) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", idUser); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  return data;
}

//Funcion que retorna todo el contenido de una orden tomando como referencia el id de la orden
export async function getOrderById(OrderId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", OrderId);
  if (error) {
    console.error("Error al obtener registro:", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontró la orden con el id:", id);
    return null;
  }
  console.log("Registro de la orden: ", data[0]);
  return data[0];
}

//Añade un costo a la tabla costs con la llave foranea a la que se asocia (id de la orden de reparacion)
export async function addCostSupa(Cost, OrderId) {
  const { data, error } = await supabase.from("costs").insert([
    {
      cost_name: Cost.description,
      price: Cost.price,
      order_id: parseInt(OrderId, 10),
      iva: Cost.iva,
    },
  ]);
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  console.log("Registro añadido:", data);
  return data;
}

//Retorna todos los costes relacionados con una orden
export async function getCostsByOrderId(OrderId) {
  const { data, error } = await supabase
    .from("costs")
    .select("*")
    .eq("order_id", OrderId);
  if (error) {
    console.error("Error al obtener los registros: ", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontraron los costos o no existen");
    return null;
  }
  console.log("Costos: ", data[0]);
  return data[0];
}
