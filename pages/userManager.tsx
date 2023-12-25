import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "auth";
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from "@material-ui/icons/Delete";
import { 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
  } from "@material-ui/core";
  import HelpIcon from '@mui/icons-material/HelpOutline';
  import AuthorizationMessage from "./AuthorizationMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed, sans-serif",
    maxWidth: 800,
    minHeight: 600,
    margin: "0 auto",
    padding: 20,
    marginTop: "2rem",
    marginBottom: "2rem",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  heading: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    marginBottom: 20,
  },
  textField: {
    marginRight: 10,
    width: "100%",
  },
  addButton: {
    backgroundColor: "#4b2e83",
    color: "#fff",
    width: "10%",
    "&:hover": {
      backgroundColor: "#B7A57A",
    },
  },
  removeButton: {
    color: "#808080",
    margin: "0 0 0 0",
    padding: "0 0 0 0",
    "&:hover": {
      backgroundColor: "#DDDDDD",
    },
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  evenListItem: {
    backgroundColor: "#f5f5f5",
  },
  listItemText: {
    fontWeight: "bold",
  },
  divider: {
    margin: "20px 0",
  },
  popup: {
    position: "relative",
    fontWeight: 600,
    left: -20,
    width: 150,
    height: 20,
    fontSize: 12,
    margin: 0,
    padding: 0,
    color: "red",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  headerButton: {
    margin: theme.spacing(0, 1),
    textTransform: "none",
  },
  centeredButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  }
}));

