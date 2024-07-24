import Input from "../../components/Input";
import Button from "../../components/Button";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useState } from "react";
import TableDni from "./TableDni";
import CardWhite from "../../components/CardWhite";
import AddPatients from "./Modal/AddPatients";

export default function SearchPatients() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [searchDni, setSearchDni] = useState("");

  const handleInputSearch = (e) => {
    const value = e.target.value;
    setSearchDni(value);
  };

  const handleClearSearch = () => {
    setSearchDni("");
  };

  const handleOpenModalAdd = () => {
    setModalIsVisible(true);
  };

  return (
    <>
      <div className="bg-white xl:mx-80 md:mx-48 sm:mx-4 mt-6 px-2">
        <CardWhite>
          <div className="container__h1 py-[10px]">
            <h1 className="text-[32px] text-[#192739] font-semibold">
              Pacientes
            </h1>
          </div>
          <div className="w-full flex gap-1.5 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Input
                value={searchDni}
                type="text"
                onChange={handleInputSearch}
                className="w-full h-10 box-border bg-white border-[1.5px] border-[#DAE0E7] placeholder:text-[#c4cbd3] 
               placeholder:text-lg placeholder:font-normal outline-[#DAE0E7] text-[#8993a0] font-normal px-3"
                placeholder="Ingrese el DNI del paciente..."
              />
              {searchDni && (
                <button
                  onClick={handleClearSearch}
                  className="absolute top-1/2 text-lg right-2 transform -translate-y-1/2"
                >
                  <IoClose className="text-[#8993a0]" />
                </button>
              )}
            </div>
            <Button
              className="flex items-center h-10 py-1.5 px-3 gap-2 bg-[#006AF5] text-white font-normal text-lg"
              onClick={() => console.log(searchDni)}
            >
              <IoSearch className="text-white" />
              Buscar
            </Button>
            <Button
              className="flex items-center h-10 font-normal text-lg text-[#005FDB] rounded border border-[#C3D4FF] px-3"
              onClick={handleOpenModalAdd}
            >
              <AiOutlineUserAdd className="mr-1 text-[#005FDB] text-2xl" />
              Añadir paciente
            </Button>
          </div>
          <div className="bg-[#f6fbff] border border-[#DAE0E7] rounded-lg p-4 h-80">
            <TableDni />
          </div>
        </CardWhite>
      </div>
      {modalIsVisible && (
        <AddPatients
          isVisible={modalIsVisible}
        />
      )}
    </>
  );
}
