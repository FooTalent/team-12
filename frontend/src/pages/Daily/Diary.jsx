import ScheduleShift from "../../sections/Daily/Modal/ScheduleShift";
import { useState } from "react";

export default function Diary() {
  const [modalIsVisible, setModalIsVisible] = useState(true);

  // esto va en el boton de agregar turno en el calendario
  const handleOpenModalAdd = () => {
    setModalIsVisible(true);
  };

  return (
    <>
      <div>
        Diary
        {/* aca va el boton del modal */}
        <button className="bg-red-500" onClick={handleOpenModalAdd}>Agregar turno</button>
      </div>
      {modalIsVisible && <ScheduleShift isVisible={modalIsVisible} />}
    </>
  );
}
