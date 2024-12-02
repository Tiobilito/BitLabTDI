import { supabase } from "./Supabase";

//Project Submissions
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
      status: Project.status,
    },
  ]);
  if (error) {
    console.error("Error al insertar registro:", error);
    return null;
  }
  console.log("Registro añadido:", data);
  return data;
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
  return data;
}

// Función para obtener todos los registros de la tabla orders relacionadas con un usuario en especifico
export async function getAllProjectSubmissionsByUserId(idUser) {
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*")
    .or(`student_user_code.eq.${idUser},professor_user_code.eq.${idUser}`); // Selecciona todas las columnas
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  return data;
}

//Funcion para obtener todas las solicitudes de prototipo con status "awaiting_revision"
export async function getPrototypeStandby() {
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("status", "awaiting_revision"); // Selecciona todas las columnas

  if (error) {
    console.error("Error al obtener solicitudes:", error);
    return null;
  }
  //console.log("Registros de clientes:", data);
  return data;
}

// Función para obtener una solicitud de prototipo por ID
export async function getPrototypeById(id) {
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*")
    .eq("id", id) // Filtra por el ID recibido
    .single(); // Asegúrate de obtener solo un registro

  if (error) {
    console.error("Error al obtener la solicitud:", error);
    return null; // Manejo de errores
  }
  return data; // Retorna el registro encontrado
}

// Función para actualizar un reporte en la tabla project_submissions
export async function updateProjectSub(idReport, Project) {
  const { data, error } = await supabase
    .from("project_submissions")
    .update({
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
      status: Project.status,
    })
    .eq("id", idReport); // Asegúrate de que "id" sea la columna identificadora

  if (error) {
    console.error("Error al actualizar el registro:", error);
    return null;
  }
  console.log("Registro actualizado:", data);
  return data;
}

//----------------------------------------------------------------------------

//Checks
// Función para obtener registros de project_submissions basados en el userType (y así hacer la verificación en cascada)
export async function getAllProjectSubmissionsCheck(userType) {
  let query = supabase.from("project_submissions").select("*");
  // Configura la consulta según el userType
  if (userType === 0) {
    console.log("department_head");
    query = query.or("department_head.is.null"); // Solo registros con null
  } else if (userType === 2) {
    console.log("laboratory_head");
    query = query
      .eq("department_head", true)
      .or("laboratory_head.is.null"); // Solo registros con null
  } else if (userType === 3) {
    console.log("service_staff");
    query = query
      .eq("department_head", true)
      .eq("laboratory_head", true)
      .or("service_staff.is.null"); // Solo registros con null
  } else {
    console.error("Tipo de usuario no válido");
    return null;
  }
  // Ejecuta la consulta
  const { data, error } = await query;
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  console.log("Registros obtenidos:", data);
  return data;
}


// Función para obtener registros de project_submissions basados en el userType
export async function getAllProjectSubmissionsChecked(userType) {
  let query = supabase.from("project_submissions").select("*");
  // Configura la consulta según el userType
  if (userType === 0) {
    console.log("department_head");
    query = query
      .not("department_head", "is", null);
  } else if (userType === 2) {
    console.log("laboratory_head");
    query = query
      .eq("department_head", true)
      .not("laboratory_head", "is", null);
  } else if (userType === 3) {
    console.log("service_staff");
    query = query
      .eq("department_head", true)
      .eq("laboratory_head", true)
      .not("service_staff", "is", null);
  } else {
    console.error("Tipo de usuario no válido");
    return null;
  }
  // Ejecuta la consulta
  const { data, error } = await query;
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  console.log("Registros obtenidos:", data);
  return data;
}

// Función para obtener todos los registros de project submissions en los que status sea aproved o disapproved
export async function getAllProjectSubmissionsFinished() {
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*") // Selecciona todas las columnas
    .in("status", ["aproved", "disapproved"]); // Filtra por 'aproved' o 'disapproved'
  if (error) {
    console.error("Error al obtener registros:", error);
    return null;
  }
  return data;
}

// Función para modificar un registro en project_submissions basado en el id y el userType
export async function updateProjectCheck(id, check, userType) {
  let updateField = {};
  // Configura el campo a actualizar según el userType
  if (userType == 0) {
    console.log("department_head");
    updateField = { department_head: check };
  } else if (userType == 2) {
    console.log("laboratory_head");
    updateField = { laboratory_head: check };
  } else if (userType == 3) {
    console.log("service_staff");
    updateField = { service_staff: check };
  } else {
    console.error("Tipo de usuario no válido");
  }
  // Realiza la actualización en la tabla
  const { data, error } = await supabase
    .from("project_submissions")
    .update(updateField)
    .eq("id", id);
  if (error) {
    console.error("Error al actualizar el registro:", error);
  }
  console.log("Registro actualizado:", data);
}
