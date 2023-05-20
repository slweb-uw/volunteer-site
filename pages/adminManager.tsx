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
    marginRight: 20,
    width: "700px",
  },
  addButton: {
    backgroundColor: "#4b2e83",
    color: "#fff",
    width: "100px",
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
    display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600,
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
  }
}));

const AdminPage = () => {
  const { user } = useAuth();
  const classes = useStyles();
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const authorizedEmails = ["slweb@uw.edu", "bruno.futino@gmail.com"]; // Hardcoded to limit who can manage admins
  const [emailValid, setEmailValid] = useState(true);
  const [existentAdmin, setExistentAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.
      firestore()
      .collection("Admins")
      .onSnapshot((snapshot) => {
        const adminsData = [];
        snapshot.forEach((doc) => {
          adminsData.push({id: doc.id, ...doc.data() });
        });
        setAdmins(adminsData);
      });
      return unsubscribe;
  }, []);

  const addAdmin = (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setExistentAdmin(false);
    setEmailValid(true);

    if(!emailPattern.test(newAdminEmail)){
      setEmailValid(false);
      return;
    }
    
    const existingAdmin = admins.find((admin) => admin.email === newAdminEmail);
    if (existingAdmin) {
      setExistentAdmin(true);
      setNewAdminEmail("");
      return;
    }
    
    firebase
      .firestore()
      .collection("Admins")
      .add({ email: newAdminEmail })
      .then(() => {
        console.log("Admin added successfully!");
        setNewAdminEmail("");
      })
      .catch((error) => {
        console.error("Error adding admin", error);
      });
  };

  const removeAdmin = (adminEmail) => {
    firebase
      .firestore()
      .collection("Admins")
      .where("email", "==", adminEmail)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("Admin removed successfully!");
      })
      .catch((error) => {
        console.error("Error removing admin: ", error);
      });
  };

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState({});

  const openConfirmation = (admin) => {
    setConfirmationOpen(true);
    setSelectedAdmin(admin.email);
  };

  if (!user || !authorizedEmails.includes(user.email)) {
    return (
      <div className={`${classes.root} ${classes.message}`}>
        <div>You are not authorized to access this page{!user ? ". Please login." : "."}</div>
      </div>
    );
  }
  
  return (
    <div className={classes.root}>
    <Typography variant="h4" className={classes.heading}>
      Admin Manager
    </Typography>
    <form className={classes.form} onSubmit={addAdmin}>
      <TextField
        label="Add new admin"
        variant="outlined"
        className={classes.textField}
        value={newAdminEmail}
        onChange={(e) => setNewAdminEmail(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" className={classes.addButton}>
        Add
      </Button>
    </form>
    {!emailValid && (
      <div className={classes.popup}>*Invalid email format</div>
    )}
    {existentAdmin && (
      <div className={classes.popup} style={{color:'orange'}}>*Admin already exists</div>
    )}
    <Divider className={classes.divider} />
    <List>
      {admins.map((admin, index) => (
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
      ))}
    </List>
    <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
      <DialogTitle>{"Delete Admin?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove the admin with email: {selectedAdmin}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmationOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {removeAdmin(selectedAdmin); setConfirmationOpen(false);}} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </div>
  );
};

export default AdminPage;