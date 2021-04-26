import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { promises as fsPromises } from 'fs';
import { google } from "googleapis";

const CREDS_PATH = 'calendarSecret.json';
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];

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

// Delete event
// 1. Check if event already exists
// 2. If event already exists update event
//    2a. If eventData is empty, delete event. Else replace data with this
// 3. Else we create a new event with this eventData

// Add event to calendar, which will have some name, description, time,
// location, and recurrence

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const { userToken, eventData } : {userToken: any, eventData: CalendarEventData} = JSON.parse(req.body);

  const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  const user = await firebaseAdmin.auth().getUser(token.uid);

  // Verify user and that user has custom claim "authorization" to edit the calendar
  if (
    user.emailVerified &&
    user.customClaims?.authorization
  ) {
    if (req.method === 'POST') {
      try {
        const fcontent: Creds = JSON.parse((await fsPromises.readFile(CREDS_PATH)).toString());
        const jwtClient = new google.auth.JWT(fcontent.client_email, undefined, fcontent.private_key,
          SCOPES);
        const _ = await jwtClient.authorize();
        const deleteEventId = await checkEvent(jwtClient, eventData);
        const res = await deleteEvent(jwtClient, deleteEventId, eventData);
        resolve.status(200).send("Success:" + res);
      } catch(err) {
        resolve.status(400).send("Bad request: " + err);
      }
    } else {
      resolve.status(400).send("Invalid request method");
    }
  } else {
    resolve.status(400).send("Error: Unauthorized User");
  }
};

/**
 * check if the given event already exists in the calendar.
 * If exists, get the eventID.
 * @param {JWT} auth JWT object.
 * @param {CalendarEventData} event Event related information.
 */
async function checkEvent(auth: any, event: CalendarEventData) {
  const calendar = google.calendar({version: "v3", auth});
  try {
    const res = await calendar.events.list({
      calendarId: 'slweb@uw.edu',
      q: event.Name,
    });
    const events: any = res.data.items;
    let deleteEventId: string | null = null;
    if (events.length) {
      events.forEach((content: any, index: number) => {
        if (content.summary === event.Name && content.location === event.Location
          && content.organizer.displayName === event.Organization) {
          deleteEventId = content.id;
        }
      })
    }
    return deleteEventId;
  } catch(err) {
    throw new Error("Error:" + err)
  }
}

/**
 * delete an event into the google calender.
 * @param {JWT} auth JWT object.
 * @param {string | null} deleteEventId The Id of the event which need to be deleted or null if no event.
 * @param {CalendarEventData} event Event related information.
 */
async function deleteEvent(auth: any, deleteEventId: string | null,
  event: CalendarEventData) {
  const calendar = google.calendar({version: "v3", auth});
  try {
    if (deleteEventId) {
        const res = await calendar.events.delete({
            calendarId: 'slweb@uw.edu',
            eventId: deleteEventId,
        });
        return res;
    } else {
        throw new Error("Error: No eventId specified.");
    }
  } catch(err) {
    throw new Error("Error:" + err);
  }
}