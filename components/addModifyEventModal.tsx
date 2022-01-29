import React, { useEffect, useState } from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Input,
  Tab,
  Tabs,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormLabel,
  Button,
} from "@material-ui/core";
import { firebaseClient } from "firebaseClient";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import { DialogActions } from "@mui/material";
import RRule, { rrulestr } from "rrule";
import { Guid } from "guid-typescript";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const ModalDialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const ModalDialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(DialogContent);

const generateLabelValuePairs = (
  upper: number
): { label: string; value: string }[] => {
  const ret: { label: string; value: string }[] = [];
  for (let i = 1; i <= upper; i++) {
    const str = i + "";
    ret.push({ label: str, value: str });
  }
  return ret;
};

const volunteerTypes = [
  "School of Medicine",
  "School of Dentistry",
  "School of Nursing",
  "School of Pharmacy",
  "School of Public Health",
  "School of Social Work",
  "MEDEX",
  "PT/OT/P&O",
  "Providers",
  "Undergraduates",
  "Other",
];

const locations = [
  "Seattle",
  "Spokane",
  "Montana",
  "Alaska",
  "Wyoming",
  "Idaho",
];

const initialFields = [
  "Contact Information and Cancellation Policy",
  "Website Link",
  "Sign-up Link",
  "Parking and Directions",
  "Clinic Flow",
  "Clinic Schedule",
  "Project Specific Training",
  "Services Provided",
  "Tips and Reminders",
  "Provider Information",
  "HS Grad Student Information",
  "Undergraduate Information",
];

const reservedFields = new Set([
  "Title",
  "Project Description",
  "Types of Volunteers Needed",
  "Organization",
  "Order",
  "id",
  "imageURL",
  "timestamp",
  "recurrences",
  "recurrences original",
  "Recurrence",
  "StartDate",
  "EndDate",
  "Location",
]);

const weekdayOptions = [
  { label: "Monday", value: "MO" },
  { label: "Tuesday", value: "TU" },
  { label: "Wednesday", value: "WE" },
  { label: "Thursday", value: "TH" },
  { label: "Friday", value: "FR" },
  { label: "Saturday", value: "SA" },
  { label: "Sunday", value: "SU" },
];
const monthOptions = generateLabelValuePairs(12);
const monthDayOptions = generateLabelValuePairs(31);

