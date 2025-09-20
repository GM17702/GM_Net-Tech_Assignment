const transporter = require('../config/nodemailerConfig');

const sendSignedPdf = async (to, filePath) => {
  const info = await transporter.sendMail({
    from: '"Gms PDF App" <gmworkmail10@gmail.com>', 
    to,
    subject: 'Your signed document',
    text: 'Hello,\n\nPlease find attached your signed PDF document.',
    attachments: [
      {
        filename: 'signed.pdf',
        path: filePath, // absolute or relative path
      },
    ],
  });

  console.log('Mail sent:', info.messageId);
}

module.exports = { sendSignedPdf };