import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNewGigEmail({
  to,
  gigTitle,
  gigDescription,
}: {
  to: string;
  gigTitle: string;
  gigDescription: string;
}) {
  const mailOptions = {
    from: `"GigsWall" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🚀 New Gig: ${gigTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f8f9ff; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
          <h2 style="color: #4B55C3;">🚀 A new gig just dropped on GigsWall!</h2>
          <h3>${gigTitle}</h3>
          <p>${gigDescription}</p>
          <a href="https://gigswall.com/gigs" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #4B55C3; color: white; text-decoration: none; border-radius: 8px;">Browse Gigs</a>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">You received this email because you're signed up on GigsWall.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.response);
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}`, err);
  }
}
