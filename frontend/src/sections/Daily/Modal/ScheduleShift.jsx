import PropTypes from "prop-types";
import { useState } from "react";
import CardWhite from "../../../components/CardWhite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addShiftSchema from "../../../validations/addShift";
import Button from "../../../components/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import Input from "../../../components/Input";

export default function ScheduleShift({ isVisible, setModalShiftIsVisible }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addShiftSchema),
  });

  const handleOnSubmit = (data) => {
    const formData = { ...data, patient: selectedPatient };
    console.log(formData);
  };

  const handleOnCancel = () => {
    setModalShiftIsVisible(false);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    console.log("Paciente seleccionado:", patient);
  };

  return (
    isVisible && (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
        <CardWhite className="bg-white min-w-[568px] px-6 py-4">
          <div className="pb-5">
            <h2 className="text-[32px] font-semibold text-[#192739]">
              Agendar turno
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
              {selectedPatient ? selectedPatient : "Seleccionar paciente"}
            </Button>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            {/* mostrar solo 1 mensaje de campos invalidos*/}
            {Object.keys(errors).length > 0 && (
              <p className="text-red-600 text-sm font-normal">
                {"Estos campos son requeridos"}
              </p>
            )}
            <div className="flex gap-5 w-full">
              <div className="flex flex-col w-2/4">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Fecha *
                </label>
                <div className="relative w-full">
                  <Input
                    className={`bg-[#F6FBFF] w-full border border-[#193B67] border-opacity-15 placeholder:text-[#1C3454]
                  placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal ${
                    errors.date && "border-red-600 border-2"
                  }`}
                    type="text"
                    placeholder="Seleccione fecha"
                    {...register("date", { required: true })}
                  />
                  <FiCalendar className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5 text-2xl" />
                </div>
              </div>
              <div className="flex flex-col w-2/4">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Horario *
                </label>
                <div className="w-full relative">
                  <Input
                    className={`bg-[#F6FBFF] w-full border border-[#193B67] border-opacity-15 placeholder:text-[#1C3454]
                    placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal ${
                      errors.hour && "border-red-600 border-2"
                    }`}
                    type="text"
                    placeholder="Seleccione hora"
                    {...register("hour", { required: true })}
                  />
                  <FiClock className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5 text-2xl" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                Motivo de la consulta
              </label>
              <div className="relative">
                <select
                  className={`appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50 ${
                    errors.reason && "border-red-600 border-2"
                  }`}
                  {...register("reason", { required: true })}
                >
                  <option value="">Seleccione el motivo</option>
                  <option value="1">Opcion 1</option>
                  <option value="2">Opcion 2</option>
                  <option value="3">Opcion 3</option>
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
                  className={`appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50 
                    ${errors.odontologist && "border-red-600 border-2"}`}
                  {...register("odontologist", { required: true })}
                >
                  <option value="">Seleccione el odontólogo</option>
                  <option value="1">Opcion 1</option>
                  <option value="2">Opcion 2</option>
                  <option value="3">Opcion 3</option>
                </select>
                <FaChevronDown className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <div className="flex gap-2 w-2/4 items-center">
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
            <div className="w-full flex flex-col gap-2">
              <Button
                type="submit"
                className="bg-[#006AF5] text-white font-semibold"
              >
                Agendar
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
    )
  );
}

ScheduleShift.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setModalShiftIsVisible: PropTypes.func.isRequired,
};
