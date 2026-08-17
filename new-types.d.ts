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
  name: string;
  calendar: string[];
  date: Timestamp;
  dates: Timestamp[];
  eventInformation: string;
  requiredTraining: string;
  leadEmail: string;
  location: string; // Used for calendar, address is for directions.
  address: string;
  volunteerTypes?: string[]; // list of all roles
  projectId: string;
  projectName: string;
  startTime: string;
  endTime: string;
};

// One signup counter, stored at events/{eventId}/slots/{date}__{role}.
// capacity is admin-set; remaining is moved only by signup and withdrawal.
type SlotData = {
  date: string; // "YYYY-MM-DD"
  role: string;
  capacity: number;
  remaining: number;
};

type VolunteerData = {
  uid: string;
  date?: string;
  email: string;
  name: string;
  phoneNumber: number;
  role: string;
  studentDiscipline: string;
  comments?: string;
};
