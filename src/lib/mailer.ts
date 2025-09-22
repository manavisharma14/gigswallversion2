import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // info@gigswall.com
    pass: process.env.EMAIL_PASS, // Zoho app password
  },
});

export const sendOTPEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: `"GigsWall" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your email - GigsWall',
    html: `
      <h2>Welcome to GigsWall!</h2>
      <p>Your OTP code is:</p>
      <h3>${otp}</h3>
      <p>It expires in 10 minutes.</p>
    `,
  });
};