import { BASE_URL } from "../constants/base-url";
import axios from "axios";

let nowStr = new Date().toISOString().replace(/T.*$/, "");

const eventColors = {
  pendiente: {
    backgroundColor: "#F5EDD9",
    borderColor: "#834E00",
    statusColor: "#FF9900",
  },
  ausente: {
    backgroundColor: "#FFCCCB",
    borderColor: "#FF0000",
    statusColor: "#FF0000",
  },
  confirmado: {
    backgroundColor: "#E4ECFF",
    borderColor: "#006AF5",
    statusColor: "#006AF5",
  },
  reprogramar: {
    backgroundColor: "#F9ECFF",
    borderColor: "#3D005A",
    statusColor: "#AD00FF",
  },
  presente: {
    backgroundColor: "#D9F5E0",
    borderColor: "#3ab258",
    statusColor: "#34C759",
  },
};

const formatEvents = (events) => {
  return events.map((event) => ({
    id: event.id,
    title: `${event.paciente_nombre_completo}`,
    start: `${nowStr}T${event.time}`,
    /* end: `${event.fecha}T${event.hasta}`, */
    color: `${event.color}`,
    extendedProps: {
      terapeuta: event.terapeuta_nombre_completo,
      estado: event.estado,
      especialidad: event.especialidad_descripcion,
    },
  }));
};

export const getAppointments = async ({ id }) => {
  try {
    const response = await axios.get(`${BASE_URL}appointments/dentist/${id}`);
    if (response.data && Array.isArray(response.data)) {
      return formatEvents(response.data);
    } else {
      throw new Error("El formato de los datos no es correcto");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

