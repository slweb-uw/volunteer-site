import { NextApiRequest, NextApiResponse, GetServerSideProps } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { promises as fsPromises } from 'fs';;
import * as readline from "readline";
import { google } from "googleapis";
import { Token, TokenClass } from "typescript";
import { GoogleOAuthAccessToken } from "firebase-admin";
import { oauth2 } from "googleapis/build/src/apis/oauth2";
import { useCallback } from "react";

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

export const config = {
  api: {
    externalResolver: true,
  },
};

interface CalendarEventData {
  Name: string;
  Description: string;
  Organization: string;
  Location: string;
  StartDate: Date;
  EndDate: Date;
  Recurrence: string;
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

    // TODO: use something like
    // https://docs.nylas.com/docs/manage-calendar-events-with-nodejs to modify
    // Google Calendar on slweb@uw.edu account
    try {

      resolve.status(200).send("Success");
    } catch(err) {
      resolve.status(400).send("Bad request: " + err);
    }

  } else {
    resolve.status(400).send("Error: Unauthorized User");
  }
};

// Credential object
interface Creds{
  installed: {client_id: string, project_id: string,
              auth_uri: string, token_uri: string,
              auth_provider_x509_cert_url: string,
              client_secret: string, redirect_uris: string[]}
}

// Define a callback function for either update a event or
// add a new event
interface ChangeEvent {
  (auth: any, update: boolean, event: CalendarEventData, calendar: any): void;
}


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
 * check if the given event already exsits in the calendar.
 * @param {google.auth.OAuth2} auth The OAuth2 client to get token for.
 * @param {CalendarEventData} event Event realated information.
 */
function checkEvent(auth: any, event: CalendarEventData, callback: ChangeEvent) {
  const calendar = google.calendar({version: "v3", auth});
  calendar.events.list({
    calendarId: 'primary',
    q: event.Name,
  }, (err: any, res: any) => {
    if (err) throw new Error(err);
    const events = res.data.items;
    let update: boolean = false;
    let eventId: number | null = null;
    if (events.length) {
      events.forEach((content: any, index: number) => {
        if (content.summary === event.Name && content.description)
      })
    }
    callback(auth, update, event, calendar);
  });
}

function addOrUpdateEvent(auth: any, update: boolean, event: CalendarEventData, calendar: any) {
  if (update) {
    calendar.events.update({
      
    })
  } else {

  }
}