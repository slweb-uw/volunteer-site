import useEvents from "hooks/useEvents";
import { useMemo } from "react";
import { Button, Typography, Card, CardActionArea } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import type { EventData } from "new-types";
import Link from "next/link";

export default function EventsView({
  location,
  projectId,
}: {
  location: string;
  projectId?: string;
}) {
  // pass in a function so it only runs once
  const { events, nextMonthEvents, prevMonthEvents, curDate } = useEvents(
    location,
    projectId,
  );

  const styles = useStyles();

  return (
    <div>
      <Typography
        variant="h4"
        className={styles.dateTitle}
        style={{ padding: "1rem 2rem" }}
      >{`${months.get(curDate.getMonth())} ${curDate.getFullYear()}`}</Typography>

      <Button onClick={prevMonthEvents}>Back</Button>
      <Button onClick={nextMonthEvents}>Next</Button>
      <CalendarView curDate={curDate} events={events} />
    </div>
  );
}

function CalendarView({ curDate, events }: { curDate: Date; events: any }) {
  // calculate dates for calendar whenever user changes calendar date
  const dates = useMemo(
    () => getDaysInMonth(curDate.getMonth(), curDate.getFullYear()),
    [curDate],
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {DAYS.map((day) => (
          <Typography key={day} style={{ padding: 8, fontWeight: 600 }}>
            {day}
          </Typography>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridGap: "1px",
          padding: "0 0.25rem",
          background: "#f0f0f0",
        }}
      >
        {dates.map((date, i) => (
          <div
            key={date.toISOString()}
            style={{
              gridColumnStart: i === 0 ? date.getDay() + 1 : "",
              outline: "1px solid gray",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 8,
              background: "white",
            }}
          >
            <Typography>{date.getDate()}</Typography>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {getEventsForDate(date, events).map((event) => (
                <Card key={event.id} style={{ boxShadow: "none" }}>
                  <Link
                    href={`/calendar/${event.id}`}
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    <CardActionArea>
                      <Typography style={{ fontWeight: 600 }}>
                        <span>{timeToLocaleTime(event.startTime)}</span>-
                        <span>{timeToLocaleTime(event.endTime)}</span>
                      </Typography>
                      <Typography variant="subtitle1">
                        {event.projectName}
                      </Typography>
                    </CardActionArea>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function getEventsForDate(date: Date, events: EventData[]) {
  return events.filter((event) => {
    const eventDate: Date = event.date.toDate();
    const eventMonth = eventDate.getMonth();
    const eventDay = eventDate.getDate();
    return eventMonth === date.getMonth() && eventDay === date.getDate();
  });
}

function timeToLocaleTime(time: string) {
  // date does not matter only the time
  return new Date("2004-04-04T" + time + "Z").toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
}

function getDaysInMonth(month: number, year: number) {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const useStyles = makeStyles(() => ({
  dateTitle: {
    color: "black",
    fontWeight: 800,
  },
}));

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = new Map();
months.set(0, "January");
months.set(1, "February");
months.set(2, "March");
months.set(3, "April");
months.set(4, "May");
months.set(5, "June");
months.set(6, "July");
months.set(7, "August");
months.set(8, "September");
months.set(9, "October");
months.set(10, "November");
months.set(11, "December");

const styles = createStyles({
  calendar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "100%",
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "2rem",
    marginTop: "1.5rem",
  },
  backBtn: {
    width: "100px",
    marginTop: "1.5rem",
    marginLeft: "2.5vw",
    fontFamily: "Encode Sans",
    fontWeight: 800,
    borderRadius: 10,
    "&:hover": {
      color: "#B7A57A",
      transition: ".25s",
    },
  },
});
