import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"GigsWall" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email - GigsWall",
    html: `
      <h2>Welcome to GigsWall!</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>It expires in 10 minutes.</p>
    `,
  });
}