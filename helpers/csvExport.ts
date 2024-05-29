import Papa from 'papaparse';

export const exportToCSV = (event: any) => {
  console.log(JSON.stringify(event));
  if(event == null) return;

  const csvData: { Role: any; Name: string; Email: any; Phone: any; Discipline: any; Comments: any; }[] = [];
    
    if (event.volunteerTypes && event.volunteers) {
      event.volunteerTypes.forEach((type: any) => {
        const volunteersOfType = event.volunteers[type] ? Object.values(event.volunteers[type]) : [];

        volunteersOfType.forEach((volunteer: any) => {
          const formattedPhoneNumber = volunteer.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

          const volunteerRow = {
            Role: type,
            Name: `${volunteer.firstName} ${volunteer.lastName}`,
            Email: volunteer.email,
            Phone: formattedPhoneNumber,
            Discipline: volunteer.studentDiscipline,
            Comments: volunteer.comments
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
