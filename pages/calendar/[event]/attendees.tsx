import { firebaseAdmin } from "firebaseAdmin";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import {VolunteerData} from "new-types"
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { useAuth } from "auth";
import AuthorizationMessage from "pages/AuthorizationMessage";
import nookies from "nookies";
type Attendee = VolunteerData & {
    docId: string;
};

type ViewingAttendeesPageProps = {
    attendees: Attendee[];
    eventName: string;
    authenticatedUser: boolean;
}
const authorizedViewAttendees = async (email:string | null): Promise<boolean> => {
    const firestore = firebaseAdmin.firestore();
    const authAdmin = await firestore.collection("Admins").where("email", "==", email).get();
    const authLead = await firestore.collection("Leads").where("email", "==", email).get();
    return !authAdmin.empty || !authLead.empty;

};


const getCurrentUserEmail = async (
    ctx: Parameters<GetServerSideProps>[0],
  ): Promise<string | null> => {

    const cookies = nookies.get(ctx); 
    try{
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(cookies.token); 
        const email =  decodedToken.email; 
        console.log("email successfully verified");
        return email ?? null;
    } catch(error) {
        console.error("Could not authenticate current user");
        return null;
    }
}
export const getServerSideProps: GetServerSideProps<ViewingAttendeesPageProps> = async (ctx) => {
    const { event } = ctx.params ?? {};

    const email = await getCurrentUserEmail(ctx); 
    const authenticatedUser = await authorizedViewAttendees(email);
    if (!authenticatedUser) {
        return {
            props: {
                eventName: "", 
                attendees: [], 
                authenticatedUser: false
            }
        };
    }
    console.log("user authenticated");

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
    })) as Attendee[];

    return { 
        props: { eventName: eventDoc.data()?.name ?? "Event", 
        attendees: attendees, authenticatedUser: authenticatedUser
        } 
    };


};


const ViewingAttendeesPage = ({ eventName, attendees, authenticatedUser }: ViewingAttendeesPageProps) => {
    

    const { user, isAdmin, isLead } = useAuth();

    if (!isAdmin && !isLead) {
        return <AuthorizationMessage user={user} />;
    }
    if (!authenticatedUser) {
        return <AuthorizationMessage user={user} />;
    }

    return (
        <main>
            <h1>{eventName} Attendees</h1>
            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Student Discipline</TableCell>
            <TableCell align="right">Comments</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">Date</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.email}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.phoneNumber}</TableCell>
              <TableCell align="right">{row.studentDiscipline}</TableCell>
              <TableCell align="right">{row.comments}</TableCell>
              <TableCell align="right">{row.role}</TableCell>
              <TableCell align="right">{row.date}</TableCell>



            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>



            {/* <pre> {JSON.stringify(attendees, null, 2)}</pre> */}
        </main>
    );
};
export default ViewingAttendeesPage;

