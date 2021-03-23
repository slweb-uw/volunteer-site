import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebaseAdmin";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async (req: NextApiRequest, resolve: NextApiResponse) => {
  const { userToken, eventData } : {userToken: any, eventData: any} = req.body;

  const locations = ["Alaska", "Montana", "Seattle", "Spokane", "Wyoming"];

  locations.forEach(async (location) => {
    const response = await firebaseAdmin.database().ref("/Locations/" + location).once("value");
    const locationData = response.val();

    Object.keys(locationData).forEach(organization => {
      locationData[organization].forEach((event : any) => {
        Object.keys(event).forEach((field : string) => {
          const data : string | string[] = event[field];
          console.log(field);
          console.log(data);

          // Upload to firestore
          
          /*
            Ex: 
            Seattle - collection (each location is a separate collection)
              Covid Vaccine Site - document
                - name: string
                - organization: string
                - description: string
                - order: string[]
                - timestamp: Date
                - [field: string]: string (These are all the other fields)
          */

          // const eventObj = {
          //   name:


          // }
          // firestore().collection(location).add(eventObj)


        })
      })
    })
  })
};
