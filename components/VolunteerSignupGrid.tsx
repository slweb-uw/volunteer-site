import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { EventData, VolunteerData } from '../new-types';
import { useEffect } from "react";

interface VolunteerSignupGridProps {
  eventData: EventData;
  volunteers: VolunteerData[];
  onSignUp: (role: string, date: string) => void;
  relevantDates: string[];
  targetDay: Number;
};

type rolesAndCapacity = {
  role: string;
  spots: Number;
}

const parseTimeStr = (baseDate: Date, timeString?: string) => {
  if (!timeString) return baseDate;
  const dateCopy = new Date(baseDate);
  const [hours, minutes] = timeString.split(':').map(Number);
  dateCopy.setHours(hours);
  dateCopy.setMinutes(minutes);
  return dateCopy;
};

const formatHeaderDate = (dateString: string, startTimeStr?: string, endTimeStr?: string) => {
  const baseDate = new Date(dateString);
  const startDate = parseTimeStr(baseDate, startTimeStr);
  const endDate = parseTimeStr(baseDate, endTimeStr);

  const datePart = baseDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    weekday: 'long',
  });

  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
  const startStr = startDate.toLocaleTimeString('en-US', timeOptions).replace(' ', '').toLowerCase();
  const endStr = endDate.toLocaleTimeString('en-US', timeOptions).replace(' ', '').toLowerCase();

  return `${datePart} | ${startStr}-${endStr}`;
};

const VolunteerSignupGrid: React.FC<VolunteerSignupGridProps> = ({
  eventData,
  volunteers,
  onSignUp,
  relevantDates,
  targetDay
}) => {
  const scrollToTarget = () => {
    const element = document.getElementById(`${targetDay}`);
    element?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
  }
  // volunteerTypes are not used anymore?
  const allRolesSet = new Set<string>(eventData.volunteerTypes || []);

  relevantDates.forEach(dateStr => {
    const dateKey = dateStr.split('T')[0];
    if (eventData.openings?.[dateKey]) {
      Object.keys(eventData.openings[dateKey]).forEach(r => allRolesSet.add(r));
    }
  });
  const roles = Array.from(allRolesSet).sort();

  const getVolunteersForCell = (role: string, dateStr: string) => {
    const targetDateKey = dateStr.split('T')[0];
    return volunteers.filter(v => 
      v.role === role && 
      v.date && 
      v.date.split('T')[0] === targetDateKey
    );
  };

  // Color Constants
  const COLORS = {
    headerBg: '#4B2E83',
    roleBg: '#9184AA',
    btnBg: '#E8E3D3',
    btnBorder: '#B7A57A',
    btnText: '#4B2E83',
    border: '#E8E3D3',
    divider: '#85754D',
  };

  useEffect(() => {
    scrollToTarget();
  }, []);

  return (
    <Box sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        borderRadius: '15px',
        boxShadow: 3, 
        bgcolor: 'white' 
    }}>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: `180px repeat(${relevantDates.length}, minmax(300px, 1fr))`,
          overflowX: 'auto',
          pb: 0 
        }}
      >
        {/* --- HEADER ROW --- */}
        <Box sx={{ 
          bgcolor: 'white', 
          position: 'sticky', 
          left: 0, 
          zIndex: 2,
          borderRight: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}` 
        }} />

        {/* Date Headers */}
        {relevantDates.map((dateStr, i) => (
          <Box
            id={`${i}`}
            key={dateStr}
            sx={{
              bgcolor: COLORS.headerBg,
              color: 'white',
              py: 1, 
              px: 2,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `1px solid white`,
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {formatHeaderDate(dateStr, eventData.startTime, eventData.endTime)}
            </Typography>
          </Box>
        ))}

        {/* Roles */}
        {roles.map((role) => (
          <React.Fragment key={role}>
            {/* Sticky Row Header*/}
            <Box
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 1,
                bgcolor: COLORS.roleBg,
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                borderBottom: `1px solid white`,
                borderRight: `1px solid white`,
              }}
            >
              <Typography variant="body2" fontWeight="700" sx={{ textTransform: 'capitalize' }}>
                {role}
              </Typography>
            </Box>

            {/* Date Cells for this Role */}
            {relevantDates.map((dateStr) => {
              const dateKey = dateStr.split('T')[0];
              const cellVolunteers = getVolunteersForCell(role, dateStr);
              const spotsOpen = eventData.openings?.[dateKey]?.[role] ?? 0;
              const isFull = spotsOpen <= 0;

              let buttonText = 'BE THE FIRST!';
              if (isFull) buttonText = 'FULL';
              else if (cellVolunteers.length > 0) buttonText = `JOIN : ${spotsOpen} spot(s) left`;

              return (
                <Box
                  key={`${role}-${dateStr}`}
                  sx={{
                    borderRight: `1px solid ${COLORS.border}`,
                    borderBottom: `1px solid ${COLORS.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '110px',
                    bgcolor: 'white'
                  }}
                >
                  {/* Volunteer List Area */}
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    {cellVolunteers.map((v, index) => (
                      <React.Fragment key={v.uid}>
                        <Typography variant="body2" sx={{ py: 0.25, fontSize: '0.85rem' }}>
                          {v.name}
                        </Typography>
                        
                        {index < cellVolunteers.length - 1 && (
                          <Divider 
                            sx={{ 
                              my: 0.25, 
                              borderStyle: 'dashed',
                              borderColor: COLORS.divider 
                            }} 
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                  <Box sx={{ 
                      p: 1.5,
                      bgcolor: 'white', 
                  }}></Box>
                  {/* Action Button Area */}
                  <Button
                    fullWidth
                    disabled={isFull}
                    onClick={() => onSignUp(role, dateStr)}
                    endIcon={!isFull && <ArrowForwardIcon fontSize="small" />}
                    sx={{
                      borderRadius: '20px',
                      py: 0.5,
                      bgcolor: isFull ? '#f5f5f5' : COLORS.btnBg,
                      color: isFull ? '#aaa' : COLORS.btnText,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '1px',
                      border: `1px solid ${isFull ? '#eee' : COLORS.btnBorder}`,
                      boxShadow: 'none',
                     '&:hover': {
                        bgcolor: isFull ? '#f5f5f5' : '#e0d4c0',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {buttonText}
                  </Button>
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default VolunteerSignupGrid;