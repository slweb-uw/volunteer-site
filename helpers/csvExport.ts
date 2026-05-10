import Papa from 'papaparse';
import { VolunteerData } from "new-types";

export const exportToCSV = (volunteers: VolunteerData[]) => {
  if(volunteers == null) return;
  const csvData: { Date: string; Role: string; Name: string; Email: any; Phone: any; Discipline: any; Comments: any; }[] = [];
  if (volunteers) {
    volunteers.forEach((volunteer: any) => {
      const formattedPhoneNumber = volunteer.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

      const volunteerRow = {
        Date: volunteer.date.split('T')[0],
        Role: volunteer.role,
        Name: volunteer.name,
        Email: volunteer.email,
        Phone: formattedPhoneNumber,
        Discipline: volunteer.studentDiscipline,
        Comments: volunteer.comments
      };
      
      csvData.push(volunteerRow);

    });
  }

  const csvContent = Papa.unparse(csvData);

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'events.csv';
  link.click();
};