const AdminPage = () => {
  const classes = useStyles();
  const { user, superAdmins } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [existentEmail, setExistentEmail] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [activeSection, setActiveSection] = useState("admins");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState("email");

  const handleSort = (column) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortedColumn(column);
  };

  // Loads Admins
  const loadAdmins = () => {
    const unsubscribe = firebase
      .firestore()
      .collection("Admins")
      .onSnapshot((snapshot) => {
        const adminsData = [];
        snapshot.forEach((doc) => {
          adminsData.push({ id: doc.id, ...doc.data() });
        });
        setAdmins(adminsData);
      });
    return unsubscribe;
  };

  // Loads Volunteers
  const loadVolunteers = () => {
    const unsubscribe = firebase
      .firestore()
      .collection("Volunteers")
      .onSnapshot((snapshot) => {
        const volunteerData = [];
        snapshot.forEach((doc) => {
          volunteerData.push({ id: doc.id, ...doc.data() });
        });
        setVolunteers(volunteerData);
      });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = loadAdmins();
    return unsubscribe;
  }, []);
  
  useEffect(() => {
    const unsubscribe = loadVolunteers();
    return unsubscribe;
  }, []);

  const addUser = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setExistentEmail(false);
    setValidEmail(true);

    if(!emailPattern.test(newUserEmail)){
      setValidEmail(false);
      return;
    }
    
    var existentEmail;
    if(activeSection === "admins"){
      existentEmail= admins.find((admin) => admin.email === newUserEmail);
    }else{
      existentEmail= volunteers.find((volunteer) => volunteer.email === newUserEmail);
    }
    if (existentEmail) {
      setExistentEmail(true);
      setNewUserEmail("");
      return;
    }
    
    var userType = "Volunteers";
    if(activeSection === "admins") userType = "Admins";
    firebase
      .firestore()
      .collection(userType)
      //.doc(userUid)
      .add({ 
        email: newUserEmail,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("User added successfully!");
        setNewUserEmail("");
      })
      .catch((error) => {
        console.error("Error adding user", error);
      });
  };

  const removeUser = (userEmail) => {
    var userType = "Volunteers";
    if(activeSection === "admins") userType = "Admins";
    
    firebase
      .firestore()
      .collection(userType)
      .where("email", "==", userEmail)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("User removed successfully!");
      })
      .catch((error) => {
        console.error("Error removing user: ", error);
      });
  };

  if (!user || !superAdmins.includes(user.email)) {
    return (
      <AuthorizationMessage user={user} />
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.heading}>
        User Manager
      </Typography>
      <div className={classes.header}>
        <div className={classes.centeredButtons}>
          <Button
            className={classes.headerButton}
            variant={activeSection === "admins" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveSection("admins")}
          >
            Admins
          </Button>
          <Button
            className={classes.headerButton}
            variant={activeSection === "volunteers" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setActiveSection("volunteers")}
          >
            Non-UW Preceptors
          </Button>
        </div>
        <Button style={{marginLeft: "auto"}} onClick={() => setHelpDialogOpen(true)}>
          <HelpIcon color="secondary" />
        </Button>
      </div>
      <form className={classes.form} onSubmit={addUser}>
        <TextField
          label={`Add new ${activeSection === "admins" ? "admin" : "volunteer"}`}
          variant="outlined"
          className={classes.textField}
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value.toLowerCase())}
        />
        <Button type="submit" variant="contained" className={classes.addButton}>
          Add
        </Button>
      </form>
    {!validEmail && (
      <div className={classes.popup}>*Invalid email format</div>
    )}
    {existentEmail && (
      <div className={classes.popup} style={{color:'orange'}}>*Admin already exists</div>
    )}
    <Table>
      <TableHead>
        <TableRow >
          <TableCell onClick={() => handleSort("email")}>
            Email Address {sortedColumn === "email" && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
          </TableCell>
          <TableCell onClick={() => handleSort("timestamp")}>
              Date Added {sortedColumn === "timestamp" && <span>{sortOrder === "asc" ? "▲" : "▼"}</span>}
            </TableCell>
          <TableCell align="right">Delete</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {activeSection === "admins" ? (
          admins
            .filter((admin) => admin.email.toLowerCase().includes(newUserEmail))
            .sort((a, b) => {
              const order = sortOrder === "asc" ? 1 : -1;
              return a[sortedColumn] > b[sortedColumn] ? order : -order;
            })
            .map((admin, index) => (
              <TableRow key={admin.id} className={index % 2 === 0 ? classes.evenListItem : ""}>
                <TableCell className={classes.listItemText}>{admin.email}</TableCell>
                <TableCell>{admin.timestamp && admin.timestamp.toDate().toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    className={classes.removeButton}
                    onClick={() => {
                      setConfirmationOpen(true);
                      setSelectedUser(admin.email);
                    }}
                  >
                    <DeleteIcon style={{height:"25px"}}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
        ) : (
          volunteers
            .filter((volunteer) => volunteer.email.toLowerCase().includes(newUserEmail))
            .sort((a, b) => {
              const order = sortOrder === "asc" ? 1 : -1;
              return a[sortedColumn] > b[sortedColumn] ? order : -order;
            })
            .map((volunteer, index) => (
              <TableRow key={volunteer.id} className={index % 2 === 0 ? classes.evenListItem : ""}>
                <TableCell className={classes.listItemText}>{volunteer.email}</TableCell>
                <TableCell>{volunteer.timestamp && volunteer.timestamp.toDate().toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    className={classes.removeButton}
                    onClick={() => {
                      setConfirmationOpen(true);
                      setSelectedUser(volunteer.email);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
        )}
      </TableBody>
    </Table>
    <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
      <DialogTitle>Delete {activeSection === "admins" ?  "admin" : "volunteer"}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove the {activeSection === "admins" ?  "admin" : "volunteer"} with email: {selectedUser}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmationOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {removeUser(selectedUser); setConfirmationOpen(false);}} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
      <DialogTitle>User Manager Guide</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The User Manager Interface provides a platform for listing and managing the two types of users: <b>Admins</b> and <b>Non-UW Preceptors</b>.
        </DialogContentText>
        <DialogContentText>
          <b>Admins</b> have special privileges, allowing them to create, edit, and remove events.
        </DialogContentText>
        <DialogContentText>
          <b>Non-UW Preceptors</b> are users with non-UW email addresses who have access to volunteer for events.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setHelpDialogOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
};

export default AdminPage;