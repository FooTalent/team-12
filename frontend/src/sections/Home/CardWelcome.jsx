import Button from "../../components/Button";
import { PiIdentificationCard } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";

export default function CardWelcome() {
  const nombrePerfil = "César Martínez";
  return (
    <div className="bg-[#fafdff] px-[120px] pt-6">
      <div className="rounded-lg drop-shadow-xl shadow-custom-lg">
        <div className="bg-white flex justify-center">
          <p className="text-2xl py-6">Bienvenido, {nombrePerfil}</p>
        </div>
        <div className="w-full bg-[#f3f5f7] flex gap-2 px-4 py-3">
          <Button className="flex items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all">
            <PiIdentificationCard className="text-4xl text-[#c0d2ff]" />
            <p className="text-xl font-extralight">Pacientes</p>
          </Button>
          <Button className="flex items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all">
            <CiCalendar className="text-4xl text-[#c0d2ff]" />
            <p className="text-xl font-extralight">Agenda</p>
          </Button>
          <Button className="flex items-center justify-center bg-[#006af5] flex-1 px-[14px] py-2 text-white hover:bg-[#005fdb] transition-all">
            <AiOutlineUser className="text-4xl text-[#c0d2ff]" />
            <p className="text-xl font-extralight">Perfil</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
