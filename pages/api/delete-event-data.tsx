import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

export const config = {
  api: {
    externalResolver: true,
  },
};

// Delete event
export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const {
    userToken,
    eventData,
  }: { userToken: any; eventData: CalendarEventData } = JSON.parse(req.body);

  const token = await firebaseAdmin.auth().verifyIdToken(userToken);
  const user = await firebaseAdmin.auth().getUser(token.uid);

  // Admin authentication
  const [admins, setAdmins] = useState([]);

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

  // Verify user and that user has custom claim "authorization" to edit the calendar
  if (isAdmin) {
    if (req.method === "POST") {
      try {
        const res = await deleteEvent(eventData);
        resolve.status(200).send("Success:" + res);
      } catch (err) {
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
 * delete an event in firestore
 * @param {CalendarEventData} event Event related information.
 */
async function deleteEvent(event: CalendarEventData) {
  if (!event.id) {
    throw new Error("Event ID is missing from data");
  }
  firebaseAdmin
    .firestore()
    .collection(event.Location)
    .doc(event.id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      throw new Error("Error removing document: " + error);
    });
}
