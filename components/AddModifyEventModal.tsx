import React, { ChangeEvent, useState, Fragment } from "react";
import { useSnackbar } from "notistack";
import { Theme } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import CloseIcon from "@mui/icons-material/Close";
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
  Button,
  Switch,
} from "@mui/material";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { storage } from "firebaseClient";
import { LoadingButton } from "@mui/lab";
import { DialogActions } from "@mui/material";
import { Guid } from "guid-typescript";
import EventImage from "components/eventImage";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import RichTextEditor from "components/richTextEditor";
import CollapsibleRichTextEditor from "components/collapsibleRichTextEditor";
import makeStyles from "@mui/styles/makeStyles";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { setLocation } from "helpers/locations";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  preview: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  cropHolder: {
    height: "calc(100% - 64px)",
  },
  mainImageSelector: {
    rowGap: 20,
  },
  cardImageSelector: {
    columnGap: 30,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  modalContent: {
    overflowX: "hidden",
  },
}));

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

// make sure user is admin to access page if not redirect back
// to opportunities page
const ModalDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  const classes = useStyles();
  return (
    <DialogTitle className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const ModalDialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(DialogContent);

export const volunteerTypes = [
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
  "Types of Volunteers Needed",
  "Website Link",
  "Contact Information",
  "HS Grad Student Information",
  "Project Description",
  "Project Specific Training",
  "Provider Information",
  "Services Provided",
  "Tips and Reminders",
  "Clinic Schedule",
  "Clinic Flow",
  "Address/Parking/Directions",
] as const;



const reservedFields = new Set([
  "Title",
  "Project Description",
  "Details",
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
  "SignupActive",
  "Sign-up Link",
]);

interface AddModifyEventModalProps {
  open: boolean;
  event?: EventData;
  handleClose: any;
}

interface ImageSelectorProps {
  setImage: (e: ChangeEvent<HTMLInputElement>) => any;
  deleteImage: () => any;
  hasImage: () => boolean;
  uploadText: string;
  deleteText: string;
}

interface CropModalProps {
  cropImage: string;
  open: boolean;
  saveImage: (blob: Blob) => Promise<void>;
  aspectRatio: number;
  handleClose: () => any;
}

enum ModalState {
  Main,
  CropSquare,
  CropCard,
}

interface RichFieldEditorProps {
  initialContent: string;
  fieldName: string;
  setField: (fieldName: string, output: string) => void;
}

const RichFieldEditor = React.memo(function RichFieldEditor(
  props: RichFieldEditorProps,
) {
  return (
    <CollapsibleRichTextEditor
      innerProps={{
        initialContent: props.initialContent,
        output: (output) => {
          props.setField(props.fieldName, output ?? "");
        },
        placeholder: props.fieldName,
      }}
    />
  );
});

const ImageSelector = (props: ImageSelectorProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <React.Fragment>
      <Button
        variant="outlined"
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
  );
};

