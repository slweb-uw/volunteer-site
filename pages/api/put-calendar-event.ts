import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { promises as fsPromises } from "fs";
import { google } from "googleapis";
import calendarSecret from "../../calendarSecret.json";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

export const config = {
  api: {
    externalResolver: true,
  },
};

// Credential object.
interface Creds {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

// Put new event
// 1. Check if event already exists
// 2. If event already exists update event
//    2a. If eventData is empty, delete event. Else replace data with this
// 3. Else we create a new event with this eventData

// Add event to calendar, which will have some name, description, time,
// location, and recurrence
export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const {
    eventData,
    userToken,
  }: { eventData: CalendarEventData; userToken: string } = JSON.parse(req.body);

  const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  const user = await firebaseAdmin.auth().getUser(token.uid);

  // Verify user
  if (user.email === "slweb@uw.edu" || user.email === "slwebuw@gmail.com") {
    if (req.method === "POST") {
      try {
        const fcontent: Creds = calendarSecret;
        const jwtClient = new google.auth.JWT(
          fcontent.client_email,
          undefined,
          fcontent.private_key,
          SCOPES
        );
        const _ = await jwtClient.authorize();
        const {
          update,
          updateEventId,
        }: { update: boolean; updateEventId: string | null } = await checkEvent(
          jwtClient,
          eventData
        );
        const res = await addOrUpdateEvent(
          jwtClient,
          update,
          updateEventId,
          eventData
        );
        resolve.status(200).send("Success:" + res);
      } catch (err) {
        console.log("Bad request: " + err);
        resolve.status(400).send("Bad request: " + err);
      }
    } else {
      console.log("Invalid request method");
      resolve.status(400).send("Invalid request method");
    }
  } else {
    console.log("Error: Unauthorized User");
    resolve.status(400).send("Error: Unauthorized User");
  }
};

/**
 * check if the given event already exists in the calendar.
 * @param {JWT} auth JWT object.
 * @param {CalendarEventData} event Event related information.
 */
async function checkEvent(auth: any, event: CalendarEventData) {
  const calendar = google.calendar({ version: "v3", auth });
  try {
    const res = await calendar.events.list({
      calendarId: "slweb@uw.edu",
      q: event.Name,
    });
    const events: any = res.data.items;
    let update: boolean = false;
    let updateEventId: string | null = null;
    if (events.length) {
      events.forEach((content: any, index: number) => {
        if (
          content.summary === event.Name &&
          content.location === event.Location &&
          content.organizer.displayName === event.Organization
        ) {
          update = true;
          updateEventId = content.id;
        }
      });
    }
    return { update, updateEventId };
  } catch (err) {
    return { update: false, updateEventId: null };
  }
}

/**
 * add or update an event into the google calender.
 * @param {JWT} auth JWT object.
 * @param {boolean} update Check if we need to update an exist event or add a new event instead.
 * @param {string | null} updateEventId The Id of the event which need to be updated or null if no event.
 * @param {CalendarEventData} event Event related information.
 */
async function addOrUpdateEvent(
  auth: any,
  update: boolean,
  updateEventId: string | null,
  event: CalendarEventData
) {
  const calendar = google.calendar({ version: "v3", auth });
  try {
    let body = createRequestBody(event, update);
    if (update && updateEventId) {
      const res = await calendar.events.update({
        calendarId: "slweb@uw.edu",
        eventId: updateEventId,
        requestBody: body,
      });
      return res;
    } else {
      const res = await calendar.events.insert({
        calendarId: "slweb@uw.edu",
        requestBody: body,
      });
      return res;
    }
  } catch (err) {
    throw new Error("Error from change:" + err);
  }
}

/**
 * construct the request body for addOrUpdateEvent function.
 * @param {CalendarEventData} event Event data.
 * @param {boolean} update Check if this is a update request body or insert event request body
 */
function createRequestBody(event: CalendarEventData, update: boolean) {
  let result: any = {};
  result["end"] = { dateTime: event.EndDate, timeZone: event.Timezone };
  result["start"] = { dateTime: event.StartDate, timeZone: event.Timezone };
  result["description"] = event.Description;
  if (!update) {
    result["location"] = event.Location;
    result["summary"] = event.Name;
    result["organizer"] = { displayName: event.Organization };
  }
  if (event.Recurrence) {
    result["recurrence"] = event.Recurrence;
  }
  return result;
}

/**
 * the following is a simple test script for the above api.
 * comment out the firbase verification part before running the following script.
 * Use node to run the following script.
"use strict";
exports.__esModule = true;
var http_1 = require("http");
var start = new Date(500000000000);
var end = new Date(500009000000);
var data = { Name: "test", Description: "https://www.google.com", Organization: "test", Location: "test", StartDate: start.toISOString(), EndDate: end.toISOString(), Timezone: "America/Los_Angeles" };
var req = http_1.request({
    host: 'localhost',
    port: '3000',
    path: '/api/put-calendar-event',
    method: 'POST'
}, function (response) { console.log(response.statusMessage); response.on('data', function (chunk) { console.log('body:' + chunk); }); });
req.write(JSON.stringify({
    userToken: "test",
    eventData: data
}));
req.end();
*/
