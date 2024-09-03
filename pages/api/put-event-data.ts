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
//  Use API routes for a componenet (popup modal) that would take an ProjectData object and
//  show them all in modifiable text boxes with a save button at the bottom.
//  Should also have a way to add new fields and delete them

export default async function handler(
  req: NextApiRequest,
  resolve: NextApiResponse,
) {
  const {
    eventData,
    userToken,
  }: { eventData: CalendarEventData; userToken: string } = JSON.parse(req.body);
  console.log(eventData);

  const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  const user = await firebaseAdmin.auth().getUser(token.uid);

  console.log(user, "I am putting an event into the calendar")

  if (req.method === "POST") {
    try {
      let document = null;
      if (eventData.id != null) {
        document = firebaseAdmin
          .firestore()
          .collection(eventData.Location)
          .doc(eventData.id);
      }
      const {
        update,
        updateEventId,
      }: { update: boolean; updateEventId: string | null } = await checkEvent(
        eventData,
        document,
      );
      const res = await addOrUpdateEvent(
        update,
        updateEventId,
        eventData,
        document,
      );
      resolve.status(200).send(JSON.stringify(res));
    } catch (err) {
      resolve.status(400).send("Bad request: " + err);
    }
  } else {
    resolve.status(400).send("Invalid request method");
  }
}

/**
 * check if the given event already exists in firestore
 * @param {CalendarEventData} event Event related information.
 */
async function checkEvent(event: CalendarEventData, document: any) {
  try {
    let update: boolean = false;
    let updateEventId: string | null = null;

    // check firestore if there is an existing event with matching location and name and organization
    if (document && event.id) {
      update = true;
      updateEventId = event.id;
    }
    return { update, updateEventId };
  } catch (err) {
    return { update: false, updateEventId: null };
  }
}

/**
 * add or update an event
 * @param {boolean} update Check if we need to update an exist event or add a new event instead.
 * @param {string | null} updateEventId The Id of the event which need to be updated or null if no event.
 * @param {CalendarEventData} event Event related information.
 */
async function addOrUpdateEvent(
  update: boolean,
  updateEventId: string | null,
  event: CalendarEventData,
  document: any,
) {
  try {
    const body = createRequestBody(event, update);
    if (update && updateEventId) {
      await document.update({ ...body });
      return body;
    } else {
      document = firebaseAdmin.firestore().collection(event.Location).doc();
      body["id"] = document.id;
      await document.set(body);

      // check if this event is part of a new organization not existing in current cache of orgs.
      document = firebaseAdmin
        .firestore()
        .collection("cache")
        .doc(event.Location);

      let organizations = await document.get();

      // organizations = organizations.then((snapshot) => {
      //   return snapshot.data();
      // });

      organizations = await organizations.data();

      console.log(organizations);

      if (!Object.keys(organizations).includes(event.Organization)) {
        let key = event.Organization;
        let res = { [key]: true };
        await document.set(res, { merge: true });
      }
      return body;
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
  // result['description'] = event.Description;
  // if (!update) {
  //   result['location'] = event.Location;
  //   result['organization'] = { 'displayName': event.Organization }
  // }

  Object.keys(event).forEach((element) => {
    if (event[element] != null) {
      result[element] = event[element];
    }
  });
  result["timestamp"] = new Date().toISOString();
  return result;
}
