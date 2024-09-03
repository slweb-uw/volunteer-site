type ProjectData = {
  id: string;
  Title: string;
  Details: string;
  Organization: string;
  cardImageURL?: string;
  imageURL?: string;
  SignupActive: boolean;
  timestamp: string;
  StartDate?: string;
  EndDate?: string;
  Location: "Seattle" | "Alaska" | "Idaho" | "Montana" | "Spokane" | "Wyoming";
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
};

//Create event data type for events