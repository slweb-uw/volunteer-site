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
  // volunteerQty: [string]; - outdated
  // volunteerTypes: [string]; - outdated
  // "Project Specific Training"?: string; - tbd
  // "Services Provided"?: string; - tbd
  // "Tips and Reminders"?: string; - tbd
  // "Address/Parking/Directions": string; - tbd
  //  Protocols: string; - tbd
  // "Clinic Flow": string; - tbd
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
