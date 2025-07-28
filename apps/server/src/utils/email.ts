// src/utils/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to SendGrid/Mailgun later
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
  const html = `
    <h2>Reset Your CollabSphere Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await transporter.sendMail({
    from: `"CollabSphere" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Reset Your Password",
    html,
  });
};
//New Task assignment email
export const sendNewTaskEmail = async (to: string, taskName: string) => {
  const html = `
    <h2>New Task Assigned</h2>
    <p>You have been assigned a new task: <strong>${taskName}</strong>.</p>
    <p>Please log in to your account to view the details.</p>
  `;

  await transporter.sendMail({
    from: `"CollabSphere" <${process.env.EMAIL_USER}>`,
    to,
    subject: "📋 New Task Assigned",
    html,
  });
};

