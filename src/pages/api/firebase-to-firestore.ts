import { firestore } from "firebase-admin"
import { NextApiRequest, NextApiResponse } from "next"
import { firebaseAdmin } from "firebaseAdmin"

export const config = {
  api: {
    externalResolver: true,
  },
}

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  // const { userToken, eventData } : {userToken: any, eventData: any} = req.body;
  // const locations = ["Alaska", "Montana", "Seattle", "Spokane", "Wyoming"];
  // locations.forEach(async (location) => {
  //   const response = await firebaseAdmin.database().ref("/Locations/" + location).once("value");
  //   const locationData = response.val();
  //   const locationObj : any = {};
  //   Object.keys(locationData).forEach(organization => {
  //     locationData[organization].forEach((event : any) => {
  //       const eventObj : any = {};
  //       Object.keys(event).forEach((field : string) => {
  //         const data : string | string[] = event[field];
  //         // console.log(field);
  //         // console.log(data);
  //         eventObj[field] = data;
  //       });
  //       eventObj["timestamp"] = new Date();
  //       eventObj["organization"] = organization;
  //       // Upload to firestore
  //       let setDoc = firebaseAdmin.firestore().collection(location).doc().set(eventObj);
  //     });
  //     locationObj[organization] = true;
  //   });
  //   let setDoc = firebaseAdmin.firestore().collection("cache").doc(location).set(locationObj);
  // });
}
