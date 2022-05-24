import React, {ChangeEvent, useEffect, useState} from "react";
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
  Button
} from "@material-ui/core";
import { firebaseClient } from "firebaseClient";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateTimePicker, LocalizationProvider, LoadingButton } from "@mui/lab";
import { DialogActions } from "@mui/material";
import RRule, { rrulestr } from "rrule";
import { Guid } from "guid-typescript";
import EventImage from "./eventImage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import EventCard from "./eventCard";
import RichTextEditor from "./richTextEditor";
import { Location } from "../helpers/locations";
import CollapsibleRichTextEditor from "./collapsibleRichTextEditor";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    preview: {
      width: 300,
      height: 300,
      borderRadius: 10
    },
    cropHolder: {
      height: "calc(100% - 64px)"
    },
    mainImageSelector: {
      rowGap: 20
    },
    cardImageSelector: {
      columnGap: 30
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    modalContent: {
      overflowX: "hidden"
    }
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
  "Details",
  "Sign-up Link",
  "Types of Volunteers Needed",
  "Organization",
  "Order",
  "id",
  "imageURL",
  "cardImageURL",
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

interface AddModifyEventModalProps extends WithStyles<typeof styles> {
  open: boolean;
  event?: EventData;
  location: Location;
  handleClose: any;
}

interface ImageSelectorProps {
  setImage: (e: ChangeEvent<HTMLInputElement>) => any;
  deleteImage: () => any;
  hasImage: () => boolean;
  uploadText: string;
  deleteText: string;
}

interface CropModalProps extends WithStyles<typeof styles> {
  cropImage: string;
  open: boolean;
  saveImage: (blob: Blob) => Promise<void>;
  aspectRatio: number;
  handleClose: () => any;
}

enum ModalState {
  Main,
  CropSquare,
  CropCard
}

const RichFieldEditor = React.memo((props) => {
  return (<CollapsibleRichTextEditor
    innerProps={{
      initialContent: props.initialContent,
      output: (output) => {
        props.setField(props.fieldName, output ?? "")
      },
      placeholder: props.fieldName
    }}
  />)
})

const ImageSelector = (props: ImageSelectorProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return <React.Fragment>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => {
        fileInputRef.current?.click();
      }}
    >
      {props.uploadText}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(evt) => {
          props.setImage(evt);
          // Bit of a hack to prevent onChange not firing when re-inputting the same image
          // The issue is that file inputs are uncontrolled, so when the same image is input
          // as before there is no "change". We manually clear the input here since all we
          // need to do is process it, it doesn't need to stay here afterwards.
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        hidden
      />
    </Button>
    {props.hasImage() && (
      <Button
        variant="contained"
        color="secondary"
        onClick={props.deleteImage}
      >
        {props.deleteText}
      </Button>
    )}
  </React.Fragment>
}

const CropModal = withStyles(styles)((props: CropModalProps) => {
  const cropperRef = React.useRef<HTMLImageElement>(null);
  const {cropImage, open, aspectRatio, saveImage, handleClose, classes} = props;
  const [loading, setLoading] = useState(false);

  const onCrop = () => {
    // Note: react-cropper does not currently support proper typing
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setLoading(true);
    cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
        if (!blob) {
          console.error("blob failed")
          return;
        }
        saveImage(blob).then(() => {
          handleClose();
          setLoading(false);
        });
      }
    );
  }

  return <Dialog
    onClose={handleClose}
    aria-labelledby="crop-dialog"
    open={open}
    fullWidth={true}
    PaperProps={{
      classes: {
        root: classes.cropHolder
      }
    }}
    maxWidth={"lg"}
    disableEnforceFocus={true}
  >
    <ModalDialogTitle id="crop-dialog" onClose={handleClose}>
      <b>Crop Image</b>
    </ModalDialogTitle>
    <ModalDialogContent>
      <Cropper
        src={cropImage}
        style={{ height: "100%", width: "100%" }}
        ref={cropperRef}
        aspectRatio={aspectRatio}
        guides={false}
      />
    </ModalDialogContent>
    <DialogActions>
      <Typography style={{ marginRight: "auto" }}>
        Scroll to zoom in/out; drag inside the box to move it; drag on the corners of the box to resize it
      </Typography>
      <LoadingButton loading={loading} variant="contained" color="secondary" onClick={onCrop}>
        Crop
      </LoadingButton>
    </DialogActions>
  </Dialog>
});

