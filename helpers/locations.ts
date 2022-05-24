import {NextRouter} from "next/router";

const BASE_URL = "/opportunities";

export enum Location {
  ALASKA = "Alaska",
  IDAHO = "Idaho",
  MONTANA = "Montana",
  SEATTLE = "Seattle",
  SPOKANE = "Spokane",
  WYOMING = "Wyoming"
}

export const setLocation = (router: NextRouter, newLocation?: Location) => {
  if (!newLocation) {
    router.push(BASE_URL, undefined, { scroll: false });
  } else {
    router.push(`${BASE_URL}/${newLocation}`, undefined, { scroll: false });
  }
}