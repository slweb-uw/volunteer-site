import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from "firebase/app";
import "firebase/firestore";
import { useAuth } from "auth";
import { 
        Button, 
        Grid,
        IconButton
} from "@material-ui/core";
import { Add as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Encode Sans Compressed",
  },
  title: {
    fontWeight: 700,
    textAlign: "center",
  },
  header: {
    justifyContent: "center",
    maxWidth: "90%",
    margin: "0 auto",
    marginTop : "2rem",
    marginBottom: theme.spacing(8),
  },
  headerButton: {
    margin: theme.spacing(0, 3),
    textTransform: "none",
  },
  roleButton : {
    margin: theme.spacing(0, 3),
    minWidth: 150, 
    flexGrow: 1,
    "&.Mui-disabled": {
      color: "#333333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  buttonScroll : {
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  gridContainer: {
    width: "90%",
    margin: "0 auto",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  addButtonContainer: {
    
  },
  addButton: {
    color: "#333333",
    backgroundColor: "transparent",
    maxWidth: "100%"
  },
  message: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    height: '80vh',
  },
}));

interface Event {
  id: string;
  date: Date;
  selectedDate: Date | null;
  volunteerTypes: string[];
  volunteerQty: string[];
  volunteers: { [key: string]: string } | null;
}

const Signup = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const [authorizedUsers, setAuthorizedUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [authComplete, setAuthComplete] = useState(false);

  function checkEmail(email, authorizedUsers) {
    for (let i = 0; i < authorizedUsers.length; i++) {
      if (authorizedUsers[i].email === email) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Volunteers")
      .onSnapshot((snapshot) => {
        const userData = [];
        snapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });
        setAuthorizedUsers(userData);
    });

    setIsAuthorized(true);
    if (!user || (!user.email.endsWith("@uw.edu") && !checkEmail(user.email, authorizedUsers))) {
      setIsAuthorized(false);
    }

    setAuthComplete(true);
    return unsubscribe;
  }, [user, authorizedUsers]);

  if (!authComplete) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className={classes.root}>
        <div className={classes.message}>
          You are not authorized to access this page. &nbsp;
          {!user && <span style={{ color: "red" }}>Please login.</span>}
        </div>
      </div>
    );
  }

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const roleCount = [3,4,2,5,5];
  const roles = ["Vol type 1","Vol type 2","Vol type 3","Vol type 4","Vol type 5"];
  const dates = ["5/20","6/5","6/20","7/12", "9/8","11/9"];
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>Event title</h1>
      <div className={classes.header}>
        <div className={classes.buttonScroll}>
        {dates.map(date => (
          <Button
            key={date}
            className={classes.headerButton}
            variant={currentDate === date ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleDateChange(date)}
          >
            {date}
          </Button>
        ))}
        </div>
      </div>

      <Grid container className={classes.gridContainer}>
        {roles.map((role, index) => (
          <Grid item >
            <Button
              className={classes.roleButton}
              variant={"contained"}
              color="primary"
              disabled
            >
              {role}
            </Button>
            {[...Array(roleCount[index])].map((_, rowIndex) => (
              <div key={rowIndex} className={classes.addButtonContainer}>
                <Button
                  className={classes.roleButton}
                  variant={"contained"}
                  color="#d5d5d5"
                  style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}
                >
                  <AddIcon />
                </Button>
                
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Signup;