const AddModifyEventModal = withStyles(styles)((props: AddModifyEventModalProps) => {
  const { open, event, handleClose, classes } = props;

  // Event fields
  const [recurrenceFromProps, setRecurrenceFromProps] = useState<
    string[] | undefined
  >();
  const [organizationList, setOrganizationList] = useState<string[]>([]);
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [signUpLink, setSignUpLink] = useState<string | undefined>();
  const [details, setDetails] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | undefined>();
  const [location, setLocation] = useState<string | undefined>();
  const [volunteersNeeded, setVolunteersNeeded] = useState<string[]>([]);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>();
  const [cardImageURL, setCardImageURL] = useState<string | undefined>();
  const [modalState, setModalState] = useState(ModalState.Main);
  const [cropImage, setCropImage] = useState<string | undefined>();
  const [otherFields, dispatchOtherFields] = React.useReducer((state, action) => {
    const { type, field, value } = action;
    if (type === "set_all") {
      return {...value};
    } else if (type === "set_field") {
      return {
        ...state,
        [field]: value
      };
    } else {
      throw new Error("Unknown action type " + type);
    }
  }, {});

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

  const deleteImage = async (url: string | undefined, setter: (v: string) => any) => {
    if (url) {
      const imageRef = firebaseClient.storage().refFromURL(url);
      await imageRef.delete();
      setter("");
      alert(
        "Image deleted. Please save the event, or set the image and save the event."
      );
    }
  };

  // Selects and uploads image to Firebase Storage and returns the image URL
  const saveImage = async (image: Blob): Promise<string> => {
    const photoId = Guid.create().toString();
    const storageRef = firebaseClient.storage().ref(photoId);
    // Upload image to firebase storage then get its URL
    const snapshot = await storageRef.put(image);
    return (await snapshot.ref.getDownloadURL()) as string;
  }

  const setImage = (evt: React.FormEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement;
    const imageFile: File = (target.files as FileList)[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      setCropImage(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error("Image reader error: ", error);
    };
  };

  const compileEvent = (): CalendarEventData | null => {
    if (!title || !description || !location || !organization) {
      return null;
    }

    // CalendarEventData is superset of EventData used in the APIs
    const uploadEvent: CalendarEventData = {
      Title: title,
      "Project Description": description,
      Organization: organization,
      Location: location,
      timestamp: new Date(),
    };

    uploadEvent.Details = details ? details : ""
    uploadEvent["Sign-up Link"] = signUpLink ? signUpLink : ""

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
    uploadEvent.imageURL = imageURL;
    uploadEvent.cardImageURL = cardImageURL;
    if (volunteersNeeded) {
      uploadEvent["Types of Volunteers Needed"] = volunteersNeeded;
    }

    return uploadEvent;
  }

  // Puts event to Firestore and Google Calendar
  const putEvent = () => {
    const uploadEvent = compileEvent();
    if (!uploadEvent) {
      alert("Error: missing required field.");
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
      if (props.event.Details) {
        setDetails(props.event.Details);
      }
      setImageURL(props.event.imageURL);
      setCardImageURL(props.event.cardImageURL);
      setTitle(props.event.Title);
      if (props.event["Sign-up Link"]) {
        setSignUpLink(props.event["Sign-up Link"])
      }
      setDescription(props.event["Project Description"]);
      setOrganization(props.event.Organization);
      setVolunteersNeeded(props.event["Types of Volunteers Needed"] ?? []);
      Object.keys(props.event).forEach((key) => {
        if (props.event && !reservedFields.has(key)) {
          newFields[key] = props.event[key];
        }
      });
    }
    dispatchOtherFields({ type: "set_all", value: newFields });
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

  const setField = React.useCallback((fieldName, value) => {
    dispatchOtherFields({
      type: "set_field",
      field: fieldName,
      value: value
    });
  }, [dispatchOtherFields]);

  const compiled = compileEvent();

  return (<React.Fragment>
    {(cropImage !== undefined &&
      <CropModal
        cropImage={cropImage}
        open={open && modalState != ModalState.Main}
        saveImage={(blob) => {
          return saveImage(blob)
            .then((url) => {
              if (modalState == ModalState.CropSquare) {
                setImageURL(url);
              } else {
                setCardImageURL(url);
              }
            });
        }}
        aspectRatio={modalState == ModalState.CropSquare ? 1 : (23 / 30)}
        handleClose={() => {
          setModalState(ModalState.Main)
        }}
      />
    )}
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
      <ModalDialogContent classes={{root: classes.modalContent}}>
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
              label="Project Summary"
              value={description}
              onChange={(e) => setDescription(e.target.value as string)}
            />
          </Grid>

          <Grid style={{ maxWidth: "100%" }} item sm={12}>
            <Typography
              variant="h6"
              style={{ textAlign: "center" }}
            >
              Detailed Project Description
            </Typography>
            <RichTextEditor
              initialContent={event?.Details ?? ""}
              output={setDetails}
              editorOptions={{
                attributes: {
                  style: "min-height: 250px"
                }
              }}
              placeholder="Add a detailed project description here. If left empty, the project summary will be used."
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

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sign-up Link"
              value={signUpLink}
              placeholder="Enter a link starting with http:// or https://"
              onChange={(e) => setSignUpLink(e.target.value as string)}
            />
          </Grid>

          {Object.keys(otherFields).map((fieldName) => {
            const val = otherFields[fieldName];
            return <Grid key={fieldName} item xs={12} sm={6}>
              <Typography style={{ paddingLeft: "10px" }}>
                {fieldName}
              </Typography>
              <RichFieldEditor
                fieldName={fieldName}
                setField={setField}
                initialContent={!Array.isArray(val) ? (val ?? "") : ""}
              />
            </Grid>;
          })}

          <Grid item sm={12}>{/* spacer so that the below components are always aligned */}</Grid>

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

          <Grid item sm={12}>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={4}
            >
              <Grid item xs={12}>
                <Typography
                    variant="h6"
                    style={{ textAlign: "center" }}
                >
                  Main Image Preview
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Grid
                  container
                  direction="column"
                  className={classes.mainImageSelector}
                >
                  <ImageSelector
                      setImage={(e) => {
                        setModalState(ModalState.CropSquare);
                        setImage(e);
                      }}
                      deleteImage={() => {
                        deleteImage(imageURL, setImageURL);
                      }}
                      hasImage={() => !!imageURL}
                      uploadText={"Upload Image"}
                      deleteText={"Delete Image"}
                  />
                </Grid>
              </Grid>
              <Grid item sm={4}>
                <EventImage
                    className={classes.preview}
                    imageURL={imageURL}
                    eventTitle={title ?? "event"}
                />
              </Grid>
            </Grid>
          </Grid>

          {compiled &&
              <Grid item sm={12}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        style={{ textAlign: "center" }}
                    >
                      Card Preview
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        className={classes.cardImageSelector}
                    >
                      <ImageSelector
                          setImage={(e) => {
                            setModalState(ModalState.CropCard);
                            setImage(e);
                          }}
                          deleteImage={() => {
                            deleteImage(cardImageURL, setCardImageURL);
                          }}
                          hasImage={() => !!cardImageURL}
                          uploadText={"Upload Card Image"}
                          deleteText={"Delete Card Image"}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={9} sm={7}>
                    <EventCard event={compiled} handleClick={undefined} />
                  </Grid>
                </Grid>
              </Grid>
          }
        </Grid>
      </ModalDialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={putEvent}>
          Save Project
        </Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>);
});

export default AddModifyEventModal;
