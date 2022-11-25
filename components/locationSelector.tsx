import React from "react";
import { MenuItem, Select, Typography } from "@material-ui/core";
import BootstrapInput from "./bootstrapInput";
import { useRouter } from "next/router";
import { Location, setLocation } from "../helpers/locations";

type LocationSelectorProps = {
  defaultLocation: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  defaultLocation
}) => {
  const router = useRouter();

  const location = (router.query.location && !Array.isArray(router.query.location)) ? router.query.location : defaultLocation;

  return (
    <div style={{ display: "flex" }}>
      <Typography
        id="select-location-filter"
        gutterBottom
        display="inline"
        style={{ marginRight: "1em", fontFamily: "Uni Sans Book", fontSize: "1rem", textAlign: "center", paddingTop: "7px"}}
      >
        <b>Select a Location</b>{" "}
      </Typography>
      <Select
        aria-labelledby="select-location-filter"
        value={location}
        onChange={(e) => {
          const location = e.target.value as string;
          if (location === defaultLocation) {
            setLocation(router);
          } else {
            setLocation(router, location as Location);
          }
        }}
        style={{ width: 104 }}
        input={<BootstrapInput />}
      >
        <MenuItem value={defaultLocation} style={{ fontFamily: "Open Sans" }}>Location</MenuItem>
        {Object.values(Location).map((location) => (
          <MenuItem style={{ fontFamily: "Open Sans" }} value={location}>{location}</MenuItem>
        ))}
      </Select>
    </div>
  )
}


export default LocationSelector;