import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseClient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  expandOccurrences,
  monthKeysForRange,
  type CalendarEventSource,
  type Occurrence,
} from "helpers/calendarEvents";

// Firestore allows at most 30 values in an array-contains-any filter.
const MAX_ANY = 30;

/**
 * Loads the events for whatever date range the calendar is showing.
 *
 * Call `loadRange(start, end)` from FullCalendar's `datesSet`. Each month is
 * fetched once and kept, so paging back and forth doesn't re-read Firestore,
 * and a response that arrives after the location changed is ignored.
 */
export default function useCalendarEvents(location: string, projectId?: string) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generation = useRef(0);
  const sources = useRef(new Map<string, CalendarEventSource>());
  const fetchedMonths = useRef(new Set<string>());
  const range = useRef<{ start: Date; end: Date } | null>(null);
  const inFlight = useRef(0);

  // New location or project: forget everything loaded so far.
  useEffect(() => {
    generation.current += 1;
    sources.current = new Map();
    fetchedMonths.current = new Set();
    inFlight.current = 0;
    setOccurrences([]);
    setError(null);
    setLoading(false);
    if (range.current) void loadRange(range.current.start, range.current.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, projectId]);

  const loadRange = useCallback(
    async (start: Date, end: Date) => {
      range.current = { start, end };
      const gen = generation.current;
      const missing = monthKeysForRange(start, end).filter(
        (key) => !fetchedMonths.current.has(key),
      );

      const rebuild = () =>
        setOccurrences(
          expandOccurrences(
            Array.from(sources.current.values()),
            location,
            start,
            end,
          ),
        );

      if (missing.length === 0) {
        rebuild();
        return;
      }

      inFlight.current += 1;
      setLoading(true);
      try {
        for (let i = 0; i < missing.length; i += MAX_ANY) {
          const keys = missing.slice(i, i + MAX_ANY);
          let q = query(
            collection(db, "events"),
            where("location", "==", location),
            where("calendar", "array-contains-any", keys),
          );
          if (projectId) q = query(q, where("projectId", "==", projectId));
          q = query(q, orderBy("date"));

          const snap = await getDocs(q);
          if (gen !== generation.current) return; // stale response
          snap.forEach((d) =>
            sources.current.set(d.id, {
              id: d.id,
              ...d.data(),
            } as CalendarEventSource),
          );
          keys.forEach((k) => fetchedMonths.current.add(k));
        }
        setError(null);
        rebuild();
      } catch (e) {
        if (gen !== generation.current) return;
        console.error("Failed to load events", e);
        setError("Could not load events. Please try again.");
      } finally {
        if (gen === generation.current) {
          inFlight.current -= 1;
          if (inFlight.current <= 0) setLoading(false);
        }
      }
    },
    [location, projectId],
  );

  return { occurrences, loading, error, loadRange };
}
