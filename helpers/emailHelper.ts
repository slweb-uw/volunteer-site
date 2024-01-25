import nodemailer from 'nodemailer';
import { firebaseClient } from './firebaseClient';

// Function to check if a role is expiring soon
export const isRoleExpiringSoon = (timestamp: firebaseClient.firestore.Timestamp) => {
  const creationDate = timestamp.toDate();
  
  // Calculate the expiry date (two years from creation)
  const expiryDate = new Date(creationDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);

  // Calculate the notification date (6 months before expiry)
  const notificationDate = new Date(expiryDate);
  notificationDate.setMonth(notificationDate.getMonth() - 6);

  // Check if the current time is after the notification date
  return Date.now() > notificationDate.getTime();
};

// Function to send an expiry notification email
export const sendExpiryNotificationEmail = async (email: string) => {
  // Configure the Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'uwslweb@gmail.com',
      pass: 'VolunteerSite2019',
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'uwslweb@gmail.com',
    to: email,
    subject: 'UW Service Learning Role Expiry Notification',
    text: 'This email is to notify you that your role in the website:\
    https://servicelearning.washington.edu/ is expiring soon. \
    If you wish to renew your acess, please contact somone on the \
    website team.',
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};