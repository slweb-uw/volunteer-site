import { firebaseAdmin } from "firebaseAdmin";
import { useAuth } from "auth";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import {VolunteerData} from "new-types"

type Attendee = VolunteerData & {
    docId: string;
};

type ViewingAttendeesPageProps = {
    attendees: Attendee[];
    eventName: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { event } = ctx.params ?? {};
  
    if (!event || typeof event !== "string") {
      return {
        notFound: true,
      };
    }
  
    const eventRef = firebaseAdmin.firestore().collection("events").doc(event);
    const eventDoc = await eventRef.get();
  
    if (!eventDoc.exists) {
      return { notFound: true };
    }
  
    const volunteers = await eventRef.collection("volunteers").get();
    const attendees = volunteers.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
    }));

    return { 
        props: { eventName: eventDoc.data()?.name ?? "Event", 
        attendees: attendees,
        } 
    };
};
const ViewingAttendeesPage = ({ eventName, attendees }: ViewingAttendeesPageProps) => {
    return (
        <main>
            <h1>{eventName} Attendees</h1>
            <pre> {JSON.stringify(attendees, null, 2)}</pre>
        </main>
    );
};
export default ViewingAttendeesPage;

