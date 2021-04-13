import React from 'react';

const domain = window.location.hostname;

interface Props {
    event: EventData
    delete: Boolean
}


const ModifyEvent: React.FC<Props> = (Props) => {
    if (!Props.delete) {
        try {
            let calendarApiPath = '/api/put-calendar-event';
            let calendarEvent: CalendarEventData = {
                Name: Props.event.Title,
                Description: Props.event['Project Description'],
                Organization: Props.event.organization,
                Location: Props.event['location'],
                StartDate: Props.event.Timestamp.toISOString(),
                EndDate: Props.event['endDate'],
                Timezone: Props.event['timezone']
            };
            //TODO: check recurrence

        } catch(err) {
            throw new Error(err);
        }
    } else {

    }
    return(null);
};

export default ModifyEvent