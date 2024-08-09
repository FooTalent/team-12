// import PropTypes from "prop-types";
// import { FaChevronDown } from "react-icons/fa";
// import MonthCalendar from "../Calendar/MonthCalendar";
// import { useState } from "react";
// import ScheduleShift from "./Modal/ScheduleShift";
// import Button from "../../components/Button";
// import StatusIndicators from "./StatusIndicators";

// function ShiftSidebar({
//   handleDateSelect,
//   forceCalendarUpdate,
//   isDentist,
//   handleChange,
//   data,
//   dentistID,
//   eventsDB,
// }) {
//   // modal estado para mostrar u ocultar el modal de agendar turno
//   const [modalShiftIsVisible, setModalShiftIsVisible] = useState(false);

//   // funcion para mostrar el modal de agendar turno
//   const handleOpenModalAdd = () => {
//     setModalShiftIsVisible(true);
//   };

//   return (
//     <>
//       <div className="px-3 border-l-2 border-[#1A3860]/10 w-80 min-w-[300px] space-y-3 hidden lg:block">
//         <MonthCalendar handleDateSelect={handleDateSelect} />
//         <div
//           className={`flex flex-col items-center justify-center w-full mx-auto ${
//             isDentist && "hidden"
//           }`}
//         >
//           <div className="w-full">
//             <Button
//               className="w-full text-white bg-mainBlue hover:bg-mainBlue/80 "
//               onClick={handleOpenModalAdd}
//               type="button"
//             >
//               Agendar Turno
//             </Button>
//           </div>
//           {eventsDB && (
//             <div className="relative w-full mt-3 lg:text-lg max-w-72">
//               <select
//                 /* placeholder="Seleccionar profesional" */
//                 defaultValue={dentistID}
//                 className="appearance-none cursor-pointer bg-white py-1.5 px-2.5 w-full rounded border border-mainBlue text-textBlue focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
//                 onChange={(e) => handleChange(e.target.value)}
//               >
//                 <option value="" disabled hidden>
//                   Seleccionar profesional
//                 </option>
//                 {data.dentists &&
//                   data.dentists.map((dentist) => (
//                     <option key={dentist.id} value={dentist.id}>
//                       {dentist.first_name} {dentist.last_name}
//                     </option>
//                   ))}
//               </select>
//               <FaChevronDown className="text-textBlue absolute right-0 pointer-events-none top-1/2 transform -translate-y-1/2 mr-2.5" />
//             </div>
//           )}
//         </div>
//         <StatusIndicators />
//       </div>
//       {modalShiftIsVisible && (
//         <ScheduleShift
//           isVisible={modalShiftIsVisible}
//           setModalShiftIsVisible={setModalShiftIsVisible}
//           data={data}
//           forceCalendarUpdate={forceCalendarUpdate}
//         />
//       )}
//     </>
//   );
// }

// export default ShiftSidebar;

// ShiftSidebar.propTypes = {
//   handleDateSelect: PropTypes.func.isRequired,
//   forceCalendarUpdate: PropTypes.func.isRequired,
//   handleChange: PropTypes.func,
//   data: PropTypes.object,
//   isDentist: PropTypes.bool,
//   eventsDB: PropTypes.array,
//   dentistID: PropTypes.string,
// };
