import { number } from "prop-types";
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

// Función para obtener un registro basado en id_cliente
export async function getClientById(id_cliente) {
  const { data, error } = await supabase
    .from("users") // Cambia esto por el nombre real de tu tabla
    .select("*") // Selecciona todas las columnas
    .eq("code", id_cliente); // Filtra por id_cliente
  if (error) {
    console.error("Error al obtener registro:", error);
    return null;
  }
  if (data.length === 0) {
    console.log("No se encontró el cliente con id:", id_cliente);
    return null;
  }
  console.log("Registro del cliente:", data[0]); // Retorna el primer (y único) registro
  return data[0];
}

// Función para modificar un registro basado en id_cliente
export async function updateClient(id_cliente, updatedCliente) {
  const { data, error } = await supabase
    .from("users") // Cambia esto por el nombre real de tu tabla
    .update({
      name: updatedCliente.nombre,
      address: updatedCliente.direccion,
      zip_code: updatedCliente.cp,
      email: updatedCliente.correo,
      number: updatedCliente.telefono,
      second_number: updatedCliente.telefono2,
    })
    .eq("code", id_cliente); // Filtra por id_cliente
  if (error) {
    console.error("Error al actualizar registro:", error);
    return null;
  }
  console.log("Registro actualizado:", data);
  return data;
}

export async function AddClient(cliente) {
  const { data, error } = await supabase
    .from("users") // Cambia esto por el nombre real de tu tabla
    .insert([
      {
        code: cliente.codigo,
        name: cliente.nombre,
        address: cliente.direccion,
        zip_code: cliente.cp,
        email: cliente.correo,
        number: cliente.telefono,
        second_number: cliente.telefono2,
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
  const { data, error } = await supabase.from("devices").insert([
    {
      serial_number: dispositivo.sn,
      customer_id: dispositivo.id_cliente,
      device_type: dispositivo.tipo_dis,
      model: dispositivo.modelo,
      received_status: dispositivo.esta_recep,
      color: dispositivo.color,
      brand: dispositivo.marca,
      rework_description: dispositivo.caso,
      received_date: new Date(dispositivo.fecha),
      inventory_items: dispositivo.inventario,
    },
  ]);

  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }

  console.log("Registro añadido:", data);
  return data;
}

// Función para obtener todos los registros de la tabla dispositivo
export async function getAllDispositivos() {
  const { data, error } = await supabase
    .from('devices')
    .select('*'); // Selecciona todas las columnas
  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  //console.log('Registros de dispositivos:', data);
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
