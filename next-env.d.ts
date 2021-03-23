/// <reference types="next" />
/// <reference types="next/types/global" />

interface EventData {
  name: string;
  description: string;
  organization: string;
  order?: string[];
  timestamp: Date;
  [field: string]: string;
}