import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'test@ethereal.email',
    pass: process.env.SMTP_PASS || 'testpassword',
  },
});

export const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@auth-service.com',
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
};
