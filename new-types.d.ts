import { Timestamp } from "firebase/firestore";

type ProjectData = {
  id: string;
  Title: string;
  Organization: string;
  cardImageURL?: string;
  imageURL?: string;
  SignupActive: boolean;
  timestamp: string;
  StartDate?: string;
  EndDate?: string;
  Location: string 
  Order?: string[];
  "Types of Volunteers Needed": string[];
  "Website Link"?: string;
  "Contact Information"?: string;
  "HS Grad Student Information": string;
  "Project Description": string;
  "Sign-up Link"?: string;
  "Project Specific Training"?: string;
  "Provider Information"?: string;
  "Services Provided"?: string;
  "Tips and Reminders"?: string;
  "Clinic Schedule": string;
  "Clinic Flow": string;
  "Address/Parking/Directions": string
  "Protocols": string
};

//Specific to events per project
type EventData = {
    calendar: string;
    date: Timestamp;
    endTime: string;
    eventInformation: string;
    leadEmail: string;
    location: string;
    openings: { [key: string]: number | string }[]; //TODO: Define openings as a map of strings to either numbers or strings.
    projectId: string;
    projectName: string;
    startTime: string;
    volunteerQty: [string]
    volunteerTypes: [string]
};

type VolunteerData = {
    id: string;
    type: string;
    name: string;
};