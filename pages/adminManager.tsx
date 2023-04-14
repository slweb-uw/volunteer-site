import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { makeStyles } from '@material-ui/core/styles';
import { 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, Divider 
  } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { firestore } from "firebase-admin";
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
    margin: "0 auto",
    padding: 20,
    paddingTop: 100,
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
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
  },
  addButton: {
    backgroundColor: "#4b2e83",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  },
  removeButton: {
    color: "#f44336",
    "&:hover": {
      backgroundColor: "#e57373",
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
}));

const AdminPage = () => {
  // const user = firebase.auth().currentUser;
  // if(!user || (user.email !== "slweb@uw.edu" && user.email !== "bruno.futino@gmail.com")){
  //         return <div>You are not authorized to access this page.</div>
  // }

  const classes = useStyles();
  const [admins, setAdmins] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

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
    const existingAdmin = admins.find((admin) => admin.email === newAdminEmail);
    if (existingAdmin) {
      console.log("Admin already exists");
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


  const removeAdmin = (adminId) => {
    firebase
      .firestore()
      .collection("Admins")
      .doc(adminId)
      .delete()
      .then(() => {
        console.log("Admin removed successfully!");
      })
      .catch((error) => {
        console.error("Error removing admin: ", error);
      });
  };

    

  return (
    <div className={classes.root}>
    <Typography variant="h4" className={classes.heading}>
      Admin Panel
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
    <Divider className={classes.divider} />
    <List>
    {admins.map((admin, index) => (
          <React.Fragment key={admin.id}>
            <ListItem
              className={classes.listItem + " " + (index % 2 === 0 ? classes.evenListItem : "")}
              onClick={() => openConfirmation(admin)}
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
                  onClick={() => removeAdmin(admin.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default AdminPage;