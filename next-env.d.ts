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
  Name: string;
  Description: string;
  Organization: string;
  Location: string;
  StartDate: string;    // format according to RFC5545, use toISOString() before send the api request
  EndDate: string;      // format according to RFC5545, use toISOString() before send the api request
  Timezone: string;     // Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich"
  Recurrence?: string[]; // format according to RFC5545
}