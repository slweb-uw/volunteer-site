import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { EventData, VolunteerData } from '../new-types';

interface VolunteerSignupGridProps {
  eventData: EventData;
  volunteers: VolunteerData[];
  onSignUp: (role: string) => void;
}

const VolunteerSignupGrid: React.FC<VolunteerSignupGridProps> = ({
  eventData,
  volunteers,
  onSignUp,
}) => {
  const roles = Object.keys(eventData.openings || {});

  const volunteersByRole = volunteers.reduce((acc, volunteer) => {
    const { role } = volunteer;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(volunteer);
    return acc;
  }, {} as Record<string, VolunteerData[]>);

  const getHeaderText = () => {
    if (!eventData.date) return 'EVENT SCHEDULE';
    const startDate = new Date(eventData.date.toString());
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateString = startDate.toLocaleDateString('en-US', dateOptions);
    const startTimeString = startDate
      .toLocaleTimeString('en-US', timeOptions)
      .replace(' ', '');
    const endTimeString = endDate
      .toLocaleTimeString('en-US', timeOptions)
      .replace(' ', '');

    return `${dateString} | ${startTimeString}-${endTimeString}`;
  };

  return (
    <Box
      sx={{
        border: 0
      }}
    >
      {/* Grid Header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '250px 1fr' },
        }}
      >
        <Box sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Box
          sx={{
            backgroundColor: '#4b2e83',
            color: 'white',
            py: 2,
            px: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body1"
            fontWeight="700"
            letterSpacing={1}
          >
            {getHeaderText().toUpperCase()}
          </Typography>
        </Box>
      </Box>

      {/* Grid Rows */}
      {roles.map((role) => {
        const volunteersForRole = volunteersByRole[role] || [];
        const spotsOpen = eventData.openings?.[role] ?? 0;
        const isFull = spotsOpen <= 0;

        let buttonText = 'JOIN';
        if (isFull) {
          buttonText = 'SIGN UP FULL';
        } else if (volunteersForRole.length === 0) {
          buttonText = 'BE THE FIRST!';
        }

        return (
          <Box
            key={role}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '250px 1fr' },
              borderTop: '1px solid #ffffff', // inner divider
            }}
          >
            {/* Role Name Cell */}
            <Box
              sx={{
                backgroundColor: '#9184aa',
                color: 'white',
                py: 2,
                px: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                fontWeight="700"
                letterSpacing={0.5}
              >
                {role.toUpperCase()}
              </Typography>
            </Box>

            {/* Volunteer & Button Cell */}
            <Box
              sx={{
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ p: 1.5, minHeight: '60px' }}>
                {volunteersForRole.map((v) => (
                  <Typography
                    key={v.uid}
                    fontSize="0.875rem"
                    color="#333"
                  >
                    {v.name}
                  </Typography>
                ))}
              </Box>
              <Box
                sx={{
                  backgroundColor: '#EBE5D6',
                  borderTop: '1px solid #DDCDBE',
                }}
              >
                <Button
                  fullWidth
                  disabled={isFull}
                  onClick={() => onSignUp(role)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    justifyContent: 'center',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: isFull ? '#AAA' : '#4A2E6C',
                    backgroundColor: isFull ? '#F0ECE2' : 'transparent',
                    py: 0.75,
                    px: 2,
                    '&:hover': {
                      backgroundColor: isFull
                        ? '#F0ECE2'
                        : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default VolunteerSignupGrid;
