import { collection, where, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "firebaseClient";
import type { EventData } from "new-types";
import { useEffect, useState, useCallback } from "react";

/**
 * initially returns events of the current month and year,
 * also returns functions to get the nexts months events and previous months events
 * @param location city of where the event is happening
 * @param {string} projectId optional param to fetch only events with project id
 */
export default function useEvents(location: string, projectId?: string) {
  const [curDate, setCurDate] = useState(() => new Date(Date.now()));
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // fetch event data
    const fetchData = async () => {
      const eventsRef = collection(db, "events");
      let q = query(
        eventsRef,
        where("location", "==", location),
        where(
          "calendar",
          "==",
          `${curDate.getFullYear()}-${curDate.getMonth()}`,
        ),
        orderBy("date"),
      );

      if (projectId) {
        q = query(q, where("projectId", "==", projectId));
      }

      const qSnap = await getDocs(q);
      const data: EventData[] = [];
      qSnap.forEach((doc) =>
        data.push({
          id: doc.id,
          ...doc.data(),
        } as EventData),
      );
      setEvents(data);
    };
    fetchData();
  }, [curDate, location, projectId]);

  const nextMonthEvents = useCallback(() => {
    setCurDate((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
  }, [])

  const prevMonthEvents = useCallback(() => {
    setCurDate((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
  }, [])

  return { curDate, events, nextMonthEvents, prevMonthEvents };
}
