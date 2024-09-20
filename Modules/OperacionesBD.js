import { supabase } from "./Supabase";
import { Alert } from "react-native";

export async function CheckUser(username, contraseña) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", username)
    .eq("password", contraseña);
  if (error) {
    console.log("hubo un error", error);
  }
  if (data.length > 0) {
    return true;
  } else {
    Alert.alert("Datos incorrectos");
    return false;
  }
}

// Función para obtener todos los registros de la tabla cliente
export async function getAllClients() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq("user_type", "Client"); // Selecciona todas las columnas

  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  //console.log('Registros de clientes:', data);
  return data;
}

// Obtener usuario por ID
export async function getClientById(id_cliente) {
  const { data, error } = await supabase
    .from("users") 
    .select("*")
    .eq("code", id_cliente); // Filtra por 'code' en lugar de 'id_cliente'
    
  if (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontró el usuario con el código:", id_cliente);
    return null;
  }
  return data[0];
}

// Actualizar usuario
export async function updateClient(id_cliente, updatedCliente) {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: updatedCliente.name,
      address: updatedCliente.address,
      zip_code: updatedCliente.zip_code,
      email: updatedCliente.email,
      number: updatedCliente.number,
      second_number: updatedCliente.second_number,
    })
    .eq("code", id_cliente);

  if (error) {
    console.error("Error al actualizar usuario:", error);
    return null;
  }
  return data;
}

export async function AddClient(cliente) {
  const { data, error } = await supabase
    .from("users") // Asegúrate de que "users" sea el nombre real de la tabla
    .insert([
      {
        code: cliente.code,            // Se toma del input del usuario
        name: cliente.name,            // Nombre en mayúsculas (ya procesado)
        address: cliente.address,      // Dirección
        zip_code: cliente.zip_code,    // Código postal
        email: cliente.email,          // Correo electrónico
        number: cliente.number,        // Teléfono
        second_number: cliente.second_number, // Otro teléfono
        password: cliente.password,    // Contraseña del usuario
        user_type: "Client",           // Tipo de usuario: "Client" (o lo que corresponda)
      },
    ]);
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  console.log("Registro añadido:", data);
  return data;
}


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
  const { data, error } = await supabase
    .from('devices')
    .select('*'); // Selecciona todas las columnas
  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  return data;
}

// Función para modificar un registro basado en id_dispo
export async function updateDispo(id_dispo, updatedDispositivo) {
  const { data, error } = await supabase
    .from("devices")
    .update({
      serial_number: updatedDispositivo.sn,
      customer_id: updatedDispositivo.id_cliente,
      device_type: updatedDispositivo.tipo_dis,
      model: updatedDispositivo.modelo,
      received_status: updatedDispositivo.esta_recep,
      color: updatedDispositivo.color,
      brand: updatedDispositivo.marca,
      rework_description: updatedDispositivo.caso,
      received_date: new Date(updatedDispositivo.fecha),
      inventory_items: updatedDispositivo.inventario,
    })
    .eq("id", id_dispo); // Filtra por id_dispo
  if (error) {
    console.error("Error al actualizar registro:", error);
    return null;
  }
  console.log("Registro actualizado:", data);
  return data;
}

// Función para obtener un registro basado en id_dispo
export async function getDispoById(id_dispo) {
  const { data, error } = await supabase
    .from("device")
    .select("*") // Selecciona todas las columnas
    .eq("id", id_dispo); // Filtra por id_dispo
  if (error) {
    console.error("Error al obtener registro:", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontró el dispositivo con id:", id_dispo);
    return null;
  }
  console.log("Registro del dispositivo:", data[0]); // Retorna el primer (y único) registro
  return data[0];
}

// Función para obtener todos los registros de la tabla departamentos
export async function getAllDepartamentos() {
  const { data, error } = await supabase
    .from('departments') 
    .select('*'); // Selecciona todas las columnas
  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  console.log('Registros de departamentos:', data);
  return data;
}
