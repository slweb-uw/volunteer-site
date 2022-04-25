/// <reference types="next" />
/// <reference types="next/types/global" />

type Location =
  | "Alaska"
  | "Idaho"
  | "Montana"
  | "Seattle"
  | "Spokane"
  | "Wyoming"

interface EventData {
  Title: string;
  ["Project Description"]: string;
  Details?: string;
  Organization: string;
  timestamp: Date;
  [Field: string]: string | string[];
  id: string;
  imageURL?: string;
  cardImageURL?: string;
  Order?: string[];
  ["Types of Volunteers Needed"]?: string[];
  ["Contact Information and Cancellation Policy"]?: string;
  ["Website Link"]?: string;
  ["Sign-up Link"]?: string;
  ["Parking and Directions"]?: string;
  ["Clinic Flow"]?: string;
  ["Clinic Schedule"]?: string;
  ["Project Specific Training"]?: string;
  ["Services Provided"]?: string;
  ["Tips and Reminders"]?: string;
  ["Provider Information"]?: string;
  ["HS Grad Student Information"]?: string;
  ["Undergraduate Information"]?: string;
}

// The data of the event which needs to be passed in during the api call.
interface CalendarEventData {
  //calendar fields
  StartDate?: string; // format according to RFC5545, use toISOString() before send the api request
  EndDate?: string; // format according to RFC5545, use toISOString() before send the api request
  Timezone?: string; // Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich"
  // format according to
  // RFC5545(https://tools.ietf.org/html/rfc5545#page-37,
  // https://tools.ietf.org/html/rfc5545#section-3.8.5)
  // Date example(UTC): 20110617T065959Z
  // The above indicates: Year:2011, Month: 06, Day: 17, Hour: 06(range: 00-23), Minite: 59, Second: 59
  // recurrence example: ["RRULE:FREQ=WEEKLY;BYDAY=TU,SU;UNTIL=20110618T065959Z"], This means repeat weekly(Tuesday and Sunday) until the above time.
  // Note that DTSTART and DTEND lines are not allowed in this field.
  Recurrence?: string[];

  //Event Fields:
  Title: string;
  Location: string;
  Organization: string;
  ["Project Description"]: string;
  Details?: string;
  id?: string; // document's id
  ["Types of Volunteers Needed"]?: string[];
  timestamp: Date;
  [Field: string]: string | string[] | Date;
  Order?: string[];
  imageURL?: string;
  cardImageURL?: string;
}
