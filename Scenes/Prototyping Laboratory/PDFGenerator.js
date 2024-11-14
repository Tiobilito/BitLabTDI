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
      require("../../assets/formato_servicio_prototipado.pdf")
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
      nombre: { x: 41, y: 660 },
      correo: { x: 305, y: 660 },
      telefono: { x: 517, y: 660 },
      aplicacion: { x: 100, y: 640 },
      codigoAlumno: { x: 100, y: 620 },
      codigoProfesor: { x: 100, y: 600 },
      tipoProyecto: { x: 100, y: 580 },
      tipoPrototipo: { x: 100, y: 560 },
      descripcion: { x: 100, y: 540 },
      dimensiones: { x: 100, y: 520 },
      corteEspecial: { x: 100, y: 500 },
      otros: { x: 100, y: 480 },
      observaciones: { x: 100, y: 460 },
    };

    // Insertar datos
    page.drawText(String(data.applicant_name || ""), {
      x: coordenadas.nombre.x,
      y: coordenadas.nombre.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.contact_email || ""), {
      x: coordenadas.correo.x,
      y: coordenadas.correo.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.contact_phone || ""), {
      x: coordenadas.telefono.x,
      y: coordenadas.telefono.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.application || ""), {
      x: coordenadas.aplicacion.x,
      y: coordenadas.aplicacion.y,
      size: 12,
      color: rgb(0, 0, 0),
    });

    if (data.student_user_code) {
      page.drawText(String(data.student_user_code), {
        x: coordenadas.codigoAlumno.x,
        y: coordenadas.codigoAlumno.y,
        size: 12,
        color: rgb(0, 0, 0),
      });
    }

    if (data.professor_user_code) {
      page.drawText(String(data.professor_user_code), {
        x: coordenadas.codigoProfesor.x,
        y: coordenadas.codigoProfesor.y,
        size: 12,
        color: rgb(0, 0, 0),
      });
    }

    page.drawText(String(data.project_type || ""), {
      x: coordenadas.tipoProyecto.x,
      y: coordenadas.tipoProyecto.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.prototype_type || ""), {
      x: coordenadas.tipoPrototipo.x,
      y: coordenadas.tipoPrototipo.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.prototype_description || ""), {
      x: coordenadas.descripcion.x,
      y: coordenadas.descripcion.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(data.specific_requirements_dimensions || ""), {
      x: coordenadas.dimensiones.x,
      y: coordenadas.dimensiones.y,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(
      String(data.specific_requirements_special_cut || "No especificado"),
      {
        x: coordenadas.corteEspecial.x,
        y: coordenadas.corteEspecial.y,
        size: 12,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      String(data.specific_requirements_other || "No especificado"),
      {
        x: coordenadas.otros.x,
        y: coordenadas.otros.y,
        size: 12,
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
        size: 12,
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
    await WebBrowser.openBrowserAsync(pdfPath);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
};
