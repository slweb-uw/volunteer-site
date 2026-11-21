import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebaseAdmin";
import { Location } from "helpers/locations";
import {
  expandOccurrences,
  monthKeysForRange,
  type CalendarEventSource,
} from "helpers/calendarEvents";
import { buildIcs } from "helpers/ics";

const DAY = 86_400_000;

/**
 * Subscribable calendar feed: /api/calendar/Seattle.ics?project=a,b&type=x,y
 *
 * Public on purpose (events are already public-read) and cached, so a
 * subscribed calendar app polling it doesn't hit Firestore each time. Contains
 * no lead email or other contact details.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const raw = String(req.query.location ?? "").replace(/\.ics$/i, "");
  const location = Object.values(Location).find(
    (l) => l.toLowerCase() === raw.toLowerCase(),
  );
  if (!location) {
    return res.status(404).json({ error: "Unknown location." });
  }

  const list = (v: unknown) =>
    String(Array.isArray(v) ? v.join(",") : (v ?? ""))
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const projects = list(req.query.project);
  const types = list(req.query.type);

  // 30 days back to 12 months ahead.
  const now = new Date();
  const start = new Date(now.getTime() - 30 * DAY);
  const end = new Date(now.getTime() + 365 * DAY);
  const monthKeys = monthKeysForRange(start, end); // 14 months, under the 30 limit

  try {
    const snap = await firebaseAdmin
      .firestore()
      .collection("events")
      .where("location", "==", location)
      .where("calendar", "array-contains-any", monthKeys)
      .get();

    const sources: CalendarEventSource[] = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as CalendarEventSource,
    );

    const occurrences = expandOccurrences(sources, location, start, end).filter(
      (o) =>
        (projects.length === 0 || projects.includes(o.projectId)) &&
        (types.length === 0 || o.volunteerTypes.some((t) => types.includes(t))),
    );

    const proto = String(req.headers["x-forwarded-proto"] ?? "https").split(",")[0];
    const baseUrl = `${proto}://${req.headers.host ?? "localhost"}`;
    const body = buildIcs(occurrences, {
      baseUrl,
      calendarName: `${location} volunteer events`,
      now,
    });

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="${location}.ics"`);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(body);
  } catch (e) {
    console.error("calendar feed failed", e);
    return res.status(500).json({ error: "Could not build the calendar." });
  }
}
