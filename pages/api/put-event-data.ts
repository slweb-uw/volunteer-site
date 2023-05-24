import { useState, useEffect } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import firebase from "firebase/app";
import "firebase/firestore";

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { eventData, userToken }: { eventData: CalendarEventData; userToken: string } = JSON.parse(req.body);
    const token = await firebaseAdmin.auth().verifyIdToken(userToken);
    const user = await firebaseAdmin.auth().getUser(token.uid);
    
    // Admin authentication
    const [admins, setAdmins] = useState<any[]>([]);

    useEffect(() => {
      const fetchAdmins = async () => {
        try {
          const snapshot = await firebase.firestore().collection("Admins").get();
          const adminsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAdmins(adminsData);
        } catch (error) {
          console.error("Error fetching admins", error);
        }
      };
    
      fetchAdmins();
    }, []);
  
    const isAdmin = admins.find((admin) => admin.email === user?.email);

    // Verify user and that the user has custom claim "authorization" to edit events
    if (isAdmin) {
      if (req.method === "POST") {
        let document: any = null;
        if (eventData.id != null) {
          document = firebaseAdmin.firestore().collection(eventData.Location).doc(eventData.id);
        }
        const { update, updateEventId }: { update: boolean; updateEventId: string | null } = await checkEvent(eventData, document);
        const response = await addOrUpdateEvent(update, updateEventId, eventData, document);
        return res.status(200).json(response);
      } else {
        return res.status(400).json({ error: "Invalid request method" });
      }
    } else {
      return res.status(400).json({ error: "Error: Unauthorized User" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Bad request: " + err.message });
  }
};

/**
 * check if the given event already exists in firestore
 * @param {CalendarEventData} event Event related information.
 */
async function checkEvent(event: CalendarEventData, document: any) {
  try {
    let update: boolean = false;
    let updateEventId: string | null = null;

    // Check Firestore if there is an existing event with matching location and name and organization
    if (document && event.id) {
      update = true;
      updateEventId = event.id;
    }
    
    return { update, updateEventId };
  } catch (err) {
    return { update: false, updateEventId: null };
  }
}

async function addOrUpdateEvent(
  update: boolean,
  updateEventId: string | null,
  event: CalendarEventData,
  document: any
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

      const orgDocument = firebaseAdmin.firestore().collection("cache").doc(event.Location);
      const organizations = await orgDocument.get().then((snapshot) => snapshot.data());

      if (!Object.keys(organizations).includes(event.Organization)) {
        let key = event.Organization;
        let res = { [key]: true };
        await orgDocument.set(res, { merge: true });
      }
      return body;
    }
  } catch (err) {
    throw new Error("Error from change: " + err);
  }
}

function createRequestBody(event: CalendarEventData, update: boolean) {
  let result: any = {};
  
  Object.keys(event).forEach((element) => {
    if (event[element] != null) {
      result[element] = event[element];
    }
  });
  
  result["timestamp"] = new Date().toISOString();
  return result;
}
