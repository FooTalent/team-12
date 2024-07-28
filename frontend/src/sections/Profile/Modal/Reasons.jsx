import Button from "../../../components/Button";
import Input from "../../../components/Input";
import CardWhite from "../../../components/CardWhite";
import PropTypes from "prop-types";
import { IoIosSearch } from "react-icons/io";
import { GoPersonAdd } from "react-icons/go";

const Reasons = ({isVisible, setModalIsVisible}) => {
    const handleOnCancel = () => {
        setModalIsVisible(false);
      };
  return (
    isVisible && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <CardWhite className="bg-white min-w-[744px] p-6">
            <div className="pb-6">
              <h2 className="text-[32px] font-semibold text-[#192739]">
                Motivos de Consulta
              </h2>
            </div>
            <div>
            <div className="flex  gap-1 " >
             <Input placeholder={"Buscar motivos..."}  type="text" className="flex-grow"/>
             <div className="flex gap-1">
             <Button className="flex items-center gap-1 border bg-mainBlue text-white">
             <IoIosSearch /> Buscar
             </Button>
             <Button className="flex items-center gap-1 border text-mainBlue">
             <GoPersonAdd />  Añadir motivo 
             </Button>
             </div>
            </div></div>
          </CardWhite>
        </div>
      )
  )
}

export default Reasons

Reasons.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    setModalIsVisible: PropTypes.func.isRequired,
  };