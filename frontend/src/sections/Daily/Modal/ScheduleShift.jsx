import PropTypes from "prop-types";
import CardWhite from "../../../components/CardWhite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addShiftSchema from "../../../validations/addShift";
import Button from "../../../components/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import Input from "../../../components/Input";

export default function ScheduleShift({ isVisible }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addShiftSchema),
  });

  const handleOnSubmit = (data) => {
    console.log(data);
  };

  return (
    isVisible && (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
        <CardWhite className="bg-white min-w-[568px]">
          <div>
            <h2 className="text-[32px] font-semibold text-[#192739]">
              Agendar turno
            </h2>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                Paciente
              </label>
              <Button className="flex box-border text-lg border border-[#C3D4FF] bg-[#F6FBFF] text-[#005FDB]">
                <AiOutlineUserAdd className="mr-1 text-[#005FDB] text-2xl" />
                Seleccionar paciente
              </Button>
            </div>
            <div className="flex gap-5 w-full">
              <div className="flex flex-col w-2/4">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Fecha *
                </label>
                <Input
                  className="bg-[#F6FBFF] border border-[#193B67] border-opacity-15 placeholder:text-[#1C3454]
                  placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal"
                  type="text"
                  placeholder="Seleccione fecha"
                  {...register("date", { required: true })}
                />
              </div>
              <div className="flex flex-col w-2/4">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                  Horario *
                </label>
                <Input
                  className="bg-[#F6FBFF] border border-[#193B67] border-opacity-15 placeholder:text-[#1C3454]
                  placeholder:text-opacity-25 placeholder:text-lg placeholder:font-normal"
                  type="text"
                  placeholder="Seleccione hora"
                  {...register("hour", { required: true })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg text-[#1B2B41] text-opacity-70">
                Motivo de la consulta
              </label>
              <div className="relative">
                <select className="appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50 ">
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
                <select className="appearance-none cursor-pointer bg-[#F6FBFF] py-2 px-2.5 w-full rounded border border-[#193B67] border-opacity-15 text-[#193B67] text-opacity-50 ">
                  <option value="">Seleccione el odontólogo</option>
                  <option value="1">Opcion 1</option>
                  <option value="2">Opcion 2</option>
                  <option value="3">Opcion 3</option>
                </select>
                <FaChevronDown className="text-[#1B2B41] text-opacity-70 absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2">
                <Input
                  className="w-4 bg-[#193B67] bg-opacity-15"
                  type="checkbox"
                />
                <label className="text-[#192739] text-opacity-95 text-lg">
                  Recordatorio automático
                </label>
              </div>
              <div className="flex-1">
                <Button className="w-full justify-center flex font-light text-lg border border-[#C3D4FF] bg-[#F6FBFF] text-[#005FDB]">
                  Editar recordatorio
                </Button>
              </div>
            </div>
          </form>
        </CardWhite>
      </div>
    )
  );
}

ScheduleShift.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};
