import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = (to: string, subject: string, text: string): void => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: { response: string; }) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
