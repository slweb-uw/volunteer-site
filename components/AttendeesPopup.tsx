import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ContactPageIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseClient";
import { useAuth } from "auth";
import type { VolunteerData } from "new-types";

type Attendee = VolunteerData & {
  docId: string;
};

type AttendeesPopupProps = {
  eventId: string;
  eventName: string;
};

export default function AttendeesPopup({
  eventId,
  eventName,
}: AttendeesPopupProps) {
  const { user, isAdmin, isLead, isLoading } = useAuth();
  const canView = !isLoading && Boolean(user) && (isAdmin || isLead);

  const [open, setOpen] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !canView || !user) return;

    let cancelled = false;

    const loadAttendees = async () => {
      setLoading(true);
      setError("");
      setAttendees([]);

      try {
        const snapshot = await getDocs(
          collection(db, "events", eventId, "volunteers"),
        );

        const records = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            ...data,
            docId: document.id,
            date:
              typeof data.date === "string"
                ? data.date
                : data.date?.toDate?.().toISOString() ?? "",
          } as Attendee;
        });

        if (!cancelled) {
          setAttendees(records);
        }
      } catch (error) {
        console.error("Could not load attendees:", error);

        if (!cancelled) {
          setError("Could not load attendees. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAttendees();

    return () => {
      cancelled = true;
    };
  }, [open, canView, user, eventId]);

  if (!canView) return null;

  const popupContent = (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {eventName} Attendees
        </Typography>

        <IconButton
          size="small"
          aria-label="Close attendees"
          onClick={() => setOpen(false)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="body2">Loading attendees…</Typography>
        </Box>
      ) : error ? (
        <Typography color="error" role="alert">
          {error}
        </Typography>
      ) : attendees.length === 0 ? (
        <Typography variant="body2">
          No volunteers registered yet.
        </Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table
            size="small"
            stickyHeader
            aria-label={`${eventName} attendees`}
            sx={{ minWidth: 650 }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Student Discipline</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendees.map((row) => (
                <TableRow key={row.docId}>
                  <TableCell>{row.email || "—"}</TableCell>
                  <TableCell>{row.name || "—"}</TableCell>
                  <TableCell>{row.phoneNumber || "—"}</TableCell>
                  <TableCell>{row.studentDiscipline || "—"}</TableCell>
                  <TableCell
                    sx={{ minWidth: 140, whiteSpace: "pre-wrap" }}
                  >
                    {row.comments || "—"}
                  </TableCell>
                  <TableCell>{row.role || "—"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {row.date ? row.date.split("T")[0] : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Tooltip
      title={popupContent}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      placement="bottom-end"
      enterDelay={250}
      leaveDelay={200}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 6,
            border: "1px solid",
            borderColor: "divider",
            maxWidth: "min(900px, 90vw)",
          },
        },
        arrow: {
          sx: { color: "background.paper" },
        },
      }}
    >
      <IconButton
        size="small"
        aria-label={`View attendees for ${eventName}`}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <ContactPageIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}