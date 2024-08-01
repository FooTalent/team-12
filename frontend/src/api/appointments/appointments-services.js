import { BASE_URL } from "../constants/base-url";
import axios from "axios";

let nowStr = new Date().toISOString().replace(/T.*$/, "");

/* const eventColors = {
  pendiente: { backgroundColor: "#FF9900", borderColor: "#834E00" },
  ausente: { backgroundColor: "#FFCCCB", borderColor: "#FF0000" },
  confirmado: { backgroundColor: "#006AF5", borderColor: "#006AF5" },
  reprogramar: { backgroundColor: "#AD00FF", borderColor: "#3D005A" },
  presente: { backgroundColor: "#34C759", borderColor: "#3ab258" },
}; */
const eventColors = {
  pendiente: {
    backgroundColor: "#F5EDD9",
    borderColor: "#834E00",
    statusColor: "#FF9900",
  },
  cancelled: {
    backgroundColor: "#FFCCCB",
    borderColor: "#FF0000",
    statusColor: "#FF0000",
  },
  confirmed: {
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

/* const formatEvents = (events) => {
  return events.map((event) => {
    const colors = eventColors[event.estado] || {};
    return {
      id: event.id,
      title: `${event.paciente_nombre_completo}`,
      start: `${event.fecha}T${event.desde}`,
      end: `${event.fecha}T${event.hasta}`,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      statusColor: colors.statusColor,
      extendedProps: {
        terapeuta: event.terapeuta_nombre_completo,
        estado: event.estado,
        especialidad: event.especialidad_descripcion,
      },
    };
  });
}; */
const formatEvents = (events) => {
  return events.map((event) => {
    const colors = eventColors[event.state] || {};
    return {
      id: event.id,
      title: `${event.patient_name}`,
      start: `${nowStr}T${event.time}`,
      /* end: `${event.fecha}T${event.hasta}`, */
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      statusColor: colors.statusColor,
      extendedProps: {
        dentist: event.dentist_name,
        state: event.state,
        observations: event.observations,
        date: event.date,
        hour: event.time,
        patientId: event.patient_id,
        dentistId: event.dentist_id,
        reasonId: event.reason_id,
      },
    };
  });
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

