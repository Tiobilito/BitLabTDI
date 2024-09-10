import { supabase } from "./Supabase";
import { Alert } from "react-native";

export async function CheckUser(username, contraseña) {
  const { data, error } = await supabase
    .from("empleado")
    .select("*")
    .eq("username", username)
    .eq("contra", contraseña);
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
    .from('cliente')
    .select('*'); // Selecciona todas las columnas

  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  console.log('Registros de clientes:', data);
  return data;
}

// Función para obtener un registro basado en id_cliente
export async function getClientById(id_cliente) {
  const { data, error } = await supabase
    .from("cliente") // Cambia esto por el nombre real de tu tabla
    .select("*") // Selecciona todas las columnas
    .eq("id_cliente", id_cliente); // Filtra por id_cliente
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
    .from("cliente") // Cambia esto por el nombre real de tu tabla
    .update({
      nombre: updatedCliente.nombre,
      direccion: updatedCliente.direccion,
      colonia: updatedCliente.colonia,
      ciudad: updatedCliente.ciudad,
      cp: updatedCliente.cp,
      correo: updatedCliente.correo,
      telefono: updatedCliente.telefono,
      telefono2: updatedCliente.telefono2,
    })
    .eq("id_cliente", id_cliente); // Filtra por id_cliente
  if (error) {
    console.error("Error al actualizar registro:", error);
    return null;
  }
  console.log("Registro actualizado:", data);
  return data;
}

export async function AddClient(cliente) {
  const { data, error } = await supabase
    .from("cliente") // Cambia esto por el nombre real de tu tabla
    .insert([
      {
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        colonia: cliente.colonia,
        ciudad: cliente.ciudad,
        cp: cliente.cp,
        correo: cliente.correo,
        telefono: cliente.telefono,
        telefono2: cliente.telefono2,
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
  const { data, error } = await supabase.from("dispositivo").insert([
    {
      id_cliente: dispositivo.id_cliente,
      modelo: dispositivo.modelo,
      estado_fisi: dispositivo.estado_fisi,
      esta_recep: dispositivo.esta_recep,
      color: dispositivo.color,
      marca: dispositivo.marca,
      caso: dispositivo.caso,
      fecha: dispositivo.fecha,
      inventario: dispositivo.inventario,
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
    .from('dispositivo')
    .select('*'); // Selecciona todas las columnas
  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  console.log('Registros de dispositivos:', data);
  return data;
}

// Función para modificar un registro basado en id_dispo
export async function updateDispo(id_dispo, updatedDispositivo) {
  const { data, error } = await supabase
    .from("dispositivo")
    .update({
      id_cliente: updatedDispositivo.id_cliente,
      modelo: updatedDispositivo.modelo,
      estado_fisi: updatedDispositivo.estado_fisi,
      esta_recep: updatedDispositivo.esta_recep,
      color: updatedDispositivo.color,
      marca: updatedDispositivo.marca,
      caso: updatedDispositivo.caso,
      fecha: updatedDispositivo.fecha,
      inventario: updatedDispositivo.inventario,
    })
    .eq("id_dispo", id_dispo); // Filtra por id_dispo
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
    .from("dispositivo")
    .select("*") // Selecciona todas las columnas
    .eq("id_dispo", id_dispo); // Filtra por id_dispo
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
    .from('departamento') 
    .select('*'); // Selecciona todas las columnas
  if (error) {
    console.error('Error al obtener registros:', error);
    return null;
  }
  console.log('Registros de departamentos:', data);
  return data;
}
