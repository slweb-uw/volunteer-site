import { Timestamp } from "firebase/firestore";
import { volunteerTypes } from "components/AddModifyEventModal";

type ProjectData = {
  id: string;
  Title: string;
  Organization: string;
  cardImageURL?: string;
  imageURL?: string;
  SignupActive: boolean;
  timestamp: string;
  Location: string;
  "Types of Volunteers Needed": string[];
  "Website Link"?: string;
  "Contact Information"?: string;
  "HS Grad Student Information": string;
  "Project Description": string;
  "Clinic Schedule": string;
};

//Specific to events per project
type EventData = {
  id: string;
  calendar: string;
  date: Timestamp;
  endTime: string;
  eventInformation: string;
  leadEmail: string;
  location: string;
  openings: { [key: string]: number }; //Map of volunteer types to number of openings
  projectId: string;
  projectName: string;
  startTime: string;
  volunteerQty: [string];
  volunteerTypes: [string];
  // "Project Specific Training"?: string;
  // "Services Provided"?: string;
  // "Tips and Reminders"?: string;
  // "Address/Parking/Directions": string;
  //  Protocols: string;
  // "Clinic Flow": string;
};

type VolunteerData = {
  uid: string;
  email: string;
  name: string;
  phoneNumber: number;
  role: string;
  studentDiscipline: string;
  comments?: string;
};
