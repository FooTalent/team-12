import Input from "../../components/Input";
import Button from "../../components/Button";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import TableDni from "./TableDni";
import CardWhite from "../../components/CardWhite";

export default function SearchPatients() {
  const [searchDni, setSearchDni] = useState("");

  const handleInputSearch = (e) => {
    const value = e.target.value;
    setSearchDni(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchDni);
  };

  const handleClearSearch = () => {
    setSearchDni("");
  };

  return (
    <div className="bg-white xl:mx-80 md:mx-48 sm:mx-4 mt-6 px-2">
      <CardWhite>
        <div className="container__h1 py-[10px]">
          <h1 className="text-[32px] text-[#192739] font-semibold">
            Pacientes
          </h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-1.5 flex-col md:flex-row"
        >
          <div className="flex-1 relative">
            <Input
              value={searchDni}
              type="text"
              onChange={handleInputSearch}
              className="w-full bg-white py-1.5 border-[1.5px] border-[#c4cbd3] placeholder:text-[#c4cbd3] 
            placeholder:text-lg placeholder:font-medium outline-[#c4cbd3] text-[#8993a0] font-medium"
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
            type="submit"
            className="flex items-center py-1.5 px-3 gap-2 bg-[#006AF5] text-white font-normal text-lg"
          >
            <IoSearch className="text-white" />
            Buscar
          </Button>
        </form>
        <div className="bg-[#f6fbff] rounded-lg p-4 h-80">
          <TableDni />
        </div>
      </CardWhite>
    </div>
  );
}
