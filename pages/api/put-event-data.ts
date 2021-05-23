import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export const config = {
  api: {
    externalResolver: true,
  },
};

// Put new event:
// 1. Check if event already exists (check to see if the cache contains the event's organization)
// 2. If event already exists update event
//    2a. If eventData is empty, delete event. Else replace data with this
//    2b. When on delete event, scan all events to see if you can remove the organization from the cache
// 3. Else we create a new event with this eventData
//    3a. Add organization to cache

// WHEN DONE:
//  Use API routes for a componenet (popup modal) that would take an EventData object and 
//  show them all in modifiable text boxes with a save button at the bottom.
//  Should also have a way to add new fields and delete them

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const { eventData } : {eventData: CalendarEventData} = JSON.parse(req.body);

  // const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  // const user = await firebaseAdmin.auth().getUser(token.uid);

  // Verify user and that user has custom claim "authorization" to edit events
  // if (
  //   user.emailVerified &&
  //   user.customClaims?.authorization
  // ) {
    if (req.method === 'POST') {
      try {
        let document = null;
        if (eventData.id != null) {
          document = firebaseAdmin.firestore().collection(eventData.Location).doc(eventData.id)
        }
        const {update, updateEventId}: {update: boolean,
          updateEventId: string | null} = await checkEvent(eventData, document);
        const res = await addOrUpdateEvent(update, updateEventId, eventData, document);
        resolve.status(200).send("Success:" + res);
      } catch(err) {
        resolve.status(400).send("Bad request: " + err);
      }
    } else {
      resolve.status(400).send("Invalid request method");
    }
  // } else {
  //   resolve.status(400).send("Error: Unauthorized User");
  // }
};

/**
 * check if the given event already exists in firestore
 * @param {CalendarEventData} event Event related information.
 */
async function checkEvent(event: CalendarEventData, document: DocumentReference) {
  try {
    let update: boolean = false;
    let updateEventId: string | null = null;

    // check firestore if there is an existing event with matching location and name and organization
    if (document) {
      update = true;
      updateEventId = event.id;
    }
    return {update, updateEventId};
  } catch(err) {
    console.log("error error2");
    return {update: false, updateEventId: null}
  }
}

/**
 * add or update an event
 * @param {boolean} update Check if we need to update an exist event or add a new event instead.
 * @param {string | null} updateEventId The Id of the event which need to be updated or null if no event.
 * @param {CalendarEventData} event Event related information.
 */
async function addOrUpdateEvent(update: boolean, updateEventId: string | null,
  event: CalendarEventData, document: any) {
  try {
    const body = createRequestBody(event, update);
    if (update && updateEventId) {
      document.update({ body })
      return body;
    } else {
      // const res = await calendar.events.insert({
      //   calendarId: 'slweb@uw.edu',
      //   requestBody: body,
      // });
      document = firebaseAdmin.firestore().collection(event.Location).doc();
      body["id"] = document.id;
      console.log(body);
      document.set(body);

      // check if this event is part of a new organization not existing in current cache of orgs.
      const orgs = firebaseAdmin.firestore().collection("cache").doc(event.Location);
      //TODO FIX THIS
      // if (orgs.getBoolean(event.organization) == null) {
      //   let newOrg = event.location;
      //   orgs.update({ newOrg: true });
      // }
      return body;
    }
  } catch(err) {
    console.log("error error3");
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
  // result['description'] = event.Description;
  // result['name'] = event.Name;
  // result['']
  // if (!update) {
  //   result['location'] = event.Location;
  //   result['organization'] = { 'displayName': event.Organization }
  // } 

  // for (val property in event) {
  //   console.log(property);
  //   if (event.property != null) {
  //     result[property] = event[property]    
  //   }
  // }

  //TODO: do another way
  // for the fields in CalendarEventData
  // take the fields that apply to firestore and add to result object
  // then look at the fields that user created and add that to result object
  
  result['Title'] = event.Title;
  result['Project Description'] = event.ProjectDescription;
  result['Location'] = event.Location;
  result['Organization'] = event.Organization;
  if (event.TypesOfVolunteersNeeded != null) {
    result['Types of Volunteers Needed'] = event.TypesOfVolunteersNeeded;
  }
  if (event.ClinicFlow != null) {  
  result["Clinic Flow"] = event.ClinicFlow;
  }
  if (event.ClinicSchedule != null) {
  result['Clinic Schedule'] = event.ClinicSchedule;
  }
  if (event.ContactInformationAndCancellationPolicy != null) {
  result['Contact Information and Cancellation Policy'] = event.ContactInformationAndCancellationPolicy;
  }
  if (event.HSGradStudentInformation != null) {
  result['HS Grad Student Information'] = event.HSGradStudentInformation;
  }
  if (event.ParkingAndDirections != null) {
  result['Parking and Directions'] = event.ParkingAndDirections;
  }
  if (event.ProjectSpecificTraining != null) {
  result['Project Specific Training'] = event.ProjectSpecificTraining;
  }
  if (event.ProviderInformation != null) {
  result['Provider Information'] = event.ProviderInformation;
  }
  if (event.ServicesProvided != null) {
  result['Services Provided'] = event.ServicesProvided;
  }
  if (event.SignupLink != null) {
  result['Sign-up Link'] = event.SignupLink;
  }
  if (event.TipsAndReminders != null) {
  result['Tips and Reminders'] = event.TipsAndReminders;
  }
  if (event.UndergraduateInformation != null) {
  result['Undergraduate Information'] = event.UndergraduateInformation;
  }
  if (event.WebsiteLink != null) {
  result['Website Link'] = event.WebsiteLink;
  }
  result['timestamp'] = new Date().toISOString();

  return result;
}