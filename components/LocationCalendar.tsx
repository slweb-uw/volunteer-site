import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import luxon3Plugin from "@fullcalendar/luxon3";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseClient";
import { useAuth } from "auth";
import useCalendarEvents from "hooks/useCalendarEvents";
import type { Occurrence } from "helpers/calendarEvents";
import { buildIcs, googleCalendarUrl, signupUrl } from "helpers/ics";
import { eventTimeZone, timeZoneLabel } from "helpers/timezones";

const PURPLE = "#4b2e83";

const csv = (v: unknown) =>
  String(Array.isArray(v) ? v[0] : (v ?? ""))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function LocationCalendar({
  location,
  projectId,
}: {
  location: string;
  projectId?: string;
}) {
  const router = useRouter();
  const { isLead, isAdmin, isLoading } = useAuth();
  const canManage = !isLoading && (isAdmin || isLead);

  const { occurrences, loading, error, loadRange } = useCalendarEvents(
    location,
    projectId,
  );
  const timeZone = eventTimeZone(undefined, location);

  // Filters live in the URL so a view can be shared and matches the feed link.
  const [projects, setProjects] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [showPast, setShowPast] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    setProjects(csv(router.query.projects));
    setTypes(csv(router.query.types));
    setShowPast(router.query.past !== "0");
    setReady(true);
    // Read the URL once, on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);
  useEffect(() => {
    if (!ready) return;
    const query: Record<string, any> = { ...router.query };
    delete query.projects;
    delete query.types;
    delete query.past;
    if (projects.length) query.projects = projects.join(",");
    if (types.length) query.types = types.join(",");
    if (!showPast) query.past = "0";
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, types, showPast, ready]);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (!projectId) return;
    getDoc(doc(db, location, projectId))
      .then((snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        setTitle(data.Title || "");
        setAddress(data.Location || data.Address || "");
      })
      .catch((e) => console.error("Error fetching project", e));
  }, [location, projectId]);

  const now = Date.now();
  const projectOptions = useMemo(() => {
    const byId = new Map<string, string>();
    occurrences.forEach((o) => o.projectId && byId.set(o.projectId, o.projectName));
    return Array.from(byId.entries()).map(([id, name]) => ({ id, name }));
  }, [occurrences]);
  const typeOptions = useMemo(
    () => Array.from(new Set(occurrences.flatMap((o) => o.volunteerTypes))).sort(),
    [occurrences],
  );

  const visible = useMemo(
    () =>
      occurrences.filter(
        (o) =>
          (projects.length === 0 || projects.includes(o.projectId)) &&
          (types.length === 0 || o.volunteerTypes.some((t) => types.includes(t))) &&
          (showPast || o.end.getTime() >= now),
      ),
    // `now` changes every render; recomputing on data and filter changes is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [occurrences, projects, types, showPast],
  );

  const calendarEvents = useMemo(
    () =>
      visible.map((o) => {
        const past = o.end.getTime() < Date.now();
        return {
          id: o.id,
          title: o.name,
          start: o.start,
          end: o.end,
          allDay: o.allDay,
          classNames: past && !canManage ? ["sl-past"] : [],
          extendedProps: { occ: o },
        };
      }),
    [visible, canManage],
  );

  const [selected, setSelected] = useState<Occurrence | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const initialView = useMemo(
    () =>
      typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches
        ? "listMonth"
        : "dayGridMonth",
    [],
  );

  const feedQuery = new URLSearchParams();
  const feedProjects = projectId ? [projectId] : projects;
  if (feedProjects.length) feedQuery.set("project", feedProjects.join(","));
  if (types.length) feedQuery.set("type", types.join(","));
  const feedUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/api/calendar/${location}.ics` +
        (feedQuery.toString() ? `?${feedQuery.toString()}` : "");
  const webcalUrl = feedUrl.replace(/^https?:/, "webcal:");
  const googleSubscribeUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this calendar link:", feedUrl);
    }
  };

  return (
    <Box sx={{ p: { xs: "1rem", md: "2rem 4rem" }, fontFamily: "Encode Sans, sans-serif" }}>
      <Button
        startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "0.8rem !important" }} />}
        onClick={() => router.back()}
        sx={{ color: PURPLE, fontWeight: 700, p: 0, mb: 2, minWidth: "auto" }}
      >
        Back
      </Button>

      <Typography variant="h1" sx={{ color: PURPLE, fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.5rem" }, lineHeight: 1.1 }}>
        {title ? `${title} - Calendar` : `${location} - Calendar`}
      </Typography>
      {address && (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", color: "#666", mt: 1 }}>
          <LocationOnOutlinedIcon fontSize="small" />
          <Typography variant="body1">{address}</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", my: 3 }}>
        {!projectId && (
          <Autocomplete
            multiple
            size="small"
            sx={{ minWidth: 240 }}
            options={projectOptions.map((p) => p.id)}
            getOptionLabel={(id) => projectOptions.find((p) => p.id === id)?.name ?? id}
            value={projects}
            onChange={(_, v) => setProjects(v)}
            renderInput={(params) => <TextField {...params} label="Projects" />}
          />
        )}
        <Autocomplete
          multiple
          size="small"
          sx={{ minWidth: 240 }}
          options={typeOptions}
          value={types}
          onChange={(_, v) => setTypes(v)}
          renderInput={(params) => <TextField {...params} label="Volunteer type" />}
        />
        <FormControlLabel
          control={<Switch checked={showPast} onChange={(e) => setShowPast(e.target.checked)} />}
          label="Show past events"
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: PURPLE, borderColor: PURPLE }}>
          Subscribe
        </Button>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          <MenuItem component="a" href={googleSubscribeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuAnchor(null)}>
            Google Calendar
          </MenuItem>
          <MenuItem component="a" href={webcalUrl} onClick={() => setMenuAnchor(null)}>
            Apple Calendar / Outlook
          </MenuItem>
          <MenuItem onClick={copyFeed}>{copied ? "Copied!" : "Copy calendar link"}</MenuItem>
        </Menu>
      </Box>

      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
        Times shown in {timeZoneLabel(timeZone)}
      </Typography>
      {loading && <LinearProgress sx={{ mb: 1 }} />}
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <Box
        sx={{
          "& .fc-event": { cursor: "pointer" },
          "& .sl-past": { opacity: 0.7, filter: "grayscale(1)", cursor: "not-allowed" },
          "& .fc-button-primary": { backgroundColor: PURPLE, borderColor: PURPLE },
          "& .fc-button-primary:not(:disabled).fc-button-active, & .fc-button-primary:not(:disabled):active": {
            backgroundColor: "#32006e",
            borderColor: "#32006e",
          },
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, luxon3Plugin]}
          initialView={initialView}
          timeZone={timeZone}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          buttonText={{ today: "Today", month: "Month", week: "Week", day: "Day", list: "List" }}
          height="auto"
          dayMaxEvents={3}
          events={calendarEvents}
          eventColor="#C5B4E3"
          eventTextColor="#000"
          eventBorderColor="#C5B4E3"
          datesSet={(arg) => void loadRange(arg.start, arg.end)}
          eventClick={(arg) => {
            arg.jsEvent.preventDefault();
            setSelected(arg.event.extendedProps.occ as Occurrence);
          }}
          noEventsContent="No events"
        />
      </Box>

      <EventDialog occ={selected} canManage={canManage} onClose={() => setSelected(null)} />
    </Box>
  );
}

function EventDialog({
  occ,
  canManage,
  onClose,
}: {
  occ: Occurrence | null;
  canManage: boolean;
  onClose: () => void;
}) {
  if (!occ) return null;
  const past = occ.end.getTime() < Date.now();
  const canSignUp = !past || canManage;
  const base = window.location.origin;

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: occ.timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(occ.start);
  const time = (d: Date, zoneName?: "short") =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: occ.timeZone,
      hour: "numeric",
      minute: "2-digit",
      ...(zoneName ? { timeZoneName: zoneName } : {}),
    }).format(d);

  const downloadIcs = () => {
    const text = buildIcs([occ], { baseUrl: base, calendarName: occ.name });
    const url = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${occ.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "event"}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: PURPLE, fontWeight: 800 }}>{occ.name}</DialogTitle>
      <DialogContent>
        {occ.projectName && (
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{occ.projectName}</Typography>
        )}
        <Typography>{day}</Typography>
        <Typography sx={{ mb: 1 }}>
          {occ.allDay ? "All day" : `${time(occ.start)} – ${time(occ.end, "short")}`}
        </Typography>
        {occ.address && (
          <Typography sx={{ mb: 1 }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(occ.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {occ.address}
            </a>
          </Typography>
        )}
        {occ.volunteerTypes.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
            {occ.volunteerTypes.map((t) => <Chip key={t} size="small" label={t} />)}
          </Box>
        )}
        {occ.requiredTraining && (
          <Typography variant="body2" sx={{ mb: 1 }}>Required training: {occ.requiredTraining}</Typography>
        )}
        {past && (
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Past event{canManage ? "" : " (sign-up closed)"}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: "wrap", gap: 1, px: 3, pb: 2 }}>
        {!past && (
          <>
            <Button size="small" component="a" href={googleCalendarUrl(occ, base)} target="_blank" rel="noopener noreferrer">
              Add to Google Calendar
            </Button>
            <Button size="small" onClick={downloadIcs}>Download .ics</Button>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={onClose}>Close</Button>
        {canSignUp && (
          <Button variant="contained" component={Link} href={signupUrl("", occ)} sx={{ backgroundColor: PURPLE }}>
            Sign up
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
