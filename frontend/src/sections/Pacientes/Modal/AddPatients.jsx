import PropTypes from "prop-types";
import CardWhite from "../../../components/CardWhite";
import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import addPatientSchema from "../../../validations/addPatient";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AddPatients({ isVisible }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addPatientSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    isVisible && (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
        <CardWhite className="bg-white">
          <div>
            <h2 className="text-[32px] font-semibold text-[#192739]">
              Añadir paciente
            </h2>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-row flex gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Nombre *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="Ingrese el nombre"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Apellido *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="Ingrese el apellido"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="flex-row flex gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Fecha de nacimiento *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="Seleccione fecha"
                  {...register("birthdate", { required: true })}
                />
                {errors.birthdate && (
                  <p className="text-red-600">{errors.birthdate.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  DNI *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="Ingrese el DNI"
                  {...register("dni", { required: true })}
                />
                {errors.dni && (
                  <p className="text-red-600">{errors.dni.message}</p>
                )}
              </div>
            </div>
            <div className="flex-row w-full flex gap-4">
              <div className="flex flex-col w-full gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Correo electrónico *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="Ingrese el correo electrónico"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="flex-row flex gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Teléfono 1 *
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="ejemplo: 11 5585-2901"
                  {...register("phone1", { required: true })}
                />
                {errors.phone1 && (
                  <p className="text-red-600">{errors.phone1.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-semibold text-lg text-[#1B2B41] text-opacity-65">
                  Teléfono 2
                </label>
                <Input
                  className="bg-white placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal border border-[#DAE0E7] outline-none"
                  type="text"
                  placeholder="ejemplo: 11 5585-2901"
                  {...register("phone2")}
                />
                {errors.phone2 && (
                  <p className="text-red-600">{errors.phone2.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <Button className="bg-[#006AF5] text-white">
                Añadir paciente
              </Button>
              <Button
                className="bg-white text-[#006AF5] font-light"
                onClick={() => console.log("Cancelar")}
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

AddPatients.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};
