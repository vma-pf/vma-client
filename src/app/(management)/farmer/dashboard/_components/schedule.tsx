"use client";
import React, { useEffect, useState } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from "@syncfusion/ej2-react-schedule";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventApi, EventClickArg, formatDate } from "@fullcalendar/core/index.js";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { scheduleService } from "@oursrc/lib/services/scheduleService";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";

type ScheduleProps = {
  allDay: boolean;
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
};

const Schedule = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  //   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [eventData, setEventData] = useState<ScheduleProps[]>([]);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchEvents = async () => {
    try {
      const response: ResponseObject<any> = await scheduleService.getAllSchedules();
      if (response.isSuccess) {
        const events: ScheduleProps[] = (response.data as any[]).map((event: any) => ({
          id: event.id,
          title: event.type === 0 ? "Tiêm phòng" + " - " + event.title : event.type === 1 ? "Khám bệnh" + " - " + event.title : event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: true,
          backgroundColor: event.isDone ? "#808080" : event.type === 0 ? "#0ea5e9" : event.type === 1 ? "#10b981" : "#f59e0b",
          isDone: event.isDone,
          type: event.type,
        }));
        setEventData(events);
        localStorage.setItem("all-events", JSON.stringify(events));
        setCurrentEvents(events.filter((event) => new Date(event.start).getMonth() === new Date().getMonth()) as EventApi[]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
    // const savedEvents = localStorage.getItem("events");
    // if (savedEvents) {
    //   setCurrentEvents(eventData as EventApi[]);
    // }
    // localStorage.setItem("events", JSON.stringify(eventData));
  }, []);

  // useEffect(() => {
  //   // Save events to local storage whenever they change
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("events", JSON.stringify(currentEvents));
  //   }
  // }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    onOpen();
  };

  const handleEventClick = (selected: EventClickArg) => {
    // Prompt user for confirmation before deleting an event
    if (window.confirm(`Are you sure you want to delete the event "${selected.event.title}"?`)) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    onClose();
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar; // Get the calendar API instance.
      calendarApi.unselect(); // Unselect the date range.

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div>
      <p className="text-xl font-semibold">Tổng quan lịch trình</p>
      <div className="w-full overflow-auto h-fit px-3 mt-5 pb-10">
        {/* <div className="w-full h-fit overflow-auto mt-5"> */}
        <FullCalendar
          locale={"vi"}
          timeZone={"Asia/Ho_Chi_Minh"}
          height={"65vh"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }} // Set header toolbar options.
          // eventColor={"#10b981"} // Set event color.
          initialView="dayGridMonth" // Initial view mode of the calendar.
          // editable={true} // Allow events to be edited.
          // selectable={true} // Allow dates to be selectable.
          selectMirror={true} // Mirror selections visually.
          dayMaxEvents={true} // Limit the number of events displayed per day.
          select={handleDateClick} // Handle date selection to create new events.
          // eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
          eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
          eventDidMount={(event) => {
            // Add a tooltip to each event with its title.
            // console.log(event);
            // event.el.setAttribute("title", event.event.title);
          }}
          initialEvents={typeof window !== "undefined" ? JSON.parse(localStorage.getItem("all-events") || "[]") : []} // Initial events loaded from local storage.
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Schedule;
