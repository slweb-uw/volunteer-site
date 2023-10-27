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
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  } from "@material-ui/core";
  import HelpIcon from '@mui/icons-material/HelpOutline';

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
    width: "90%",
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
  message: {
    display: 'block', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: 600,
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
  const authorizedUsers = ["clarkel@uw.edu", "dnakas4@uw.edu", "bruno.futino@gmail.com", "uwslweb@gmail.com"]; // Hardcoded to limit who can manage admins

  const classes = useStyles();
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [existentEmail, setExistentEmail] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [activeSection, setActiveSection] = useState("admins");

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
        adminsData.sort((a, b) => (a.email > b.email ? 1 : -1));
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
        volunteerData.sort((a, b) => (a.email > b.email ? 1 : -1));
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
      .add({ email: newUserEmail })
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

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const openConfirmation = (user) => {
    setConfirmationOpen(true);
    setSelectedUser(user.email);
  };

  if (!user || !authorizedUsers.includes(user.email)) {
    return (
      <div 
        className={`${classes.root} ${classes.message}`} 
        >
        <div style={{marginTop: "25vh", marginBottom: "1rem"}}>You are not authorized to access this page!</div>
        <div>
          {
            !user ? 
              <Button
              className={classes.headerButton}
              variant="contained"
              color="primary"
              onClick={() => {
                var provider = new firebase.auth.OAuthProvider("google.com");
                provider.setCustomParameters({
                  // Target uw login
                  tenant: "uw.edu",
                  prompt: 'select_account',
                });

                firebase.auth().signOut().then(() => {
                  firebase.auth().signInWithPopup(provider);
                });

              }}
              tabIndex={0}
            >
              Sign in
            </Button>
            : ""
          }
          
          <a href="/">
            <Button
              className={classes.headerButton}
              variant="outlined"
              color="grey"
            >
              Return
            </Button>
          </a>
          
        </div>
      </div>
    );
  }
  
  const handleSectionChange = (section) => setActiveSection(section);
  const openHelpDialog = () => setHelpDialogOpen(true);
  const closeHelpDialog = () => setHelpDialogOpen(false);

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
            onClick={() => handleSectionChange("admins")}
          >
            Admins
          </Button>
          <Button
            className={classes.headerButton}
            variant={activeSection === "volunteers" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSectionChange("volunteers")}
          >
            Volunteers
          </Button>
        </div>
        <Button style={{marginLeft: "auto"}} onClick={openHelpDialog}>
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
        required
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
    <Divider className={classes.divider} />
    <List>
      {activeSection === "admins" ? (admins.map((admin, index) => (
        <React.Fragment key={admin.id}>
          <ListItem
            className={classes.listItem + " " + (index % 2 === 0 ? classes.evenListItem : "")}
          >
            <ListItemText
              primary={admin.email}
              classes={{ primary: classes.listItemText }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                className={classes.removeButton}
                onClick={() => openConfirmation(admin)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))) : (volunteers.map((volunteer, index) => (
        <React.Fragment key={volunteer.id}>
          <ListItem
            className={classes.listItem + " " + (index % 2 === 0 ? classes.evenListItem : "")}
          >
            <ListItemText
              primary={volunteer.email}
              classes={{ primary: classes.listItemText }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                className={classes.removeButton}
                onClick={() => openConfirmation(volunteer)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </React.Fragment>
        
      )))}
    </List>
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
    <Dialog open={helpDialogOpen} onClose={closeHelpDialog}>
      <DialogTitle>User Manager Guide</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The User Manager Interface provides a platform for listing and managing the two types of users: <b>Admins</b> and <b>Volunteers</b>.
        </DialogContentText>
        <DialogContentText>
          <b>Admins</b> have special privileges, allowing them to create, edit, and remove events.
        </DialogContentText>
        <DialogContentText>
          <b>Volunteers</b> are users with non-UW email addresses who have access to volunteer for events.
        </DialogContentText>
        <DialogContentText style={{ fontSize: 'small' }}>
          * UW emails can still signup for opportunities and <b>do not</b> need to be listed as Volunteers.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHelpDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  
  );
};

export default AdminPage;