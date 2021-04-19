import React, { useEffect, useState } from 'react';
import Dialog from "@material-ui/core/Dialog";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DOMAIN = window.location.protocol + '//' + window.location.hostname;

interface Props {
    event: EventData;
    delete: Boolean;
    handleClose: any;
    open: boolean;
}

const CalendarModifyEvent: React.FC<Props> = (Props) => {
    const calendarEvent: CalendarEventData = {
        Name: Props.event.Title,
        Description: Props.event['Project Description'],
        Organization: Props.event.organization,
        Location: Props.event['Location'],
        StartDate: Props.event.Timestamp.toISOString(),
        EndDate: Props.event['EndDate'],
        Timezone: Props.event['Timezone'],
        Recurrence: [Props.event['Recurrence']]
    };
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [resp, setResp] = useState("");
    if (!Props.delete) {
        useEffect(() => {
            let calendarApiPath = '/api/put-calendar-event';
            fetch(DOMAIN + calendarApiPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calendarEvent),
            })
            .then(
                (res: any) => {
                setIsLoaded(true);
                setResp(res);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
        }, [])
    } else {
        //TODO: Placeholder for delete calendar api
    }
    if (error) {
        return (
        <Dialog
        open={Props.open}
        onClose={Props.handleClose}
        aria-labelledby="calendar-event-dialog"
        aria-describedby="calendar-event-description"
      >
        <DialogTitle id="calendar-event-dialog">{"Calendar Event: " + calendarEvent.Name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="calendar-event-description">
              Error: {error?.['message']}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={Props.handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

        );
    } else if (isLoaded) {
        return (
        <Dialog
        open={Props.open}
        onClose={Props.handleClose}
        aria-labelledby="calendar-event-dialog"
        aria-describedby="calendar-event-description"
      >
        <DialogTitle id="calendar-event-dialog">{"Calendar Event: " + calendarEvent.Name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="calendar-event-description">
              Loading...
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={Props.handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
        );
    } else {
        return (
        <Dialog
        open={Props.open}
        onClose={Props.handleClose}
        aria-labelledby="calendar-event-dialog"
        aria-describedby="calendar-event-description"
      >
        <DialogTitle id="calendar-event-dialog">{"Calendar Event: " + calendarEvent.Name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="calendar-event-description">
            <Typography>
                <b>Time: {Props.event.Timestamp.toISOString()}</b>
            </Typography>
            <Typography>
                <b>Recurrence: {calendarEvent.Recurrence}</b>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={Props.handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
        );
    }
};

export default CalendarModifyEvent;