import Papa from 'papaparse';

export const exportToCSV = (events) => {
    const headers = [
      'Date',
      'Volunteer Types',
      'Volunteer Quantity',
      'Volunteers'
    ];
    
    const csvData = events.map(event => ({
      Date: event.date.toLocaleDateString(),
      'Volunteer Types': event.volunteerTypes.join(', '),
      'Volunteer Quantity': event.volunteerQty.join(', '),
      Volunteers: event.volunteers ? Object.values(event.volunteers).join(', ') : ''
    }));
  
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'events.csv';
    link.click();
  };
