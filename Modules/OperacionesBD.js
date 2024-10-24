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

// Función para obtener todos los registros de la tabla cliente
export async function getAllClients() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_type", 4); // Selecciona todas las columnas

  if (error) {
    console.error("Error al obtener registros:", error);
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
        code: cliente.code, // Se toma del input del usuario
        name: cliente.name, // Nombre en mayúsculas (ya procesado)
        address: cliente.address, // Dirección
        zip_code: cliente.zip_code, // Código postal
        email: cliente.email, // Correo electrónico
        number: cliente.number, // Teléfono
        second_number: cliente.second_number, // Otro teléfono
        password: cliente.password, // Contraseña del usuario
        user_type: 4, // Tipo de usuario: "Client" (o lo que corresponda)
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

// Función para obtener un registro basado en id
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

// Función para modificar un registro basado en id
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

//Funcion para añadir un reporte en la tabla project submissions
export async function addProjectSub(Project) {
  const { data, error } = await supabase.from("project_submissions").insert([
    {
      submission_date: Project.submission_date,
      applicant_name: Project.applicant_name,
      contact_email: Project.contact_email,
      contact_phone: Project.contact_phone,
      application: Project.application,
      student_user_code: Project.student_user_code,
      professor_user_code: Project.professor_user_code,
      project_type: Project.project_type,
      prototype_type: Project.prototype_type,
      prototype_description: Project.prototype_description,
      specific_requirements_dimensions:
        Project.specific_requirements_dimensions,
      specific_requirements_special_cut:
        Project.specific_requirements_special_cut,
      specific_requirements_other: Project.specific_requirements_other,
      specific_requirements_comments: Project.specific_requirements_comments,
      internal_use_pcb_faces: Project.internal_use_pcb_faces,
      internal_use_pcb_provided_by_user:
        Project.internal_use_pcb_provided_by_user,
      internal_use_required_inputs: Project.internal_use_required_inputs,
      internal_use_comments: Project.internal_use_comments,
      prototype_approved_date: Project.prototype_approved_date,
      prototype_approved_signature: Project.prototype_approved_signature,
      prototype_delivered_date: Project.prototype_delivered_date,
      prototype_delivered_signature: Project.prototype_delivered_signature,
      department_head: Project.department_head,
      laboratory_head: Project.laboratory_head,
      service_staff: Project.service_staff,
    },
  ]);
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  console.log("Registro añadido:", data);
  return data;
}

export async function addOrder(Order) {
  const { data, error } = await supabase.from("orders").insert([
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
  ]).select('id'); // Selecciona el campo 'id'
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

// Función para obtener todos los registros de la tabla project_submissions
export async function getAllProjectSubmissions() {
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*"); // Selecciona todas las columnas

  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  console.log("Registros de project submissions:", data);
  return data;
}
