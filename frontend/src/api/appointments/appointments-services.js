import { BASE_URL } from "../constants/base-url";
import { APPOINTMENTS_PATHS } from "../constants/paths/appointments-paths";
import axios from "axios";
import formatEvents from "./appointmets-format";

export const getAppointments = async ({ id }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${APPOINTMENTS_PATHS.GET_BY_DENTIST_ID}/${id}`
    );
    console.log("eventos salidos del horno", response);
    return formatEvents(response.data);
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const updateAppointment = async ({ id, data }) => {
  console.log("funcion", id, data);
  try {
    const response = await axios.put(
      `${BASE_URL}${APPOINTMENTS_PATHS.UPDATE_APPOINTMENT}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error update appointmets:", error.response.data);
    throw error;
  }
};

