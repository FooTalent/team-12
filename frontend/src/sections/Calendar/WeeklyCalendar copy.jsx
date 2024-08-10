import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import EventsContent from "./EventsContent";
import { ScheduleShift, EditShift } from "../ShiftManager/Modal";
import { isBefore, isToday, isFuture } from "date-fns";
import { Button } from "antd";
import { IoMenu } from "react-icons/io5";
import { useDecode } from "../../hooks/useDecode";
import { apiGetClinicalInfoById } from "../../api/clinicalInfo/apiClinicalInfo";
import { apiGetUserById } from "../../api/users/apiUsers";
export default function WeeklyCalendar({
  eventsDB,
  setModalModifyIsVisible,
  modalModifyIsVisible,
  data,
  forceCalendarUpdate,
  setOpenDrawer,
  openDrawer,
  dentistID,
  currentDate,
  setCurrentDate,
}) {
  const [calendarApis, setCalendarApis] = useState(null);
  const [contentHeight, setContentHeight] = useState(600);
  const [eventClickInfo, setEventClickInfo] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [infoEventSelected, setInfoEventSelected] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth);
  const [infoClinic, setInfoClinic] = useState(null);

  //uso el decode para traer el id del usuario

  const token = localStorage.getItem("token");
  const decode = useDecode(token);
  const role = decode.role;

  //traigo el usuario para conseguir la info de la clinica
  useEffect(() => {
    const fetchInfoClinic = async () => {
      try {
        //para obtener el id de la clinica
        const resUser = await apiGetUserById(decode.user_id);
        const res = await apiGetClinicalInfoById(resUser.data.clinic_id);
        if (res && res.data) {
          setInfoClinic(res.data); // Actualiza el estado con la información de la clínica
        }
      } catch (error) {
        console.error("Error de la API:", error);
      }
    };
    fetchInfoClinic();
  }, [decode.user_id]);

  const calendarRef = useRef(null);
  const currentDateRef = useRef(currentDate);

  useEffect(() => {
    currentDateRef.current = currentDate;
  }, [currentDate]);

  const adjustContentHeight = () => {
    setIsSmallScreen(window.innerWidth);
    const height = window.innerHeight;
    if (height < 680) {
      setContentHeight(420);
    } else if (height < 768) {
      setContentHeight(550);
    } else {
      setContentHeight(600);
    }
  };

  useEffect(() => {
    adjustContentHeight();
    window.addEventListener("resize", adjustContentHeight);
    return () => {
      window.removeEventListener("resize", adjustContentHeight);
    };
  }, []);

  useEffect(() => {
    if (calendarApis && currentDate) {
      //calendarApis.gotoDate(currentDate);
      calendarApis.changeView("timeGridDay", currentDate);
    }
  }, [calendarApis, currentDate]);
  const handleDatesSet = useCallback(
    (arg) => {
      setCalendarApis(arg.view.calendar);
      const newDate = arg.view.currentStart;
      if (newDate.getTime() !== currentDateRef.current.getTime()) {
        setCurrentDate(newDate);
      }
    },
    [setCurrentDate]
  );

  function handleDateSelect(selectInfo) {
    const now = new Date();
    const selectedStart = new Date(selectInfo.start);
    const dayOfWeek = selectedStart.getDay();

    // Comprueba si la fecha seleccionada es hoy o en el futuro, y no es domingo
    if (
      (isToday(selectedStart) || isFuture(selectedStart)) &&
      dayOfWeek !== 0
    ) {
      // Si es hoy, comprueba si la hora seleccionada es futura
      if (isToday(selectedStart) && isBefore(selectedStart, now)) {
        // No abrir el modal si es una hora pasada de hoy
        return;
      }

      // Si pasa las comprobaciones, abre el modal
      setInfoEventSelected(selectInfo);
      setShowModal(true);
    }
  }

  useEffect(() => {
    if (
      calendarApis &&
      currentDate &&
      !datesAreEqual(calendarApis.getDate(), currentDate)
    ) {
      calendarApis.gotoDate(currentDate);
    }
  }, [calendarApis, currentDate]);

  // Función auxiliar para comparar fechas
  function datesAreEqual(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function handleEventClick(clickInfo) {
    if (role === "dentist") return;
    const now = new Date();
    const selectedStart = new Date(clickInfo.event.start);
    const dayOfWeek = selectedStart.getDay();

    if (
      (isToday(selectedStart) || isFuture(selectedStart)) &&
      dayOfWeek !== 0
    ) {
      if (isToday(selectedStart) && isBefore(selectedStart, now)) {
        return;
      }

      setEventClickInfo(clickInfo.event);
      setModalModifyIsVisible(true);
    }
  }

  const handleShowBurger = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <div className="relative p-2 pb-3 demo-app">
        <div className="demo-app-main">
          <FullCalendar
            ref={calendarRef}
            locale={esLocale}
            plugins={[timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: `${isSmallScreen > 954 ? "prev,next today" : ""}`,
              center: `${isSmallScreen > 954 ? "title" : "title"}`,
              right: `${
                isSmallScreen > 954 ? "timeGridWeek,timeGridDay" : "prev,next"
              }`,
            }}
            initialView="timeGridDay"
            selectable={role === "dentist" ? false : true}
            selectOverlap={false}
            selectMirror={true}
            selectConstraint={{
              start: new Date(),
              end: "2100-01-01",
            }}
            dayMaxEvents={true}
            weekends={true}
            hiddenDays={[0]}
            events={eventsDB}
            select={handleDateSelect}
            eventContent={(eventInfo) => (
              <EventsContent
                eventInfo={eventInfo}
                forceCalendarUpdate={forceCalendarUpdate}
                data={data}
              />
            )}
            eventClick={handleEventClick}
            eventOverlap={false}
            editable={false}
            eventDurationEditable={false}
            datesSet={handleDatesSet}
            slotDuration="00:30:00"
            slotMinTime={
              infoClinic ? infoClinic.opening_hours + ":00" : "08:00:00"
            }
            slotMaxTime={
              infoClinic ? infoClinic.closing_hours + ":00" : "21:00:00"
            }
            allDaySlot={false}
            contentHeight={contentHeight}
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: false,
            }}
          />
        </div>
        <div
          className={`absolute top-0 left-0 z-40 w-full h-full backdrop-blur-sm ${
            eventsDB && "hidden"
          }`}
        ></div>
      </div>
      <div className="absolute left-2 top-2 lg:hidden">
        <Button className="border-none" onClick={handleShowBurger}>
          <IoMenu className="text-xl font-semibold" />
        </Button>
      </div>
      {modalModifyIsVisible && (
        <EditShift
          data={data}
          eventInfo={eventClickInfo}
          isVisible={modalModifyIsVisible}
          setModalModifyIsVisible={setModalModifyIsVisible}
          forceCalendarUpdate={forceCalendarUpdate}
        />
      )}
      {showModal && (
        <ScheduleShift
          isVisible={showModal}
          setModalShiftIsVisible={setShowModal}
          data={data}
          forceCalendarUpdate={forceCalendarUpdate}
          dateSelected={infoEventSelected}
          dentistID={dentistID}
        />
      )}
    </>
  );
}

WeeklyCalendar.propTypes = {
  data: PropTypes.object.isRequired,
  modalModifyIsVisible: PropTypes.bool.isRequired,
  setModalModifyIsVisible: PropTypes.func.isRequired,
  forceCalendarUpdate: PropTypes.func.isRequired,
  setOpenDrawer: PropTypes.func.isRequired,
  openDrawer: PropTypes.bool.isRequired,
  eventsDB: PropTypes.array,
  dentistID: PropTypes.string,
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
};
