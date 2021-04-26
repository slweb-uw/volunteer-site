/// <reference types="next" />
/// <reference types="next/types/global" />

interface EventData {
  Title: string;
  ["Project Description"]: string;
  organization: string;
  Order?: string[];
  Timestamp: Date;
  [Field: string]: string;
  id: string;
}

// The data of the event which needs to be passed in during the api call.
interface CalendarEventData {
  //calendar fields
  Name: string;
  Description: string;
  Organization: string;
  Location: string;
  StartDate: string;    // format according to RFC5545, use toISOString() before send the api request
  EndDate: string;      // format according to RFC5545, use toISOString() before send the api request
  Timezone: string;     // Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich"
  // format according to 
  // RFC5545(https://tools.ietf.org/html/rfc5545#page-37,
  // https://tools.ietf.org/html/rfc5545#section-3.8.5)
  // Date example(UTC): 20110617T065959Z
  // The above indicates: Year:2011, Month: 06, Day: 17, Hour: 06(range: 00-23), Minite: 59, Second: 59
  // recurrence example: ["RRULE:FREQ=WEEKLY;BYDAY:TU,SU;UNTIL=20110617T065959Z"], This means repeat weekly(Tuesday and Sunday) until the above time.
  // Note that DTSTART and DTEND lines are not allowed in this field.
  Recurrence?: string[]; 

  //Event Fields:
  //Name: string;  --> Title
  //Description: string; --> Project Description
  //Organization: string;
  //Location: string;
  id?: string; // document's id
  VolunteerType?: string;
  TimeStamp?: Date;
  //[Field?: string]: string;
  Order?: string[];
}