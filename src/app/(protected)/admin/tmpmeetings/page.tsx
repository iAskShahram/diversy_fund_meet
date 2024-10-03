"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventClickArg, DateSelectArg } from "calender";
import { useState } from "react";
// import { INITIAL_EVENTS, createEventId } from './event-utils'

let eventGuid = 0;
const todayStr = "2024-01-01"; // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "All-day event",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
];

export function createEventId() {
  return String(eventGuid++);
}

export default function DemoApp() {
  const weekendsVisible = true;
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  
  function handleDateSelect(selectInfo: DateSelectArg) {
    console.log("selectInfo :: ", selectInfo.startStr);
    console.log("selectInfo :: ", selectInfo.endStr);
    console.log("selectInfo :: ", selectInfo.allDay);
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        // allDay: selectInfo.allDay,
      });
    }
  }

  function handleEventClick(clickInfo: EventClickArg) {
    console.log("clickInfo :: ", clickInfo.event);
    console.log("clickInfo :: ", clickInfo.view);
    console.log("clickInfo :: ", clickInfo.jsEvent);
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`,
      )
    ) {
      clickInfo.event.remove();
    }
  }

  function handleEvents(events: any[]) {
    console.log({ events });
    setCurrentEvents(events);
  }

  return (
    <div className="demo-app max-w-screen md:max-h-screen-md mx-48 max-h-screen md:max-w-screen-md">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          // editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
          dateClick={(args) => {
            console.log(args.dateStr);
          }}
          longPressDelay={0}
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <div className="">
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </div>
  );
}
