// emailUtil.js

require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the email notification
async function sendEmailNotification(to, subject, text) {

  console.log('Sending email notification..');

  try {
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmailNotification;