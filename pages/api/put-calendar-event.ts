import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export const config = {
  api: {
    externalResolver: true,
  },
};

// Put new event
// 1. Check if event already exists
// 2. If event already exists update event
//    2a. If eventData is empty, delete event. Else replace data with this
// 3. Else we create a new event with this eventData

// Add event to calendar, which will have some name, description, time,
// location, and recurrence

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const { userToken, eventData } : {userToken: any, eventData: any} = req.body;

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
    

  } else {
    resolve.status(400).send("Error: Unauthorized User");
  }
};
