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

export const generatePDF = async (data) => {
  try {
    // Cargar el PDF desde la carpeta assets
    const asset = Asset.fromModule(
      require("../../assets/formato_servicio_prototipadoD.pdf")
    );
    await asset.downloadAsync(); // Asegura que el archivo esté disponible localmente

    const existingPdfBytes = await FileSystem.readAsStringAsync(
      asset.localUri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    const pdfDoc = await PDFDocument.load(
      Buffer.from(existingPdfBytes, "base64")
    );
    const pages = pdfDoc.getPages();
    const page = pages[0];

    // Coordenadas específicas para cada campo en el formulario
    const coordenadas = {
      nombre: { x: 38, y: 660 },
      correo: { x: 300, y: 660 },
      telefono: { x: 517, y: 660 },
      fecha: { x: 530, y: 717 },
      aplicacion: { x: 38, y: 625 },
      codigoAlumno: { x: 315, y: 624 },
      codigoProfesor: { x: 515, y: 624 },
      tipoProyecto: { x: 100, y: 580 },
      tipoPrototipo: { x: 100, y: 560 },
      descripcion: { x: 100, y: 540 },
      dimensiones: { x: 115, y: 371 },
      corteEspecial: { x: 128, y: 353 },
      otros: { x: 78, y: 336 },
      observaciones: { x: 130, y: 280 },
      carasPCB: { x: 78, y: 174 },
      material_proporcionado: { x: 78, y: 149.5 },
      material_requerido: { x: 173, y: 174 },
      comentarios_internos: { x: 313, y: 174 },
      fecha_aprovacion: { x: 80, y: 125 },
    };

    // Cambiar las coordenadas de tipoProyecto dinámicamente
    switch (data.project_type) {
      case "Licenciatura":
        coordenadas.tipoProyecto = { x: 345, y: 587 };
        break;
      case "Posgrado":
        coordenadas.tipoProyecto = { x: 440, y: 587 };
        break;
      case "Cuerpo académico":
        coordenadas.tipoProyecto = { x: 540, y: 587 };
        break;
      default:
        coordenadas.tipoProyecto = { x: 345, y: 587 }; // Valor por defecto
    }

    // Cambiar las coordenadas de tipoPrototipo dinámicamente
    switch (data.prototype_type) {
      case "impreso":
        coordenadas.tipoPrototipo = { x: 209, y: 500 };
        coordenadas.descripcion = { x: 240, y: 520 };
        break;
      case "tresD":
        coordenadas.tipoPrototipo = { x: 209, y: 434 };
        coordenadas.descripcion = { x: 240, y: 460 }; //y 460
        break;
      default:
        coordenadas.tipoPrototipo = { x: 209, y: 500 }; // Valor por defecto
        coordenadas.descripcion = { x: 209, y: 500 };
    }

    // Cambiar las coordenadas de Numero de caras PCB dinámicamente
    switch (data.internal_use_pcb_faces) {
      case 1:
        coordenadas.carasPCB = { x: 78, y: 174 };
        break;
      case 2:
        coordenadas.carasPCB = { x: 145, y: 174 };
        break;
      default:
        coordenadas.carasPCB; // Valor por defecto
    }

    // Cambiar las coordenadas de PCB proporcionado por el usuario dinámicamente
    switch (data.internal_use_pcb_provided_by_user) {
      case true:
        coordenadas.material_proporcionado = { x: 78, y: 149.5 };
        break;
      case false:
        coordenadas.material_proporcionado = { x: 145, y: 149.5 };
        break;
      default:
        coordenadas.material_proporcionado; // Valor por defecto
    }

    // Insertar datos
    page.drawText(String(data.applicant_name || ""), {
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
    const application = data.application || "";
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
    const descripcion = data.prototype_description || "";
    const maxCharsPerLineDescripcion = 63;
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
    page.drawText(String(data.specific_requirements_dimensions || ""), {
      x: coordenadas.dimensiones.x,
      y: coordenadas.dimensiones.y,
      size: 10,
      color: rgb(0, 0, 0),
    });
    page.drawText(
      String(data.specific_requirements_special_cut || "No especificado"),
      {
        x: coordenadas.corteEspecial.x,
        y: coordenadas.corteEspecial.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      String(data.specific_requirements_other || "No especificado"),
      {
        x: coordenadas.otros.x,
        y: coordenadas.otros.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      String(
        data.specific_requirements_comments || "Sin comentarios adicionales"
      ),
      {
        x: coordenadas.observaciones.x,
        y: coordenadas.observaciones.y,
        size: 10,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(String("X" || ""), {
      x: coordenadas.carasPCB.x,
      y: coordenadas.carasPCB.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String("X" || ""), {
      x: coordenadas.material_proporcionado.x,
      y: coordenadas.material_proporcionado.y,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Dentro de la función generatePDF, reemplaza la lógica de data.internal_use_required_inputs con esto:
    const requiredInputs = data.internal_use_required_inputs || "";
    const maxCharsPerLineRequiredInputs = 24; // Máximo de caracteres por línea para requiredInputs
    const maxChunksRequiredInputs = 2; // Máximo de partes (líneas) permitidas
    const requiredInputsChunks = splitStringIntoChunks(
      requiredInputs,
      maxCharsPerLineRequiredInputs,
      maxChunksRequiredInputs
    );

    // Dibujar cada parte de los materiales requeridos en una nueva línea
    requiredInputsChunks.forEach((chunk, index) => {
      page.drawText(chunk, {
        x: coordenadas.material_requerido.x,
        y: coordenadas.material_requerido.y - index * 15, // Ajusta la posición en Y para cada línea
        size: 10,
        color: rgb(0, 0, 0),
      });
    });

    // Dentro de la función generatePDF, reemplaza la lógica de data.internal_use_comments con esto:
    const internalUseComments = data.internal_use_comments || "";
    const maxCharsPerLineComments = 48; // Máximo de caracteres por línea para comments
    const maxChunksComments = 2; // Máximo de partes (líneas) permitidas
    const commentsChunks = splitStringIntoChunks(
      internalUseComments,
      maxCharsPerLineComments,
      maxChunksComments
    );

    // Dibujar cada parte de los comentarios internos en una nueva línea
    commentsChunks.forEach((chunk, index) => {
      page.drawText(chunk, {
        x: coordenadas.comentarios_internos.x,
        y: coordenadas.comentarios_internos.y - index * 15, // Ajusta la posición en Y para cada línea
        size: 10,
        color: rgb(0, 0, 0),
      });
    });

    page.drawText(String(data.prototype_approved_date || "No especificado"), {
      x: coordenadas.fecha_aprovacion.x,
      y: coordenadas.fecha_aprovacion.y,
      size: 10,
      color: rgb(0, 0, 0),
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
