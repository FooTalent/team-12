import { useEffect, useState } from "react";
import dayjs from "dayjs";
import WeeklyCalendar from "../../sections/Calendar/WeeklyCalendar";
import ShiftSidebar from "../../sections/ShiftManager/ShiftSidebar";
import { getAppointments } from "../../api/appointments/appointments-services";
import { useParams } from "react-router-dom";

function CalendarPage() {
  /* const [currentEvents, setCurrentEvents] = useState([]); */
  const [eventsDB, setEventsDB] = useState([]);
  const [loading, setLoading] = useState(null);
  const [modalModifyIsVisible, setModalModifyIsVisible] = useState(false);
  /* const [stateCalendarApi, setStateCalendarApi] = useState(null); */
  const [dateSelected, setDateSelected] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const id = Number(useParams().id);
  console.log(id);

  useEffect(() => {
    const getAppointment = async (id) => {
      setLoading(true);
      try {
        const response = await getAppointments({ id });
        setEventsDB(response);
        console.log("response", response);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("s", id);
      getAppointment(id);
    } else {
      setEventsDB(null);
      setLoading(false);
    }
  }, [id]);

  /* if (!loading) {
    console.log("Eventos seteados", eventsDB);
  } */

  function handleDateSelect(date) {
    setDateSelected(date);
  }

  /* function handleEvents(events) {
    console.log("pasa por aca");
    setCurrentEvents(events);
  } */

  return (
    <div className="max-w-7xl flex justify-center w-full mx-auto bg-white border-2 border-[#1C3454]/26 border-solid rounded my-6 font-sans">
      {loading === false && (
        <>
          <WeeklyCalendar
            eventsDB={eventsDB}
            dateSelected={dateSelected}
            modalModifyIsVisible={modalModifyIsVisible}
            setModalModifyIsVisible={setModalModifyIsVisible}
          />
          <ShiftSidebar handleDateSelect={handleDateSelect} />
        </>
      )}
    </div>
  );
}

export default CalendarPage;
