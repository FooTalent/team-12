import PropTypes from "prop-types";
import CardWhite from "../../../components/CardWhite";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import addPatientSchema from "../../../validations/addPatient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "react-hot-toast";
import { postPatient } from "../../../api/patients/apiPatients";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { format, parse } from "date-fns";
import { useState } from "react";

const locale = es;
registerLocale("es", locale);
export default function AddPatients({
  isVisible,
  setModalIsVisible,
  setPacientes,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      dni: "",
      email: "",
      phone_number: "",
      alternative_phone_number: " ",
    },
    resolver: zodResolver(addPatientSchema),
  });

  //estado para manejar la fecha
  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = async (data) => {
    // Formatea la fecha seleccionada al formato ISO 8601
    const dateFormatted = selectedDate
      ? format(selectedDate, "yyyy-MM-dd") // Formato ISO 8601
      : "";

    const formattedData = {
      ...data,
      birth_date: dateFormatted,
      alternative_phone_number: data.alternative_phone_number || "NO", // Si no hay teléfono alternativo, enviar null
    };

    console.log(formattedData);
    // Llamar a la API para añadir un paciente
    try {
      const res = await postPatient(formattedData);
      if (res.status === 201) {
        toast.success("Se añadió un paciente con éxito");
        // Actualizar la lista de pacientes
        setPacientes((prevPacientes) => [
          ...prevPacientes,
          {
            id: res.data.id,
            dni: formattedData.dni,
            patient: `${formattedData.first_name} ${formattedData.last_name}`,
          },
        ]);
        reset();
        setModalIsVisible(false);
      } else {
        toast.error("Error al añadir un paciente");
        console.error("Error al añadir un paciente:", res);
      }
    } catch (error) {
      console.error("Error al añadir un paciente:", error);
    }
  };

  // Manejo del cambio de la fecha
  const handleDatePickerChange = (date) => {
    const formattedDate = date ? format(date, "dd/MM/yyyy") : "";
    setValue("birth_date", formattedDate);
    setSelectedDate(date);
  };

  const parsedDate = selectedDate
    ? parse(format(selectedDate, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
    : null;

  const handleOnCancel = () => {
    setModalIsVisible(false);
  };

  return (
    isVisible && (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
          <CardWhite className="bg-white max-w-[568px] w-full p-6 relative sm:max-h-max max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="pb-6">
              <h2 className="sm:text-[32px] text-2xl font-semibold text-[#192739]">
                Añadir paciente
              </h2>
            </div>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-600 text-sm font-normal">
                {"Estos campos son requeridos"}
              </p>
            )}
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-row flex sm:gap-6 gap-3 flex-wrap">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Nombre *
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none
               ${errors.first_name && "border-red-600 border-2"}
               `}
                    type="text"
                    placeholder="Ingrese el nombre"
                    {...register("first_name", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Apellido *
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none
                ${errors.last_name && "border-red-600 border-2"}`}
                    type="text"
                    placeholder="Ingrese el apellido"
                    {...register("last_name", { required: true })}
                  />
                </div>
              </div>
              <div className="flex-row flex sm:gap-6 gap-3 flex-wrap">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Fecha de nacimiento *
                  </label>
                  <Controller
                    control={control}
                    name="birth_date"
                    render={({ field }) => (
                      <DatePicker
                        className={`bg-white px-2 py-2 rounded-[4px] w-full border placeholder:text-[#1C3454] placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal ${
                          errors.birth_date
                            ? "border-red-600 border-2"
                            : "border-[#193B67] border-opacity-15"
                        }`}
                        selected={
                          field.value
                            ? parse(field.value, "dd/MM/yyyy", new Date())
                            : parsedDate
                        }
                        onChange={(date) => {
                          handleDatePickerChange(date);
                          field.onChange(format(date, "dd/MM/yyyy")); // Actualiza el valor del input
                        }}
                        yearDropdownItemNumber={90}
                        maxDate={new Date()}
                        scrollableYearDropdown
                        showYearDropdown
                        dateFormat={"dd/MM/yyyy"}
                        locale={locale}
                        placeholderText="Seleccione la fecha"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    DNI *
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.dni && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="Ingrese el DNI"
                    {...register("dni", { required: true })}
                  />
                </div>
              </div>
              <div className="flex-row w-full flex gap-4">
                <div className="flex flex-col w-full gap-2">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Correo electrónico *
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none
               ${errors.email && "border-red-600 border-2"}`}
                    type="text"
                    placeholder="Ingrese el correo electrónico"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>
              <div className="flex-row flex sm:gap-6 gap-3 flex-wrap">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Teléfono 1 *
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.phone_number && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="ejemplo: 11 5585-2901"
                    {...register("phone_number", { required: true })}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                    Teléfono 2
                  </label>
                  <Input
                    className={`bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               ${errors.alternative_phone_number && "border-red-600 border-2"}`}
                    type="number"
                    placeholder="ejemplo: 11 5585-2901"
                    {...register("alternative_phone_number", {
                      required: false,
                    })}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <Button type="submit" className="bg-[#006AF5] text-white">
                  Añadir paciente
                </Button>
                <Button
                  type="button"
                  className="bg-white text-[#006AF5] font-light"
                  onClick={handleOnCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardWhite>
        </div>
        <Toaster position="top-right" />
      </>
    )
  );
}

AddPatients.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setModalIsVisible: PropTypes.func.isRequired,
  setPacientes: PropTypes.func.isRequired,
};
