import { NextRouter } from "next/router";

const BASE_URL = "/opportunities";

export enum Location {
  ALASKA = "Alaska",
  IDAHO = "Idaho",
  MONTANA = "Montana",
  SEATTLE = "Seattle",
  SPOKANE = "Spokane",
  WYOMING = "Wyoming",
}

// The default location, representing no location
export const DEFAULT_LOCATION = "default";
// The local storage key to store the last location in
export const LAST_LOCATION_KEY = "last_location";

export const setLocation = (router: NextRouter, newLocation?: Location) => {
  window.localStorage.setItem(
    LAST_LOCATION_KEY,
    newLocation ?? DEFAULT_LOCATION,
  );
  if (!newLocation) {
    router.push(`${BASE_URL}/${DEFAULT_LOCATION}`, BASE_URL, { scroll: false });
  } else {
    router.push(`${BASE_URL}/${newLocation}`, undefined, { scroll: false });
  }
};
