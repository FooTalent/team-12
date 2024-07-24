import PropTypes from "prop-types";
import { useState } from "react";
import CardWhite from "../../../components/CardWhite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import Input from "../../../components/Input";
import editShiftSchema from "../../../validations/editShift";

export default function EditShift({ isVisible, setModalEditIsVisible }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(editShiftSchema),
  });

  const handleOnSubmit = (data) => {
    const formData = { ...data, patient: selectedPatient };
    console.log(formData);
  };

  const handleOnCancel = () => {
    setModalEditIsVisible(false);
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
            <div className="flex gap-5 w-full">
              <div className="flex flex-col w-2/4">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Fecha *
                </label>
                <div className="relative w-full">
                  <Input
                    className={`bg-[#F6FBFF] w-full border border-[#193B67] border-opacity-15 placeholder:text-[#1C3454]
                  placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal`}
                    type="text"
                    placeholder="[fecha previa]"
                    {...register("date")}
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
                    placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal`}
                    type="text"
                    placeholder="[hora previa]"
                    {...register("hour")}
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
                  <option value="">[odontólogo ya seleccionado previo]</option>
                  <option value="1">[otros odontólogos]</option>
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
    )
  );
}

EditShift.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setModalEditIsVisible: PropTypes.func.isRequired,
};
