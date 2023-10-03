import Papa from 'papaparse';

export const exportToCSV = (event) => {
  if(event == null) return;

  const csvData = [];
    
    if (event.volunteerTypes && event.volunteers) {
      event.volunteerTypes.forEach(type => {
        const volunteersOfType = event.volunteers[type] || [];

        volunteersOfType.forEach(volunteer => {
          const formattedPhoneNumber = volunteer.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

          const volunteerRow = {
            Role: type,
            Name: `${volunteer.firstName} ${volunteer.lastName}`,
            Email: volunteer.email,
            Phone: formattedPhoneNumber,
            Discipline: volunteer.studentDiscipline
          };

          csvData.push(volunteerRow);
        });
      });
    }

  const csvContent = Papa.unparse(csvData);

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'events.csv';
  link.click();
};
