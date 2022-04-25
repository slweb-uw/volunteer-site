import React from "react";
import {MenuItem, Select, Typography} from "@material-ui/core";
import BootstrapInput from "./bootstrapInput";
import {useRouter} from "next/router";
import setLocation from "../helpers/setLocation";

const locations = [
  "Alaska",
  "Idaho",
  "Montana",
  "Seattle",
  "Spokane",
  "Wyoming",
];

type LocationSelectorProps = {
  defaultLocation: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  defaultLocation
}) => {
  const router = useRouter();

  const location = (router.query.location && !Array.isArray(router.query.location)) ? router.query.location : defaultLocation;

  return (
    <div>
      <Typography
        gutterBottom
        display="inline"
        style={{ marginRight: "1em", verticalAlign: "50%" }}
      >
        <b>Select a Location</b>{" "}
      </Typography>
      <Select
        value={location}
        onChange={(e) => {
          const location = e.target.value as string;
          if (location === defaultLocation) {
            setLocation(router);
          } else {
            setLocation(router, location);
          }
        }}
        style={{ width: 104 }}
        input={<BootstrapInput />}
      >
        <MenuItem value={defaultLocation}>Location</MenuItem>
        {locations.map((location) => (
          <MenuItem value={location}>{location}</MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default LocationSelector;