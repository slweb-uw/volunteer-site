import React, { useState, useEffect } from "react"
import makeStyles from "@mui/styles/makeStyles"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Select,
  MenuItem,
} from "@mui/material"

import { volunteerTypes } from "components/createOrModifyProjectModal"

const useStyles = makeStyles({
  title: {
    textAlign: "center",
  },
  emailLabel: {
    "& .MuiInput-underline:before": {
      borderBottomStyle: "solid",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomStyle: "solid",
    },
    "& .MuiInput-underline:after": {
      borderBottomStyle: "solid",
    },
    "& .Mui-disabled .MuiInput-underline:before": {
      borderBottomStyle: "solid",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "0.5rem",
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5rem",
    marginBottom: "0",
  },
})

const VolunteerPopup = ({
  open,
  handleClose,
  email,
  name,
  uid,
  phone,
  addVolunteer,
  onDeleteVolunteer,
  volunteer,
}) => {
  const classes = useStyles()
  // const [displayName, setDisplayName] = useState(name as string);
  const [phoneNumber, setPhoneNumber] = useState(phone || "") //TODO Set default state to phone number if provided
  const [comments, setComments] = useState("")
  const [studentDiscipline, setStudentDiscipline] = useState("")
  const [certified, setCertified] = useState(false)
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("")
  console.log(volunteer + "test")
  useEffect(() => {
    if (volunteer) {
      setPhoneNumber(volunteer.phoneNumber || "")
      setComments(volunteer.comments || "")
      setStudentDiscipline(volunteer.studentDiscipline || "")
      setCertified(volunteer.certified || false)
      setFormattedPhoneNumber(formatPhoneNumber(volunteer.phoneNumber || ""))
    }
  }, [volunteer])

  const validatePhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, "")
    return /^[0-9]{10}$/.test(cleaned)
  }

  function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "")
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phoneNumber
  }

  const handlePhoneNumberChange = (e) => {
    const rawPhoneNumber = e.target.value
    const cleanedPhoneNumber = rawPhoneNumber.replace(/\D/g, "")
    const formattedPhoneNumber = formatPhoneNumber(cleanedPhoneNumber)
    setFormattedPhoneNumber(formattedPhoneNumber)
    setPhoneNumber(cleanedPhoneNumber)
  }

  const isPhoneNumberValid = validatePhoneNumber(phoneNumber)
  const isSubmitDisabled = !(email && name && studentDiscipline && certified)

  const handleSubmit = () => {
    if (isPhoneNumberValid) {
      const volunteerData = {
        uid,
        email,
        name,
        phoneNumber,
        studentDiscipline,
        comments,
      }
      console.log(volunteerData)
      handleClose()
    } else {
      alert("Invalid phone number!")
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.title}>Volunteer Information</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          value={email}
          className={classes.emailLabel}
          fullWidth
          margin="normal"
          disabled
        />
        <div className={classes.selectContainer}>
          <Typography style={{ marginRight: "15px" }}>
            Student Discipline <span style={{ color: "red" }}>*</span>
          </Typography>
          <Select
            value={studentDiscipline}
            onChange={(e) => setStudentDiscipline(e.target.value)}
          >
            {volunteerTypes.map((studentType, index) => (
              <MenuItem key={index} value={studentType}>
                {studentType}
              </MenuItem>
            ))}
          </Select>
          {!studentDiscipline && (
            <Typography
              variant="caption"
              color="error"
              style={{ marginLeft: "10px" }}
            >
              Please select your student discipline
            </Typography>
          )}
        </div>
        <TextField
          label="Full Name *"
          value={name}
          style={{ margin: "0 auto 0.75rem" }}
          //   onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label={<span>Phone Number * (Only viewable by project lead)</span>}
          style={{ margin: "0 auto 0.75rem" }}
          value={formattedPhoneNumber}
          onChange={handlePhoneNumberChange}
          fullWidth
          margin="normal"
          onKeyDown={(e) => {
            const key = e.key
            const isValidInput =
              /\d/.test(key) || key === "Backspace" || key === "Delete"
            const isMaxLengthReached = formattedPhoneNumber.length >= 10

            if (
              !isValidInput ||
              (isMaxLengthReached && key !== "Backspace" && key !== "Delete")
            ) {
              e.preventDefault()
            }
          }}
        />
        <TextField
          label="Comments "
          value={comments}
          style={{ margin: "0 auto 0.75rem" }}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography
          style={{
            marginRight: "15px",
            fontSize: "small",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          Click{" "}
          <a
            href="https://canvas.uw.edu/courses/1693188/modules"
            target="blank"
          >
            here
          </a>{" "}
          to learn more about the service learning training and protocols.
        </Typography>
        <Typography
          style={{
            marginRight: "15px",
            fontStyle: "italic",
            fontSize: "0.7rem",
          }}
        >
          (*) Required fields
        </Typography>
        <div className={classes.buttonContainer}>
          {volunteer ? (
            <>
              <Button
                variant="outlined"
                onClick={() => onDeleteVolunteer(volunteer)}
                style={{ marginRight: "1rem", color: "gray" }}
              >
                Withdraw
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Signup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VolunteerPopup
