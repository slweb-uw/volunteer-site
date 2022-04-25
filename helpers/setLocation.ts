import {NextRouter} from "next/router";

const BASE_URL = "/opportunities";

const setLocation = (router: NextRouter, newLocation?: string) => {
  if (!newLocation) {
    router.push(BASE_URL, undefined, { scroll: false });
  } else {
    router.push(`${BASE_URL}/${newLocation}`, undefined, { scroll: false });
  }
}

export default setLocation;