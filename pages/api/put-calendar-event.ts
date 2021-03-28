import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { promises as fsPromises } from 'fs';
import { google } from "googleapis";

const TOKEN_PATH = 'calendarApi.json';

export const config = {
  api: {
    externalResolver: true,
  },
};

// The data of the event which needs to be passed in during the api call.
interface CalendarEventData {
  Name: string;
  Description: string;
  Organization: string;
  Location: string;
  StartDate: Date;    // format according to RFC5545, use toISOString() in actual call
  EndDate: Date;      // format according to RFC5545, use toISOString() in actual call
  Timezone: string;     // Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich"
  Recurrence: string[]; // format according to RFC5545
}

// Credential object.
interface Creds{
  key: string
}

// Put new event
// 1. Check if event already exists
// 2. If event already exists update event
//    2a. If eventData is empty, delete event. Else replace data with this
// 3. Else we create a new event with this eventData

// Add event to calendar, which will have some name, description, time,
// location, and recurrence

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const { userToken, eventData } : {userToken: any, eventData: CalendarEventData} = req.body;

  const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  const user = await firebaseAdmin.auth().getUser(token.uid);

  // Verify user and that user has custom claim "authorization" to edit the calendar
  if (
    user.emailVerified &&
    user.customClaims?.authorization
  ) {
    if (req.method === 'POST') {
      try {
        const auth: Creds = JSON.parse((await fsPromises.readFile(TOKEN_PATH)).toString());
        const calendar = google.calendar({
          version: 'v3',
          auth: auth.key
        });
        const {update, updateEventId}: {update: boolean,
          updateEventId: string | null} = await checkEvent(calendar, eventData);
        await addOrUpdateEvent(calendar, update, updateEventId, eventData);
        resolve.status(200).send("Success");
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
 * @param {calendar_v3.Calendar} calendar The OAuth2 client to get token for.
 * @param {CalendarEventData} event Event realated information.
 */
async function checkEvent(calendar: any, event: CalendarEventData) {
  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      q: event.Name,
    });
    const events: any = res.data.items;
    let update: boolean = false;
    let updateEventId: string | null = null;
    if (events.length) {
      events.forEach((content: any, index: number) => {
        if (content.summary === event.Name && content.location === event.Location
          && content.organizer.displayName === event.Organization) {
          update = true;
          updateEventId = content.id;
        }
      })
    }
    return {update, updateEventId};
  } catch(err) {
    throw new Error(err);
  }
}

/**
 * check if the given event already exsits in the calendar.
 * @param {calendar_v3.Calendar} calendar The OAuth2 client to get token for.
 * @param {boolean} update Check if we need to update an exist event or add a new event instead
 * @param {string | null} updateEventId The Id of the event which need to be updated or null if no event.
 * @param {CalendarEventData} event Event realated information.
 */
async function addOrUpdateEvent(calendar: any, update: boolean, updateEventId: string | null,
  event: CalendarEventData) {
  try {
    if (update && updateEventId) {
      const res = await calendar.events.update({
        calendarId: 'primary',
        eventId: updateEventId,
        requestBody: {
          'end': { 'dateTime': event.EndDate, 'timeZone': event.Timezone },
          'start': { 'dateTime': event.StartDate, 'timeZone': event.Timezone},
          'recurrence' : event.Recurrence,
          'description' : event.Description
        },
      });
      return res;
    } else {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          'end': { 'dateTime': event.EndDate, 'timeZone': event.Timezone },
          'start': { 'dateTime': event.StartDate, 'timeZone': event.Timezone},
          'recurrence' : event.Recurrence,
          'description' : event.Description,
          'location': event.Location,
          'summary': event.Name,
          'organizer': { 'displayName': event.Organization }
        }
      });
      return res
    }
  } catch(err) {
    throw new Error(err)
  }
}