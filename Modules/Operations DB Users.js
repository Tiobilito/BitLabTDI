import { supabase } from "./Supabase";
import { Alert } from "react-native";

export async function CheckUser(code, contraseña) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("code", code)
    .eq("password", contraseña);
  if (error) {
    console.log("hubo un error", error);
  }
  if (data.length > 0) {
    return data[0];
  } else {
    Alert.alert("Datos incorrectos");
    return null;
  }
}

export async function CheckUserCode(code) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("name", code);
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

// Función para obtener todos los registros de usuarios denominados clientes (Maestros y alumnos)
export async function getAllClientUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("user_type", [3, 4]); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  //console.log('Registros de clientes:', data);
  return data;
}

// Obtener usuario por ID
export async function getUserById(id_user) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("code", id_user); // Filtra por 'code' en lugar de 'id_cliente'
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
export async function updateUser(id_cliente, updatedUser) {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: updatedUser.name,
      address: updatedUser.address,
      zip_code: updatedUser.zip_code,
      email: updatedUser.email,
      number: updatedUser.number,
      second_number: updatedUser.second_number,
    })
    .eq("code", id_cliente);
  if (error) {
    console.error("Error al actualizar usuario:", error);
    return null;
  }
  return data;
}

// Función para añadir un usuario
export async function addUser(user) {
  const VerifyCode = await CheckUserCode(user.code);
  if (VerifyCode == false) {
    console.log("Datos del nuevo usuario", user);
    const { data, error } = await supabase.from("users").insert([
      {
        code: parseInt(user.code, 10),
        name: user.name,
        user_type: parseInt(user.user_type, 10),
        address: user.address,
        zip_code: user.zip_code,
        email: user.email,
        nss: user.nss,
        rfc: user.rfc,
        number: user.number,
        second_number: user.second_number,
        salary: parseInt(user.salary, 10),
        password: user.password,
        department_id: user.department_id,
      },
    ]);
    if (error) {
      console.error("Error al insertar registro:", error);
      return null;
    }
    console.log("Registro añadido:", data);
    return data;
  } else {
    Alert.alert("Codigo duplicado");
  }
}

// Función para obtener todos los registros de la tabla departamentos
export async function getAllTeachers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_type", 3); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  console.log("Registros de profesores:", data);
  return data;
}

