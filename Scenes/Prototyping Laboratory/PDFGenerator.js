import { PDFDocument, rgb } from "pdf-lib";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { Buffer } from "buffer";

// Función para dividir una cadena en partes de máximo 55 caracteres, con un límite de 3 partes
const splitStringIntoChunks = (str, maxLength, maxChunks) => {
  const chunks = [];
  for (let i = 0; i < str.length && chunks.length < maxChunks; i += maxLength) {
    chunks.push(str.substring(i, i + maxLength));
  }
  return chunks;
};

const sanitizeText = (text) => text.replace(
    /([\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F1E6}-\u{1F1FF}])/gu,
    '[x]'
  );


export const generatePDF = async (data) => {
  try {
    // #region load PDF
    // Cargar el PDF desde la carpeta assets
    const asset = Asset.fromModule(
      require("../../assets/Formato_de_requerimiento_de_servicio_de_maquinado_de_prototipo.pdf")
    );
    await asset.downloadAsync(); // Asegura que el archivo esté disponible localmente
    
    const existingPdfBytes = await FileSystem.readAsStringAsync(
      asset.localUri,
      { encoding: FileSystem.EncodingType.Base64 }
    );
    
    const pdfDoc = await PDFDocument.load(
      Buffer.from(existingPdfBytes, "base64")
    );
    const pages = pdfDoc.getPages();
    const page = pages[0];
    
    // Coordenadas específicas para cada campo en el formulario
    const coordenadas = {
      nombre: { x: 20, y: 665  },
      correo: { x: 270, y: 665 },
      telefono: { x: 490, y: 665 },
      fecha: { x: 531, y: 703 }, //717
      aplicacion: { x: 20, y: 625 },
      codigoAlumno: { x: 270, y: 620 },
      codigoProfesor: { x: 490, y: 620 },
      tipoProyecto: { x: 0, y: 0 },
      tipoPrototipo: { x: 100, y: 560 },
      descripcion: { x: 260, y: 530 },
      dimensiones: { x: 90, y: 364 },
      corteEspecial: { x: 90, y: 347 },
      otros: { x: 90, y: 333 },
      observaciones: { x: 90, y: 282 },
      carasPCB: { x: 0, y: 0 },
      material_proporcionado: { x: 0, y: 0 },
      comentarios_internos: { x: 200, y: 182 },
      fecha_aprovacion: { x: 90, y: 125 },
      alerta: { x: 183, y: 240 },
    };
    
    // #region dynamic coordinates
    // Cambiar las coordenadas de tipoProyecto dinámicamente
    switch (data.project_type) {
      case "Licenciatura":
        coordenadas.tipoProyecto = { x: 325, y: 585 };
        // coordenadas.tipoProyecto = { x: 330, y: 585 };
        break;
      case "Posgrado":
        coordenadas.tipoProyecto = { x: 435, y: 585 };
        break;
      case "Cuerpo Academico":
        coordenadas.tipoProyecto = { x: 535, y: 585 };
        break;
      default:
        coordenadas.tipoProyecto = { x: 300, y: 585 }; // Valor por defecto
    }
    
    // Cambiar las coordenadas de tipoPrototipo dinámicamente
    switch (data.prototype_type) {
      case 1:
        coordenadas.tipoPrototipo = { x: 235, y: 505 };
        // coordenadas.tipoPrototipo = { x: 220, y: 495 };
        break;
      case 2:
        coordenadas.tipoPrototipo = { x: 235, y: 427 };
        // coordenadas.tipoPrototipo = { x: 209, y: 434 };
        break;
      default:
        coordenadas.tipoPrototipo = { x: 209, y: 500 }; // Valor por defecto
      }
      
    // Cambiar las coordenadas de Numero de caras PCB dinámicamente
    switch (data.internal_use_pcb_faces) {
      case 1:
        coordenadas.carasPCB = { x: 68, y: 187.5 };
        // coordenadas.carasPCB = { x: 78, y: 174 };
        break;
      case 2:
        coordenadas.carasPCB = { x: 145, y: 187.5 };
        // coordenadas.carasPCB = { x: 145, y: 174 };
        break;
      default:
        coordenadas.carasPCB = { x: 78, y: 174 };
    }
      
    // Cambiar las coordenadas de PCB proporcionado por el usuario dinámicamente
    switch (data.internal_use_pcb_provided_by_user) {
      case true:
        coordenadas.material_proporcionado = { x: 68, y: 157.5 };
        // coordenadas.material_proporcionado = { x: 78, y: 149.5 };
        break;
      case false:
        coordenadas.material_proporcionado = { x: 145, y: 157.5 };
        // coordenadas.material_proporcionado = { x: 145, y: 149.5 };
        break;
      default:
        coordenadas.material_proporcionado = { x: 78, y: 149.5 };
    }
    
    // #region insert data
    page.drawText(sanitizeText(String(data.applicant_name || "")), {
      x: coordenadas.nombre.x,
      y: coordenadas.nombre.y,
      size: 10,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.contact_email || ""), {
      x: coordenadas.correo.x,
      y: coordenadas.correo.y,
      size: 9,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.contact_phone || ""), {
      x: coordenadas.telefono.x,
      y: coordenadas.telefono.y,
      size: 10,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.submission_date || ""), {
      x: coordenadas.fecha.x,
      y: coordenadas.fecha.y,
      size: 9,
      color: rgb(0, 0, 0),
    });
    
    // Dividir la aplicación en partes de máximo 55 caracteres, con un límite de 3 partes
    const application = sanitizeText(data.application) || "";
    const maxCharsPerLineApplication = 36;
    const maxChunksApplication = 3;
    const applicationChunks = splitStringIntoChunks(
      application,
      maxCharsPerLineApplication,
      maxChunksApplication
    );

    // Dibujar cada parte de la aplicación en una nueva línea
    applicationChunks.forEach((chunk, index) => {
      page.drawText(chunk, {
        x: coordenadas.aplicacion.x,
        y: coordenadas.aplicacion.y - index * 15, // Ajusta la posición en Y para cada línea
        size: 10,
        color: rgb(0, 0, 0),
      });
    });

    if (data.student_user_code) {
      page.drawText(String(data.student_user_code), {
        x: coordenadas.codigoAlumno.x,
        y: coordenadas.codigoAlumno.y,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }

    if (data.professor_user_code) {
      page.drawText(String(data.professor_user_code), {
        x: coordenadas.codigoProfesor.x,
        y: coordenadas.codigoProfesor.y,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }

    page.drawText(String("X" || ""), {
      x: coordenadas.tipoProyecto.x,
      y: coordenadas.tipoProyecto.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String("X" || ""), {
      x: coordenadas.tipoPrototipo.x,
      y: coordenadas.tipoPrototipo.y,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Dividir la descripción en partes de máximo 68 caracteres, con un límite de 3 partes
    const descripcion = sanitizeText(data.prototype_description) || "";
    const maxCharsPerLineDescripcion = 58;
    const maxChunksDescripcion = 3;
    const descripcionChunks = splitStringIntoChunks(
      descripcion,
      maxCharsPerLineDescripcion,
      maxChunksDescripcion
    );

    // Dibujar cada parte de la descripción en una nueva línea
    descripcionChunks.forEach((chunk, index) => {
      page.drawText(chunk, {
        x: coordenadas.descripcion.x,
        y: coordenadas.descripcion.y - index * 15, // Ajusta la posición en Y para cada línea
        size: 10,
        color: rgb(0, 0, 0),
      });
    });

    // Resto de los campos
    page.drawText(sanitizeText(String(data.specific_requirements_dimensions || "")), {
      x: coordenadas.dimensiones.x,
      y: coordenadas.dimensiones.y,
      size: 10,
      color: rgb(0, 0, 0),
    });
    page.drawText(
      sanitizeText(String(data.specific_requirements_special_cut || "No especificado")),
      {
        x: coordenadas.corteEspecial.x,
        y: coordenadas.corteEspecial.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );
    // console.log("Draw special cut")
    // console.log("Otros requerimientos: ", data.specific_requirements_other);
    // console.log("Sanitizado: ", sanitizeText(data.specific_requirements_other));
    page.drawText(
      sanitizeText(String(data.specific_requirements_other || "No especificado")),
      {
        x: coordenadas.otros.x,
        y: coordenadas.otros.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      sanitizeText(String(data.specific_requirements_comments || "Sin comentarios adicionales")),
      {
        x: coordenadas.observaciones.x,
        y: coordenadas.observaciones.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );

    // Se pidio que no se agregara información en uso interno
    // page.drawText(String("X" || ""), {
    //   x: coordenadas.carasPCB.x,
    //   y: coordenadas.carasPCB.y,
    //   size: 12,
    //   color: rgb(0, 0, 0),
    // });
    // page.drawText(String("X" || ""), {
    //   x: coordenadas.material_proporcionado.x,
    //   y: coordenadas.material_proporcionado.y,
    //   size: 12,
    //   color: rgb(0, 0, 0),
    // });
    
    // // Dentro de la función generatePDF, reemplaza la lógica de data.internal_use_comments con esto:
    // const internalUseComments = sanitizeText(String(data.internal_use_comments)) || "";
    // const maxCharsPerLineComments = 48; // Máximo de caracteres por línea para comments
    // const maxChunksComments = 2; // Máximo de partes (líneas) permitidas
    // const commentsChunks = splitStringIntoChunks(
    //   internalUseComments,
    //   maxCharsPerLineComments,
    //   maxChunksComments
    // );

    // // Dibujar cada parte de los comentarios internos en una nueva línea
    // commentsChunks.forEach((chunk, index) => {
    //   page.drawText(chunk, {
    //     x: coordenadas.comentarios_internos.x,
    //     y: coordenadas.comentarios_internos.y - index * 15, // Ajusta la posición en Y para cada línea
    //     size: 10,
    //     color: rgb(0, 0, 0),
    //   });
    // });

    // page.drawText(String(data.prototype_approved_date || "No especificado"), {
    //   x: coordenadas.fecha_aprovacion.x,
    //   y: coordenadas.fecha_aprovacion.y,
    //   size: 10,
    //   color: rgb(0, 0, 0),
    // });

    // Mensaje de alerta
    page.drawText("RECIBIDO, SIN MODIFICACIONES", {
      x: coordenadas.alerta.x,
      y: coordenadas.alerta.y,
      size: 14,
      color: rgb(1, 0, 0),
    });

    // Guardar PDF modificado
    const pdfBytes = await pdfDoc.saveAsBase64();
    const pdfPath = `${FileSystem.documentDirectory}PrototypingReport.pdf`;
    await FileSystem.writeAsStringAsync(pdfPath, pdfBytes, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Compartir el PDF
    await Sharing.shareAsync(pdfPath);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
};
