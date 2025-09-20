const nodemailer = require('nodemailer');
require('dotenv').config();

// Plug in Mailjet SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,                   
  auth: {
    user: process.env.SMTP_API_KEY,
    pass: process.env.SMTP_API_SECRET, 
  },
});

module.exports = transporter;