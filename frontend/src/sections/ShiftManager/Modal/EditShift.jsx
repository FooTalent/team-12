import PropTypes from "prop-types";
import { useState } from "react";
import CardWhite from "../../../components/CardWhite";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import editShiftSchema from "../../../validations/editShift";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import ModalCancel from "../../../components/ModalCancel";
import { useEffect } from "react";

const locale = es;
registerLocale("es", locale);

// todo lo de este componente tiene que mostrar datos previos y poder modificarlos
export default function EditShift({
  isVisible,
  setModalModifyIsVisible,
  eventInfo,
}) {
  const [selectedPatient, setSelectedPatient] = useState(eventInfo.title);
  //estados para manejar la fecha y la hora
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  //estado para cancelar turno y mostrar modal
  const [modalCancelIsVisible, setModalCancelIsVisible] = useState(false);

  const { control, setValue, register, handleSubmit } = useForm({
    resolver: zodResolver(editShiftSchema),
  });

  console.log(
    "DATEEE PRPS",
    typeof eventInfo.extendedProps.hour,
    eventInfo.extendedProps.hour
  );
  const dateSelected = parse(
    eventInfo.extendedProps.date,
    "dd-MM-yyyy",
    new Date()
  );
  const dateNewFormat = format(dateSelected, "dd/MM/yyyy");

  // parsear la fecha y la hora para que se muestre en el input
  useEffect(() => {
    // Si 'eventInfo.extendedProps.date' tiene un valor, se procede a formatearlo e inicializar el estado.
    if (eventInfo.extendedProps.date) {
      // 'parse' convierte la fecha de una cadena en formato "dd-MM-yyyy" a un objeto de tipo Date.
      const parsedDate = parse(
        eventInfo.extendedProps.date,
        "dd-MM-yyyy",
        new Date()
      );
      // 'format' convierte el objeto Date a una cadena en el formato "dd/MM/yyyy".
      const formattedDate = format(parsedDate, "dd/MM/yyyy");
      // Actualiza el estado local 'selectedDate' con el objeto Date parseado.
      setSelectedDate(parsedDate);
      // Establece el valor del campo 'date' en el formulario a la fecha formateada.
      setValue("date", formattedDate);
    }

    // Si 'eventInfo.extendedProps.hour' tiene un valor, se procede a formatearlo e inicializar el estado.
    if (eventInfo.extendedProps.hour) {
      // 'parse' convierte la hora de una cadena en formato "HH:mm" a un objeto de tipo Date.
      const parsedHour = parse(
        eventInfo.extendedProps.hour,
        "HH:mm",
        new Date()
      );
      // Actualiza el estado local 'selectedHour' con el objeto Date parseado para representar la hora.
      setSelectedHour(parsedHour);
      // Establece el valor del campo 'hour' en el formulario con la hora original de la prop.
      setValue("hour", eventInfo.extendedProps.hour);
    }
    // Este useEffect se ejecuta cada vez que cambian 'eventInfo' o 'setValue'.
  }, [eventInfo, setValue]);

  const handleOnSubmit = (data) => {
    const dateFormatted = selectedDate
      ? format(selectedDate, "dd/MM/yyyy")
      : "";
    const hourFormatted = selectedHour ? format(selectedHour, "HH:mm") : "";

    const formData = {
      ...data,
      patient: selectedPatient,
      // formatear la fecha y la hora para que se envie en el formato correcto
      date: dateFormatted,
      hour: hourFormatted,
    };
    console.log(formData);
  };

  //manejo de cancelar turno y mostrar modal
  const handleOnCancel = () => {
    setModalCancelIsVisible(true);
  };

  const handleOnClose = () => {
    setModalModifyIsVisible(false);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    console.log("Paciente seleccionado:", patient);
  };

  const handleDatePickerChange = (date) => {
    // aca se formatea la fecha para que se muestre en el input y podemos cambiar de formato
    const formattedDate = date ? format(date, "dd/MM/yyyy") : "";
    setValue("date", formattedDate);
    setSelectedDate(date);
    console.log(formattedDate);
  };

  const handleHourChange = (hour) => {
    // aca se formatea la hora para que se muestre en el input y podemos cambiar de formato
    const formattedHour = hour ? format(hour, "HH:mm") : "";
    setValue("hour", formattedHour);
    setSelectedHour(hour);
    console.log(formattedHour);
  };

  //parsear la fecha para que se muestre en el input
  const parsedDate = selectedDate
    ? parse(format(selectedDate, "dd/MM/yyyy"), "dd/MM/yyyy", new Date())
    : null;

  //parsear la hora para que se muestre en el input
  const parsedHour = selectedHour
    ? parse(format(selectedHour, "HH:mm"), "HH:mm", new Date())
    : null;

  return (
    isVisible && (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <CardWhite className="bg-white min-w-[568px] px-6 py-4">
            <div className="pb-5">
              <h2 className="text-[32px] font-semibold text-[#192739]">
                Modificar turno
              </h2>
            </div>
            <div className="flex flex-col gap-1 pb-4">
              <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                Paciente
              </label>
              {/* esto te lleva a otro modal para seleccionar el paciente */}
              <Button
                type="button"
                className="flex pl-3.5 pr-0 box-border w-[250px] text-lg border border-[#C3D4FF] bg-[#F6FBFF] text-[#005FDB]"
                onClick={() => handleSelectPatient("Marcelo Tinelli")}
              >
                <AiOutlineUserAdd className="mr-1 text-[#005FDB] text-2xl" />
                {selectedPatient ? selectedPatient : "[Paciente previo]"}
              </Button>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <div className="flex w-full gap-5">
                <div className="flex flex-col w-2/4">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                    Fecha *
                  </label>
                  <div className="relative w-full">
                    <Controller
                      control={control}
                      name="date"
                      defaultValue={dateNewFormat}
                      render={({ field }) => (
                        <DatePicker
                          className={`bg-[#F6FBFF] rounded-[4px] border-[#193B67] border-opacity-15 w-full border placeholder:text-[#1C3454] placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal`}
                          icon={
                            <FiCalendar className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 text-2xl" />
                          }
                          selected={
                            field.value
                              ? parse(field.value, "dd/MM/yyyy", new Date())
                              : parsedDate
                          }
                          onChange={(date) => {
                            handleDatePickerChange(date);
                            field.onChange(format(date, "dd/MM/yyyy")); // para cambie el valor del input
                          }}
                          dateFormat={"dd/MM/yyyy"}
                          showIcon={true}
                          minDate={new Date()}
                          locale={locale}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-2/4">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                    Horario *
                  </label>
                  <div className="relative w-full">
                    <Controller
                      control={control}
                      name="hour"
                      defaultValue={eventInfo.extendedProps.hour}
                      render={({ field }) => (
                        <DatePicker
                          className={`bg-[#F6FBFF] rounded-[4px] w-full border placeholder:text-[#1C3454] placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal border-[#193B67] border-opacity-15`}
                          locale={locale}
                          selected={
                            field.value
                              ? parse(field.value, "HH:mm", new Date())
                              : parsedHour
                          }
                          timeCaption="Hora"
                          dateFormat="HH:mm"
                          showTimeSelectOnly
                          showTimeSelect
                          timeIntervals={15}
                          showIcon={true}
                          icon={
                            <FiClock className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 text-2xl" />
                          }
                          placeholderText={eventInfo.extendedProps.hour}
                          onChange={(hour) => {
                            handleHourChange(hour);
                            field.onChange(format(hour, "HH:mm")); // para cambie el valor del input
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Motivo de la consulta
                </label>
                <div className="relative">
                  <select
                    className={`appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50`}
                    {...register("reason")}
                  >
                    <option value="">[motivo previo]</option>
                    <option value="1">[otros motivos]</option>
                  </select>
                  <FaChevronDown className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Odontólogo
                </label>
                <div className="relative">
                  <select
                    className={`appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50`}
                    {...register("odontologist")}
                  >
                    <option value="">{eventInfo.extendedProps.dentist}</option>
                    <option value="1">[otros odontólogos]</option>
                  </select>
                  <FaChevronDown className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center w-2/4 gap-2">
                  <input
                    className="w-6 h-6 bg-[#193B67] bg-opacity-15"
                    type="checkbox"
                    {...register("reminder")}
                  />
                  <label className="text-[#192739] text-opacity-95 text-lg font-normal">
                    Recordatorio automático
                  </label>
                </div>
                <div className="flex-1">
                  {/* esto te lleva a otro modal para editar*/}
                  <Button
                    type="button"
                    className="w-full justify-center flex font-light text-lg border border-[#C3D4FF] bg-[#F6FBFF] text-[#005FDB]"
                  >
                    Editar recordatorio
                  </Button>
                </div>
              </div>
              <div className="flex flex-col w-full gap-2">
                <Button
                  type="submit"
                  className="bg-[#006AF5] text-white font-semibold"
                >
                  Guardar cambios
                </Button>
                <Button
                  className="bg-white text-[#006AF5] font-normal"
                  type="button"
                  onClick={handleOnCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardWhite>
        </div>
        <ModalCancel
          isVisible={modalCancelIsVisible}
          setIsVisible={setModalCancelIsVisible}
          cancelModal={handleOnClose}
        />
      </>
    )
  );
}

EditShift.propTypes = {
  eventInfo: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setModalModifyIsVisible: PropTypes.func.isRequired,
};
