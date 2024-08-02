import PropTypes from "prop-types";

import Checkbox from "antd/es/checkbox/Checkbox";
import MonthCalendar from "../Calendar/MonthCalendar";
import { useState } from "react";
import ScheduleShift from "./Modal/ScheduleShift";
import Button from "../../components/Button";
/* import { getDentists } from "../../api/dentist/dentist-services"; */
/* import { useNavigate } from "react-router-dom"; */

function ShiftSidebar({ handleDateSelect }) {
  // modal estado para mostrar u ocultar el modal de agendar turno
  const [modalShiftIsVisible, setModalShiftIsVisible] = useState(false);
  /* const [listDentist, setListDentist] = useState(null);
  const [selectDentist, setSelectDentist] = useState(null); */

  /* const navigate = useNavigate(); */

  /* useEffect(() => {
    const fetchDentist = async () => {
      try {
        const response = await getDentists();
        setListDentist(response.data);
      } catch (err) {
        console.error("Error fetching dentist list");
      }
    };

    fetchDentist();
  }, []); */

  // funcion para mostrar el modal de agendar turno
  const handleOpenModalAdd = () => {
    setModalShiftIsVisible(true);
  };

  /* const handleChange = (value) => {
    console.log("Valuee", value);
    setSelectDentist(value);
    navigate(`/test/${value}`);
  }; */
  /* console.log("useState", selectDentist); */

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <>
      <div className="px-3 border-l-2 border-[#1A3860]/10 w-80 min-w-[300px] space-y-3 hidden lg:block">
        <MonthCalendar handleDateSelect={handleDateSelect} />
        <div className="flex items-center justify-center w-full mx-auto">
          <div className="w-full">
            <Button
              className="w-full text-white bg-mainBlue hover:bg-mainBlue/80 "
              onClick={handleOpenModalAdd}
              type="button"
            >
              Agendar Turno
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 pb-5">
          <h2>Estados</h2>
          <Checkbox onChange={onChange}>Reprogramado</Checkbox>
          <Checkbox onChange={onChange}>Ausente</Checkbox>
        </div>
      </div>
      {modalShiftIsVisible && (
        <ScheduleShift
          isVisible={modalShiftIsVisible}
          setModalShiftIsVisible={setModalShiftIsVisible}
        />
      )}
    </>
  );
}

export default ShiftSidebar;

ShiftSidebar.propTypes = {
  handleDateSelect: PropTypes.func.isRequired,
};
