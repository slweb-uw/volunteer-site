import { Timestamp } from "firebase/firestore"

type EventData = {
  "Clinic Schedule": string,
  "Clinic Flow": string,
  Details: string,
  Organization: string,
  "Project Description": string,
  "Sign-up Link"?: string,
  SignupActive: boolean,
  Title: string,
  "Types of Volunteers Needed": string[],
  "Website Link"?: string,
  id: string,
  timestamp: string,
  StartDate?: string,
  EndDate?: string,
  "HS Grad Student Information": string,
  Location: "Seattle",
  Order?: string[],
  "Project Specific Training"?: string,
  "Provider Information"?: string,
  "Services Provided"?: string,
  "Tips and Reminders"?: string,
  cardImageURL?: string,
  imageURL?: string,
}

type EventRecurrance = {
  id: string
  date: Timestamp
  eventInformation: string,
  leadEmail: string,
  volunteerQty: string[]
  volunteerTypes: string[]
  projectName: string,
  projectId: string
  startTime: string
  endTime: string
}
