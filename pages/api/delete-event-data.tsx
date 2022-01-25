import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

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

  // Verify user and that user has custom claim "authorization" to edit the calendar
  if (user.email === "slweb@uw.edu" || user.email === "slwebuw@gmail.com") {
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
  firebaseAdmin
    .firestore()
    .collection(event.Location)
    .doc(event.id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      throw new Error("Error removing document: ", error);
    });
}
