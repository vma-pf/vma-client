"use client";
import React, { useEffect, useState } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from "@syncfusion/ej2-react-schedule";
import FullCalendar from "@fullcalendar/react";
import { DateSelectArg, EventApi, EventClickArg, formatDate } from "@fullcalendar/core/index.js";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type ScheduleProps = {
  allDay: boolean;
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
};

const eventData: ScheduleProps[] = [
  {
    id: "1",
    title: "Board Meeting",
    start: new Date(2024, 9, 11, 15, 0),
    end: new Date(2024, 9, 11, 16, 0),
    allDay: false,
    backgroundColor: "#0ea5e9",
  },
  {
    id: "2",
    title: "Training session",
    start: new Date(2024, 9, 12, 14, 0),
    end: new Date(2024, 9, 12, 16, 0),
    allDay: false,
  },
  {
    id: "3",
    title: "Conference",
    start: new Date(2024, 9, 13, 10, 0),
    end: new Date(2024, 9, 13, 12, 0),
    allDay: false,
  },
];

const Schedule = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  //   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Load events from local storage when the component mounts
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        // setCurrentEvents(JSON.parse(savedEvents));
        setCurrentEvents(eventData as EventApi[]);
      }
      localStorage.setItem("events", JSON.stringify(eventData));
    }
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
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">Calendar Events</div>
          <ul className="space-y-4">
            {currentEvents.length <= 0 && <div className="italic text-center text-gray-400">No Events Present</div>}

            {currentEvents.length > 0 &&
              currentEvents.map((event: EventApi) => (
                <li className="border border-gray-200 shadow px-4 py-2 rounded-md text-primary" key={event.id}>
                  {event.title}
                  <br />
                  <label className="text-slate-950">
                    {formatDate(event.start!, {
                      locale: "vi",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {/* Format event start date */}
                  </label>
                </li>
              ))}
          </ul>
        </div>

        <div className="w-9/12 mt-8">
          <FullCalendar
            locale={"vi"}
            timeZone={"Asia/Ho_Chi_Minh"}
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // Initialize calendar with required plugins.
            headerToolbar={{
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }} // Set header toolbar options.
            eventColor={"#10b981"} // Set event color.
            initialView="timeGridWeek" // Initial view mode of the calendar.
            // editable={true} // Allow events to be edited.
            // selectable={true} // Allow dates to be selectable.
            selectMirror={true} // Mirror selections visually.
            dayMaxEvents={true} // Limit the number of events displayed per day.
            select={handleDateClick} // Handle date selection to create new events.
            // eventClick={handleEventClick} // Handle clicking on events (e.g., to delete them).
            eventsSet={(events) => setCurrentEvents(events)} // Update state with current events whenever they change.
            eventDidMount={(event) => {
              // Add a tooltip to each event with its title.
              console.log(event);
              event.el.setAttribute("title", event.event.title);
            }}
            initialEvents={typeof window !== "undefined" ? JSON.parse(localStorage.getItem("events") || "[]") : []} // Initial events loaded from local storage.
          />
        </div>
      </div>

      {/* Dialog for adding new events */}
      <Modal isOpen={isOpen} onClose={handleCloseDialog}>
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalBody>
            <form onSubmit={handleAddEvent}>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDialog} color="danger">
              Cancel
            </Button>
            <Button onClick={handleAddEvent} color="primary">
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Schedule;