export default function AddModifyEventModal(props: {
  open: boolean;
  event?: EventData;
  location: string | string[] | undefined;
  handleClose: any;
}) {
  const { open, event, handleClose } = props;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Event fields
  const [recurrenceFromProps, setRecurrenceFromProps] = useState<
    string[] | undefined
  >();
  const [organizationList, setOrganizationList] = useState<string[]>([]);
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [organization, setOrganization] = useState<string | undefined>();
  const [location, setLocation] = useState<string | undefined>();
  const [volunteersNeeded, setVolunteersNeeded] = useState<string[]>([]);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>();
  const [otherFields, setOtherFields] = useState<
    Record<string, string | string[] | undefined>
  >({});

  // Recurrence fields
  const [recurrenceType, setRecurrencyType] = useState<string>("Daily");
  const [recEndDate, setRecEndDate] = useState<Date | null>(null);
  const [interval, setInterval] = useState<number | null>(null);
  const [weekdays, setWeekdays] = useState<Record<string, boolean>>({
    SU: false,
    MO: false,
    TU: false,
    WE: false,
    TH: false,
    FR: false,
    SA: false,
  });
  const initialMonths: Record<string, boolean> = {};
  for (let i = 1; i <= 12; i++) {
    initialMonths[i] = false;
  }
  const [months, setMonths] = useState<Record<string, boolean>>(initialMonths);
  const initialMonthDays: Record<string, boolean> = {};
  for (let i = 1; i <= 31; i++) {
    initialMonths[i] = false;
  }
  const [monthDays, setMonthDays] = useState<Record<string, boolean>>(
    initialMonthDays
  );

  const deleteImage = async () => {
    if (imageURL) {
      const imageRef = firebaseClient.storage().refFromURL(imageURL);
      await imageRef.delete();
      setImageURL(undefined);
      alert(
        "Image deleted. Please save the event, or set the image and save the event."
      );
    }
  };

  // Selects and uploads image to Firebase Storage and sets imageURL of event
  const setImage = (evt: React.FormEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement;
    const imageFile: File = (target.files as FileList)[0];
    const photoId = Guid.create().toString();
    const storageRef = firebaseClient.storage().ref(photoId);
    // Upload image to firebase storage then get its URL
    storageRef.put(imageFile).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        setImageURL(downloadURL as string);
      });
    });
  };

  // Puts event to Firestore and Google Calendar
  const putEvent = () => {
    if (!title || !description || !description || !location || !organization) {
      alert("Error: missing required field.");
      return;
    }

    // CalendarEventData is superset of EventData used in the APIs
    const uploadEvent: CalendarEventData = {
      Title: title,
      "Project Description": description,
      Organization: organization,
      Location: location,
      timestamp: new Date(),
    };

    if (startDateTime && endDateTime) {
      uploadEvent.StartDate = startDateTime.toISOString();
      uploadEvent.EndDate = endDateTime.toISOString();
    }

    if (event && event.id) {
      // If there is an id, the API knows to update the event
      uploadEvent.id = event.id;
    }

    // Generate recurrence if no event or event doesn't have a Recurrence
    if (recEndDate && (!props.event || !props.event["Recurrence"])) {
      if (recurrenceType === "Daily" && interval) {
        const rule = new RRule({
          freq: RRule.DAILY,
          interval,
          dtstart: startDateTime,
          until: recEndDate,
        });
        uploadEvent.Recurrence = [rule.toString()];
      } else if (recurrenceType === "WEEKLY") {
        const ruleDays = [];
        if (weekdays["MO"]) {
          ruleDays.push(RRule.MO);
        }
        if (weekdays["TU"]) {
          ruleDays.push(RRule.TU);
        }
        if (weekdays["WE"]) {
          ruleDays.push(RRule.WE);
        }
        if (weekdays["TH"]) {
          ruleDays.push(RRule.TH);
        }
        if (weekdays["FR"]) {
          ruleDays.push(RRule.FR);
        }
        if (weekdays["SA"]) {
          ruleDays.push(RRule.SA);
        }
        if (weekdays["SU"]) {
          ruleDays.push(RRule.SU);
        }
        const rule = new RRule({
          freq: RRule.WEEKLY,
          interval: interval ?? 1,
          byweekday: ruleDays,
          dtstart: startDateTime,
          until: recEndDate,
        });
        uploadEvent.Recurrence = [rule.toString()];
      } else if (recurrenceType === "MONTHLY") {
        const bymonthday: number[] = [];
        Object.keys(monthDays).forEach((day) => {
          if (monthDays[day]) {
            bymonthday.push(parseInt(day));
          }
        });
        const rule = new RRule({
          freq: RRule.MONTHLY,
          bymonthday,
          dtstart: startDateTime,
          until: recEndDate,
        });
        uploadEvent.Recurrence = [rule.toString()];
      } else {
        // Yearly recurrence
        const bymonthday: number[] = [];
        Object.keys(monthDays).forEach((day) => {
          if (monthDays[day]) {
            bymonthday.push(parseInt(day));
          }
        });
        const bymonth: number[] = [];
        Object.keys(months).forEach((month) => {
          if (months[month]) {
            bymonthday.push(parseInt(month));
          }
        });
        const rule = new RRule({
          freq: RRule.YEARLY,
          bymonth,
          bymonthday,
          dtstart: startDateTime,
          until: recEndDate,
        });
        uploadEvent.Recurrence = [rule.toString()];
      }
    }

    // Set other fields
    Object.keys(otherFields).forEach((fieldName) => {
      const cur = otherFields[fieldName];
      if (typeof cur !== "undefined") {
        uploadEvent[fieldName] = cur;
      }
    });
    if (imageURL) {
      uploadEvent[imageURL] = imageURL;
    }
    if (volunteersNeeded) {
      uploadEvent["Types of Volunteers Needed"] = volunteersNeeded;
    }

    const calendarPromise = async (calEvent: any, userToken: any) => {
      if (calEvent.StartDate) {
        fetch("/api/put-calendar-event", {
          method: "POST",
          body: JSON.stringify({ eventData: calEvent, userToken }),
        });
      }
    };
    firebaseClient
      .auth()
      .currentUser?.getIdToken()
      .then(async (userToken) => {
        try {
          const res = await fetch("/api/put-event-data", {
            method: "POST",
            body: JSON.stringify({ eventData: uploadEvent, userToken }),
          });
          const addedEvent = (await res.json()) as CalendarEventData;
          if (addedEvent) {
            await calendarPromise(addedEvent, userToken);
            handleClose();
            // We refresh to update the page. TODO: add/update event to page via callback
            window.location.reload();
          }
        } catch (e) {
          alert(e);
        }
      });
  };

  useEffect(() => {
    // Reset fields when event prop is updated
    const newFields: Record<string, string | string[] | undefined> = {};
    initialFields.forEach((f) => {
      newFields[f] = undefined;
    });
    if (props.event) {
      if (
        props.event.Recurrence &&
        typeof props.event.Recurrence === "object"
      ) {
        setRecurrenceFromProps(props.event.Recurrence);
      }
      if (
        props.event["StartDate"] &&
        typeof props.event["StartDate"] === "string"
      ) {
        setStartDateTime(new Date(props.event["StartDate"]));
      }
      if (
        props.event["EndDate"] &&
        typeof props.event["EndDate"] === "string"
      ) {
        setEndDateTime(new Date(props.event["EndDate"]));
      }
      setTitle(props.event.Title);
      setDescription(props.event["Project Description"]);
      setOrganization(props.event.Organization);
      setVolunteersNeeded(props.event["Types of Volunteers Needed"] ?? []);
      Object.keys(props.event).forEach((key) => {
        if (props.event && !reservedFields.has(key)) {
          newFields[key] = props.event[key];
        }
      });
    }
    setOtherFields(newFields);
  }, [props.event]);

  useEffect(() => {
    // Reset location when location prop is updated
    if (props.location && typeof props.location === "string") {
      setLocation(props.location);
    }
  }, [props.location]);

  useEffect(() => {
    // Update organization list when the location changes
    if (location && typeof location === "string") {
      firebaseClient
        .firestore()
        .collection("cache")
        .doc(location)
        .get()
        .then((doc) => {
          const cachedOrganizations = doc.data();
          setOrganizationList(
            cachedOrganizations ? Object.keys(cachedOrganizations) : []
          ); // Doc has fields which are the organizations
        })
        .catch((_) => {
          alert(
            "Error fetching organizations for location. Please refresh the page."
          );
        });
    }
  }, [location]);

  const handleWeekdaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeekdays({
      ...weekdays,
      [event.target.name]: event.target.checked,
    });
  };

  const handleMonthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonths({
      ...months,
      [event.target.name]: event.target.checked,
    });
  };

  const handleMonthDaysChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMonthDays({
      ...monthDays,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="event-dialog"
      open={open}
      fullWidth={true}
      maxWidth={"lg"}
      disableEnforceFocus={true}
    >
      <ModalDialogTitle id="event-dialog" onClose={handleClose}>
        <b>{event ? "Modify Event" : "Add Event"}</b>
      </ModalDialogTitle>
      <ModalDialogContent>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Project Name"
              value={title}
              onChange={(e) => setTitle(e.target.value as string)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              multiline
              fullWidth
              label="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value as string)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl required fullWidth>
              <InputLabel>Organization</InputLabel>
              <Select
                fullWidth
                value={organization}
                label="Organization *"
                onChange={(e) => {
                  setOrganization(e.target.value as string);
                }}
              >
                {organizationList.map((organization) => (
                  <MenuItem value={organization}>{organization}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl required fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                fullWidth
                value={location}
                label="Location *"
                onChange={(e) => {
                  setLocation(e.target.value as string);
                }}
              >
                {locations.map((loc) => (
                  <MenuItem value={loc}>{loc}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Types of Volunteers Needed</InputLabel>
              <Select
                fullWidth
                multiple
                value={volunteersNeeded}
                onChange={(e) => {
                  const value = e.target.value;
                  setVolunteersNeeded(
                    typeof value === "string"
                      ? value.split(",")
                      : (value as string[])
                  );
                }}
                input={<Input />}
                renderValue={(selected: any) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {typeof selected === "object"
                      ? selected.map((value: string) => (
                          <Chip key={value} label={value} />
                        ))
                      : []}
                  </Box>
                )}
              >
                {volunteerTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {Object.keys(otherFields).map((fieldName) => (
            <Grid item xs={12} sm={6}>
              <TextField
                helperText={
                  fieldName === "Clinic Schedule"
                    ? "i.e. every other Saturday at 2:00-4:00pm"
                    : ""
                }
                multiline
                fullWidth
                label={fieldName}
                value={otherFields[fieldName]}
                onChange={(e) =>
                  setOtherFields({
                    ...otherFields,
                    [fieldName]: e.target.value as string,
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              style={{ paddingTop: "2em", paddingBottom: "1em" }}
            >
              Outreach Event Date/Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => {
                  //@ts-ignore
                  return <TextField {...props} />;
                }}
                label="Start Date/Time*"
                value={startDateTime}
                onChange={(newValue) => {
                  setStartDateTime(newValue);
                }}
              />
              <span style={{ marginLeft: "1em" }}>
                <DateTimePicker
                  renderInput={(props) => {
                    //@ts-ignore
                    return <TextField {...props} />;
                  }}
                  label="End Date/Time*"
                  value={endDateTime}
                  onChange={(newValue) => {
                    setEndDateTime(newValue);
                  }}
                />
              </span>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              style={{ paddingTop: "2em", paddingBottom: "1em" }}
            >
              Recurrences (Optional)
            </Typography>

            {recurrenceFromProps ? (
              <div>
                <Typography>
                  Current Recurrence:{" "}
                  {rrulestr(recurrenceFromProps[0]).toText()}
                </Typography>
                <Button
                  onClick={() => {
                    setRecurrenceFromProps(undefined);
                  }}
                >
                  Set New Recurrence
                </Button>
              </div>
            ) : (
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    marginBottom: "1em",
                  }}
                >
                  <Tabs
                    variant="scrollable"
                    value={recurrenceType}
                    onChange={(_, i) => {
                      setRecurrencyType(i);
                    }}
                    aria-label="recurrence tabs"
                  >
                    <Tab label="Daily" value="Daily" />
                    <Tab label="Weekly" value="Weekly" />
                    <Tab label="Monthly" value="Monthly" />
                    <Tab label="Yearly" value="Yearly" />
                  </Tabs>
                </Box>
                {recurrenceType === "Daily" && (
                  <div>
                    Repeat Every{" "}
                    <Select
                      value={interval}
                      label="Interval *"
                      onChange={(e) => {
                        setInterval(e.target.value as number);
                      }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                    </Select>{" "}
                    Day(s)
                  </div>
                )}
                {recurrenceType === "Weekly" && (
                  <div>
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      fullWidth
                    >
                      <FormLabel component="legend">
                        Select Weekdays To Repeat On
                      </FormLabel>
                      <FormGroup style={{ display: "inline-block" }}>
                        {weekdayOptions.map((option) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={weekdays[option.value]}
                                onChange={handleWeekdaysChange}
                                name={option.label}
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                    Repeat Every{" "}
                    <Select
                      value={interval}
                      label="Interval *"
                      onChange={(e) => {
                        setInterval(e.target.value as number);
                      }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                    </Select>{" "}
                    Week(s)
                  </div>
                )}
                {recurrenceType === "Monthly" && (
                  <div>
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      fullWidth
                    >
                      <FormLabel component="legend">
                        Select Days of the Month To Repeat On
                      </FormLabel>
                      <FormGroup style={{ display: "inline-block" }}>
                        {monthDayOptions.map((option) => (
                          <span style={{ display: "inline-block" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={monthDays[option.label]}
                                  onChange={handleMonthDaysChange}
                                  name={option.label}
                                />
                              }
                              label={option.label}
                            />
                          </span>
                        ))}
                      </FormGroup>
                    </FormControl>
                  </div>
                )}
                {recurrenceType === "Yearly" && (
                  <div>
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      fullWidth
                    >
                      <FormLabel component="legend">
                        Select Months To Repeat On
                      </FormLabel>
                      <FormGroup style={{ display: "inline-block" }}>
                        {monthOptions.map((option) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={months[option.label]}
                                onChange={handleMonthsChange}
                                name={option.label}
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      variant="standard"
                      fullWidth
                    >
                      <FormLabel component="legend">
                        Select Days of the Month To Repeat On
                      </FormLabel>
                      <FormGroup style={{ display: "inline-block" }}>
                        {monthDayOptions.map((option) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={monthDays[option.label]}
                                onChange={handleMonthDaysChange}
                                name={option.label}
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </div>
                )}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => {
                      //@ts-ignore
                      return <TextField {...props} />;
                    }}
                    label="Recurrence End Date"
                    value={recEndDate}
                    onChange={(newValue) => {
                      setRecEndDate(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Grid>
        </Grid>
      </ModalDialogContent>
      <DialogActions>
        {imageURL && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              deleteImage();
            }}
          >
            Delete Image
          </Button>
        )}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Upload Image
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              setImage(e);
            }}
            hidden
          />
        </Button>
        <Button variant="contained" color="secondary" onClick={putEvent}>
          Save Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
