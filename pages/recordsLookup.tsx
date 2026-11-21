import React, { useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type Query,
} from "firebase/firestore";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { db } from "firebaseClient";
import { useAuth } from "auth";
import AuthorizationMessage from "./AuthorizationMessage";
import { LOG_COLLECTION } from "helpers/volunteerLog";
import {
  toCsv,
  toFullRows,
  toPublicRows,
  type StoredLogEntry,
} from "helpers/recordsExport";

const PURPLE = "#4b2e83";
const MAX_RESULTS = 500;

type Mode = "email" | "event" | "year";

const atText = (e: StoredLogEntry) => {
  const d = e.at?.toDate?.();
  return d ? d.toISOString().replace("T", " ").slice(0, 16) + " UTC" : "";
};

function download(filename: string, csv: string) {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Admin-only lookup of the volunteer log (#225): who signed up for what, who
 * changed it, and when, including signups that have since been withdrawn,
 * removed, or whose event was deleted. For answering records requests.
 */
export default function RecordsLookup() {
  const { user, isAdmin, isLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("email");
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [entries, setEntries] = useState<StoredLogEntry[] | null>(null);
  const [capped, setCapped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const shown = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!entries || !needle) return entries ?? [];
    return entries.filter((e) =>
      [e.volunteer?.name, e.subjectEmail, e.event.name, e.event.projectName, e.event.location]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [entries, filter]);

  if (isLoading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!user || !isAdmin) return <AuthorizationMessage user={user} />;

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = term.trim();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      const log = collection(db, LOG_COLLECTION);
      let q: Query;
      if (mode === "email") {
        q = query(log, where("subjectEmail", "==", value.toLowerCase()), orderBy("at", "desc"), limit(MAX_RESULTS + 1));
      } else if (mode === "event") {
        q = query(log, where("eventId", "==", value), orderBy("at", "desc"), limit(MAX_RESULTS + 1));
      } else {
        const year = Number(value);
        if (!Number.isInteger(year)) throw new Error("Enter a four-digit year, like 2026.");
        q = query(log, where("shiftYear", "==", year), limit(MAX_RESULTS + 1));
      }
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as StoredLogEntry);
      setCapped(rows.length > MAX_RESULTS);
      setEntries(rows.slice(0, MAX_RESULTS));
    } catch (err) {
      console.error("Records lookup failed", err);
      setEntries(null);
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setBusy(false);
    }
  };

  const stamp = new Date().toISOString().slice(0, 10);
  const exportFull = () => {
    if (
      !window.confirm(
        "The full export includes volunteers' email addresses, phone numbers and comments. Use it only for internal, audit or legal requests. Continue?",
      )
    )
      return;
    download(`volunteer-records-full-${stamp}.csv`, toCsv(toFullRows(shown)));
  };
  const exportPublic = () =>
    download(`volunteer-records-public-${stamp}.csv`, toCsv(toPublicRows(shown)));

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 }, fontFamily: "Encode Sans, sans-serif" }}>
      <Typography variant="h1" sx={{ color: PURPLE, fontWeight: 900, fontSize: "2.2rem", mb: 1 }}>
        Volunteer records
      </Typography>
      <Typography sx={{ color: "#555", mb: 3 }}>
        Every signup, edit, withdrawal and removal, including events that have since been deleted. Admins only.
      </Typography>

      <Box component="form" onSubmit={search} sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField select size="small" label="Search by" value={mode} onChange={(e) => setMode(e.target.value as Mode)} sx={{ minWidth: 180 }}>
          <MenuItem value="email">Volunteer email</MenuItem>
          <MenuItem value="event">Event ID</MenuItem>
          <MenuItem value="year">Shift year</MenuItem>
        </TextField>
        <TextField
          size="small"
          label={mode === "email" ? "Email (exact)" : mode === "event" ? "Event ID" : "Year"}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          sx={{ minWidth: 280 }}
        />
        <Button type="submit" variant="contained" disabled={busy || !term.trim()} sx={{ backgroundColor: PURPLE }}>
          {busy ? "Searching..." : "Search"}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {entries && (
        <>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
            <TextField size="small" label="Narrow results (name, event, project)" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 300 }} />
            <Typography variant="body2" sx={{ color: "#555" }}>
              {shown.length} record{shown.length === 1 ? "" : "s"}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="outlined" onClick={exportPublic} disabled={shown.length === 0} sx={{ color: PURPLE, borderColor: PURPLE }}>
              Public release CSV
            </Button>
            <Button variant="outlined" onClick={exportFull} disabled={shown.length === 0} sx={{ color: PURPLE, borderColor: PURPLE }}>
              Full CSV
            </Button>
          </Box>
          <Typography variant="caption" sx={{ display: "block", color: "#555", mb: 2 }}>
            The public release CSV leaves out email addresses, phone numbers, discipline, comments and staff details. Whether a request may be answered with it is for UW&apos;s Office of Public Records to decide.
          </Typography>
          {capped && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Showing the first {MAX_RESULTS} results. Narrow the search to see the rest.
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Logged", "Action", "Shift date", "Event", "Volunteer", "Role", "Done by", "Changes"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {shown.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No records found.</TableCell>
                  </TableRow>
                )}
                {shown.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{atText(e)}</TableCell>
                    <TableCell>{e.action}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{e.shiftDate}</TableCell>
                    <TableCell>
                      {e.event.name}
                      <Typography variant="caption" display="block" sx={{ color: "#666" }}>
                        {[e.event.projectName, e.event.location].filter(Boolean).join(" · ")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {e.volunteer?.name}
                      <Typography variant="caption" display="block" sx={{ color: "#666" }}>{e.subjectEmail}</Typography>
                    </TableCell>
                    <TableCell>{e.volunteer?.role}</TableCell>
                    <TableCell>
                      {e.actorEmail}
                      <Typography variant="caption" display="block" sx={{ color: "#666" }}>{e.actorRole}</Typography>
                    </TableCell>
                    <TableCell>
                      {Object.entries(e.changes ?? {}).map(([field, c]) => (
                        <div key={field}>{field}: “{c.from}” → “{c.to}”</div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
