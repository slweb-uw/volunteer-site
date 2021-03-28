import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { promises as fsPromises } from 'fs';
import { google } from "googleapis";
import * as readline from "readline";

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = '../../token.json';

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
  StartDate: string;    // format according to RFC5545
  EndDate: string;      // format according to RFC5545
  Timezone: string;     // Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich"
  Recurrence: string[]; // format according to RFC5545
}

// Credential object.
interface Creds{
  installed: {client_id: string, project_id: string,
              auth_uri: string, token_uri: string,
              auth_provider_x509_cert_url: string,
              client_secret: string, redirect_uris: string[]}
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
      // TODO: use something like
      // https://docs.nylas.com/docs/manage-calendar-events-with-nodejs to modify
      // Google Calendar on slweb@uw.edu account
      try {
        const fcontent = await fsPromises.readFile('../../credentials.json');
        const auth = authorize(JSON.parse(fcontent.toString()));
        const {update, updateEventId}: {update: boolean,
          updateEventId: string | null} = await checkEvent(auth, eventData);
        await addOrUpdateEvent(auth, update, updateEventId, eventData);
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
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize(credentials: Creds) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  try {
    let data = await (await fsPromises.readFile(TOKEN_PATH)).toString();
    oAuth2Client.setCredentials(JSON.parse(data));
    return oAuth2Client;
  } catch(err) {
    return getAccessToken(oAuth2Client);
  }
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getAccessToken(oAuth2Client: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code: any) => {
    rl.close();
    oAuth2Client.getToken(code, async (err: any, token: any) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      try {
        // Store the token to disk for later program executions
        await fsPromises.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
      } catch(err) {
        console.log(err)
      }
    });
  });
  return oAuth2Client;
}

/**
 * check if the given event already exists in the calendar.
 * @param {google.auth.OAuth2} auth The OAuth2 client to get token for.
 * @param {CalendarEventData} event Event realated information.
 */
async function checkEvent(auth: any, event: CalendarEventData) {
  const calendar = google.calendar({version: "v3", auth});
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
 * @param {google.auth.OAuth2} auth The OAuth2 client to get token for.
 * @param {boolean} update Check if we need to update an exist event or add a new event instead
 * @param {string | null} updateEventId The Id of the event which need to be updated or null if no event.
 * @param {CalendarEventData} event Event realated information.
 */
async function addOrUpdateEvent(auth: any, update: boolean, updateEventId: string | null,
  event: CalendarEventData) {
  const calendar = google.calendar({version: "v3", auth});
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