const CropModal = (props: CropModalProps) => {
  const cropperRef = React.useRef<HTMLImageElement>(null);
  const classes = useStyles();
  const { cropImage, open, aspectRatio, saveImage, handleClose } = props;

  const [loading, setLoading] = useState(false);

  const onCrop = () => {
    // Note: react-cropper does not currently support proper typing
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setLoading(true);
    cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (!blob) {
        console.error("blob failed");
        return;
      }
      saveImage(blob).then(() => {
        handleClose();
        setLoading(false);
      });
    });
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="crop-dialog"
      open={open}
      fullWidth={true}
      PaperProps={{
        classes: {
          root: classes.cropHolder,
        },
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
          Scroll to zoom in/out; drag inside the box to move it; drag on the
          corners of the box to resize it
        </Typography>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="secondary"
          onClick={onCrop}
        >
          Crop
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const organizationList = [
  "Advocacy",
  "Clinical",
  "Health Education",
  "Mentorship & Outreact",
];

type FormFields = {
  Title: string;
  Organization: string;
  cardImageURL?: string;
  imageURL?: string;
  SignupActive: boolean;
  timestamp: Timestamp;
  Location: string;
  "Types of Volunteers Needed": string[];
  "Website Link"?: string;
  "Contact Information"?: string;
  "HS Grad Student Information": string;
  "Project Description": string;
  "Project Specific Training"?: string;
  "Provider Information"?: string;
  "Services Provided"?: string;
  "Tips and Reminders"?: string;
  "Clinic Schedule": string;
  "Clinic Flow": string;
  "Address/Parking/Directions": string;
  Protocols: string;
};

const AddModifyEventModal = (props: AddModifyEventModalProps) => {
  const { event, open, handleClose } = props;
  const { register, handleSubmit, watch, formState } = useForm<FormFields>({
    defaultValues: {
      Title: event?.Title ?? "",
      Organization: event?.Organization ?? "",
      cardImageURL: event?.cardImageURL ?? "",
      imageURL: event?.cardImageURL ?? "",
      SignupActive: event?.SignupActive ?? false,
      "Types of Volunteers Needed": event?.["Types of Volunteers Needed"] ?? [],
      "Website Link": event?.["Website Link"] ?? "",
      "Contact Information": event?.["Website Link"] ?? "",
      "HS Grad Student Information":
        event?.["HS Grad Student Information"] ?? "",
      "Project Description": event?.["Project Description"] ?? "",
      "Project Specific Training": event?.["Project Description"] ?? "",
      "Provider Information": event?.["Provider Information"] ?? "",
      "Services Provided": event?.["Services Provided"] ?? "",
      "Tips and Reminders": event?.["Tips and Reminders"] ?? "",
      "Clinic Schedule": event?.["Clinic Schedule"] ?? "",
      "Clinic Flow": event?.["Clinic Flow"] ?? "",
      "Address/Parking/Directions": event?.["Address/Parking/Directions"] ?? "",
      Protocols: event?.Protocols ?? "",
    },
  });
  const classes = useStyles();
  const [projectName, setProjectName] = useState<string>(event?.Title ?? "");
  const [projectLocation, setProjectLocation] = useState(event?.Location ?? "");
  const [description, setDescription] = useState<string>(
    event?.["Project Description"] ?? "",
  );
  const [organization, setOrganization] = useState<string>(
    event?.Organization ?? "",
  );
  const [volunteersNeeded, setVolunteersNeeded] = useState<string[]>(
    event?.["Types of Volunteers Needed"] ?? [],
  );
  const [imageURL, setImageURL] = useState<string>(event?.imageURL ?? "");
  const [cardImageURL, setCardImageURL] = useState<string>(
    event?.cardImageURL ?? "",
  );
  const [modalState, setModalState] = useState(ModalState.Main);
  const [cropImage, setCropImage] = useState<string | undefined>();
  const [signupActive, setSignupActive] = useState(
    event?.SignupActive ?? false,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [mutating, setMutating] = useState(false);
  const { location } = useParams();
  const [otherFields, dispatchOtherFields] = React.useReducer(
    (state: any, action: any) => {
      const { type, field, value } = action;
      if (type === "set_all") {
        return { ...value };
      } else if (type === "set_field") {
        return {
          ...state,
          [field]: value,
        };
      } else {
        throw new Error("Unknown action type " + type);
      }
    },
    {},
  );

  const deleteImage = async (
    url: string | undefined,
    setter: (v: string) => any,
  ) => {
    if (url) {
      const id = url.slice(url.lastIndexOf("/") + 1, url.indexOf("?"));

      const imageRef = ref(storage, id);

      await deleteObject(imageRef);
      setter("");
      alert(
        "Image deleted. Please save the event, or set the image and save the event.",
      );
    }
  };

  // Selects and uploads image to Firebase Storage and returns the image URL
  const saveImage = async (image: Blob): Promise<string> => {
    const photoId = Guid.create().toString();
    const storageRef = ref(storage, photoId);
    // Upload image to firebase storage then get its URL
    const snapshot = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

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
    console.log(imageFile);
  };

  const compileEvent = (): ProjectRequest | null => {
    if (!projectName || !description || !location || !organization) {
      return null;
    }

    // CalendarEventData is superset of EventData used in the APIs
    const uploadEvent: ProjectRequest = {
      Title: projectName,
      "Project Description": description,
      Organization: organization,
      Location: projectLocation,
      imageURL,
      cardImageURL,
      SignupActive: signupActive,
      timestamp: serverTimestamp(),
    };

    // Generate recurrence if no event or event doesn't have a Recurrence
    // Set other fields
    uploadEvent.imageURL = imageURL;
    uploadEvent.cardImageURL = cardImageURL;
    if (volunteersNeeded) {
      uploadEvent["Types of Volunteers Needed"] = volunteersNeeded;
    }
    uploadEvent.SignupActive = signupActive;
    return uploadEvent;
  };

  // Puts event to Firestore and Google Calendar
  const putEvent = () => {
    setMutating(true);
    const uploadEvent = compileEvent();

    if (!uploadEvent) {
      alert("Error: missing required field.");
    }
    getAuth()
      .currentUser?.getIdToken()
      .then(async (userToken) => {
        try {
          const res = await fetch("/api/put-event-data", {
            method: "POST",
            body: JSON.stringify({ eventData: uploadEvent, userToken }),
          });

          if (!res.ok) {
            console.log(await res.json());
            setMutating(false);
          }
          setMutating(false);
          enqueueSnackbar("event created", { variant: "success" });
        } catch (e) {
          setMutating(false);
          alert(e);
        }
      });
  };

  const setField = React.useCallback(
    (fieldName, value) => {
      dispatchOtherFields({
        type: "set_field",
        field: fieldName,
        value: value,
      });
    },
    [dispatchOtherFields],
  );

  const compiled = compileEvent();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      disableEnforceFocus
      maxWidth="lg"
    >
      <ModalDialogTitle id="event-dialog" onClose={handleClose}>
        <b>{event ? "Modify Event" : "Add Event"}</b>
      </ModalDialogTitle>
      <DialogContent>
        <div style={{ padding: "1.5rem" }}>
          {cropImage !== undefined && (
            <CropModal
              cropImage={cropImage}
              open={isCropperOpen}
              saveImage={(blob) => {
                return saveImage(blob).then((url) => {
                  if (modalState == ModalState.CropSquare) {
                    setImageURL(url);
                  } else {
                    setCardImageURL(url);
                  }
                });
              }}
              aspectRatio={modalState == ModalState.CropSquare ? 1 : 23 / 30}
              handleClose={() => {
                setModalState(ModalState.Main);
                setIsCropperOpen(false);
              }}
            />
          )}
          <div className={classes.modalContent}>
            <div style={{ marginBottom: "1rem" }}>
              <Button
                variant="outlined"
                onClick={() => setSignupActive(!signupActive)}
              >
                <Switch
                  checked={signupActive}
                  onClick={() => setSignupActive(!signupActive)}
                  color="primary"
                  inputProps={{ "aria-label": "controlled" }}
                />
                Allow Signup
              </Button>
              <span
                style={{
                  fontStyle: "italic",
                  color: "gray",
                  marginLeft: "0.5rem",
                }}
              >
                Note: This will make the signup button available to volunteers
              </span>
            </div>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("Title", { required: true })}
                  fullWidth
                  label="Project Name"
                />
              </Grid>

              <Grid style={{ maxWidth: "100%" }} item sm={12}>
                <Typography variant="h6" style={{ textAlign: "center" }}>
                  Detailed Project Description
                </Typography>
                <RichTextEditor
                  initialContent={event?.["Project Description"] ?? ""}
                  output={(value) => setDescription(value ?? "")}
                  editorOptions={{
                    attributes: {
                      style: "min-height: 250px",
                    },
                  }}
                  placeholder="Add a detailed project description here. If left empty, the project summary will be used."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    fullWidth
                    {...register("Location", { required: true })}
                    value={projectLocation}
                    onChange={e => setProjectLocation(e.target.value)}
                    label="Location *"
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Required</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl required fullWidth>
                  <InputLabel>Organization</InputLabel>
                  <Select
                    fullWidth
                    value={organization}
                    label="Organization *"
                    onChange={(e) => {
                      setOrganization(e.target.value);
                    }}
                  >
                    {organizationList.map((organization) => (
                      <MenuItem value={organization} key={organization}>
                        {organization}
                      </MenuItem>
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
                    value={
                      !Array.isArray(volunteersNeeded) ? [] : volunteersNeeded
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setVolunteersNeeded(
                        typeof value === "string"
                          ? value.split(",")
                          : (value as string[]),
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

              {initialFields.map((fieldName) => {
                return (
                  <Grid key={fieldName} item xs={12} sm={6}>
                    <TextField
                      type="text"
                      fullWidth
                      label={fieldName}
                      {...register(fieldName)}
                      onChange={(e) => setField(fieldName, e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                );
              })}

              <Grid item sm={12}></Grid>

              <ImagePreview
                imageURL={imageURL}
                setImage={(e) => {
                  setModalState(ModalState.CropSquare);
                  setImage(e);
                  setIsCropperOpen(true);
                }}
                deleteImage={() => {
                  deleteImage(imageURL, setImageURL);
                }}
              />
            </Grid>
            <LoadingButton
              variant="contained"
              onClick={putEvent}
              loading={mutating}
            >
              {!event ? "Create Project" : "Update Project"}
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type ImagePreviewProps = {
  imageURL: string;
  setImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteImage: () => void;
};
function ImagePreview({ imageURL, setImage, deleteImage }: ImagePreviewProps) {
  const classes = useStyles();
  return (
    <Grid item sm={12}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <Typography variant="h6" style={{ textAlign: "center" }}>
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
              setImage={setImage}
              deleteImage={deleteImage}
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
            eventTitle="Preview Image"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
export default AddModifyEventModal;
