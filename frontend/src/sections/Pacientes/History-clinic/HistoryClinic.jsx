import CardWhite from "../../../components/CardWhite";
import { FaCaretDown } from "react-icons/fa";
import TableHistory from "./TableHistory";

export default function HistoryClinic() {
  const patientName = "Marcelo Tinelli";

  return (
    <div className="bg-white xl:mx-72 md:mx-48 sm:mx-4 mt-6 px-2">
      <CardWhite>
        <div className="flex gap-24">
          <div className="py-2.5">
            <h2 className="font-semibold text-3xl">Historia clínica</h2>
          </div>
          <div className="flex-1">
            <div className="py-6 px-8 shadow-custom-lg rounded-lg flex flex-col gap-1">
              <h2 className="font-semibold text-2xl text-[#192739]">
                {patientName}
              </h2>
              <p className="text-lg text-[#1C304A] font-semibold">
                <b className="mr-2.5 font-medium text-[#1B2B41]">Nació el</b>{" "}
                01/04/1960
              </p>
              <p className="text-lg text-[#1C304A] font-semibold">
                <b className="mr-2.5 font-medium text-[#1B2B41]">DNI</b>{" "}
                21.428.290
              </p>
              <p className="text-lg text-[#1C304A] font-semibold">
                <b className="mr-2.5 font-medium text-[#1B2B41]">Teléfono</b>{" "}
                +54 9 15 1248-5938
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[4px] border">
          <div
            className="w-full py-3 px-4 pb-3"
            style={{
              backgroundImage: "linear-gradient(to bottom, #F6FBFF, #C3D4FF)",
            }}
          >
            <h1 className="text-[#192739] font-semibold text-2xl text-center">
              Turnos
              <FaCaretDown className="ml-1 inline-block text-[#1C304A] text-xl rotate-180 cursor-pointer" />
            </h1>
          </div>
          <div className="bg-[#f6fbff]">
            <TableHistory />
          </div>
        </div>
      </CardWhite>
    </div>
  );
}
