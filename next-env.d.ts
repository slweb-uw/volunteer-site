/// <reference types="next" />
/// <reference types="next/types/global" />

interface EventData {
  Name: string;
  Description: string;
  Organization: string;
  Order?: string[];
  Timestamp: Date;
  [Field: string]: string;
}
