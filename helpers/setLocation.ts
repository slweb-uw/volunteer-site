import {NextRouter} from "next/router";

const BASE_URL = "/opportunities";

enum Location {
  Alaska = "Alaska",
  Idaho = "Idaho",
  Montana = "Montana",
  Seattle = "Seattle",
  Spokane = "Spokane",
  Wyoming = "Wyoming"
}

const setLocation = (router: NextRouter, newLocation?: Location) => {
  if (!newLocation) {
    router.push(BASE_URL, undefined, { scroll: false });
  } else {
    router.push(`${BASE_URL}/${newLocation}`, undefined, { scroll: false });
  }
}

export { Location, setLocation };