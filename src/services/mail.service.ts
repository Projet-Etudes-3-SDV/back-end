import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { AppError } from '../utils/AppError';
dotenv.config();

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendHtmlEmail = (to: string, subject: string, htmlContent: string, attachments?: EmailAttachment[]): void => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: htmlContent,
    attachments: attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType || 'text/html'
    }))
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: { response: string; }) => {
    if (error) {
      console.log(error);
      throw new AppError('Failed to send email', 500);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export const sendEmail = (to: string, subject: string, text: string, attachments?: EmailAttachment[]): void => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
    attachments: attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType || 'text/html'
    }))
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: { response: string; }) => {
    if (error) {
      console.log(error);
      throw new AppError('Failed to send email', 500);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
