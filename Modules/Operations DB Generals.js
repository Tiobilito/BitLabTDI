import { supabase } from "./Supabase";

// Función para obtener todos los registros de la tabla departamentos
export async function getAllDepartamentos() {
  const { data, error } = await supabase.from("departments").select("*"); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  console.log("Registros de departamentos:", data);
  return data;
}
