import useEvents from "hooks/useEvents";
import { useEffect, useMemo, useState } from "react";
import { Button, Typography, Card, CardActionArea, IconButton } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import type { EventData } from "new-types";
import Link from "next/link";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import router from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseClient";

const useStyles = makeStyles(() => ({
  pageContainer: {
    padding: "2rem 4rem",
    fontFamily: "Encode Sans, sans-serif",
  },
  backBtn: {
    color: "#4b2e83",
    fontWeight: 700,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    padding: 0,
    marginBottom: "1rem",
    minWidth: "auto",
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
    "& .MuiButton-startIcon": {
      marginRight: "4px",
    },
    "& svg": {
      fontSize: "0.8rem !important",
    }
  },
  mainTitle: {
    color: "#4b2e83",
    fontWeight: 900,
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    lineHeight: 1.1,
  },
  metaRow: {
    display: "flex",
    gap: "2rem",
    color: "#666",
    marginBottom: "3rem",
    alignItems: "center",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.95rem",
    "& svg": {
      color: "#666",
      fontSize: "1.2rem",
    }
  },
  monthNavContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  dateTitle: {
    color: "black",
    fontWeight: 800,
    fontSize: "1.8rem",
  },
  navIconBtn: {
    color: "#4b2e83",
    padding: 0,
    "& svg": {
        fontSize: "2rem",
        fontWeight: "bold"
    }
  }
}));

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

  const [projectName, setProjectName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const styles = useStyles();

  useEffect(() => {
    if (!location || !projectId) return;

    const fetchProjectData = async () => {
      try {
        const docRef = doc(db, location, projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProjectName(data.Title || "Project");
          setProjectAddress(data.Location || data.Address || location);
        }
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectData();
  }, [location, projectId]);

  return (
    <div className={styles.pageContainer}>
      <Button 
        className={styles.backBtn}
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => router.back()}
      >
        BACK
      </Button>

      {/* Main Title */}
      <Typography variant="h1" className={styles.mainTitle}>
        {projectName ? `${projectName} - Calendar` : `${location} - Calendar`}
      </Typography>

      {/* Address & Contact */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
            <LocationOnOutlinedIcon />
            <Typography variant="body1">
              {projectAddress}
            </Typography>
        </div>
        <div className={styles.metaItem}>
            <DescriptionOutlinedIcon />
            <Typography variant="body1">Contact</Typography>
        </div>
      </div>

      {/* Month Navigation*/}
      <div className={styles.monthNavContainer}>
        <IconButton onClick={prevMonthEvents} className={styles.navIconBtn}>
            <ChevronLeftIcon />
        </IconButton>
        
        <Typography variant="h4" className={styles.dateTitle}>
            {`${months.get(curDate.getMonth())} ${curDate.getFullYear()}`}
        </Typography>

        <IconButton onClick={nextMonthEvents} className={styles.navIconBtn}>
            <ChevronRightIcon />
        </IconButton>
      </div>

      {/* Calendar Grid */}
      <CalendarView curDate={curDate} events={events}/>
    </div>
  );
}

function CalendarView({ curDate, events }: { curDate: Date; events: any }) {
  const dates = useMemo(
    () => getDaysInMonth(curDate.getMonth(), curDate.getFullYear()),
    [curDate],
  );
  return (
    <div style={{ padding: "1rem 2rem" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8}}>
              {getEventsForDate(date, events).map((event) => (
                <Card key={`${event.id}-${date.toISOString()}`} style={{ boxShadow: "none", backgroundColor: "#C5B4E3", padding: "4px"}}>
                  <Link
                    href={`/calendar/${event.id}/signup?date=${date.toISOString()}`}
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    <CardActionArea>
                      <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                        {event.name}
                      </Typography>
                      <Typography>
                        <span>{timeToLocaleTime(event.startTime)}</span>-
                        <span>{timeToLocaleTime(event.endTime)}</span>
                      </Typography>
                    </CardActionArea>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function getEventsForDate(date: Date, events: EventData[]) {
  return events.filter((event) => {
    // Helper to check if two JS Dates are the same Day/Month/Year
    const isSameDay = (d1: Date, d2: Date) => 
        d1.getDate() === d2.getDate() && 
        d1.getMonth() === d2.getMonth() && 
        d1.getFullYear() === d2.getFullYear();

    if (event.date && isSameDay(event.date.toDate(), date)) return true;

    if (event.dates && Array.isArray(event.dates)) {
        return event.dates.some((timestamp: any) => isSameDay(timestamp.toDate(), date));
    }
    
    return false;
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
