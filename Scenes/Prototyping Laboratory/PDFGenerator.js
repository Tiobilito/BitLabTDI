import { PDFDocument, rgb } from "pdf-lib";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { Buffer } from "buffer";
import * as WebBrowser from "expo-web-browser";

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
    page.drawText(String(data.application || ""), {
      x: coordenadas.aplicacion.x,
      y: coordenadas.aplicacion.y,
      size: 10,
      color: rgb(0, 0, 0),
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
    page.drawText(String(data.prototype_description || ""), {
      x: coordenadas.descripcion.x,
      y: coordenadas.descripcion.y,
      size: 10,
      color: rgb(0, 0, 0),
    });
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
