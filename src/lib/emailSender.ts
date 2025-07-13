import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendGigApplicationEmail({
  to,
  gigTitle,
  applicantName,
  applicantEmail,
}: {
  to: string;
  gigTitle: string;
  applicantName: string;
  applicantEmail: string;
}) {
  const mailOptions = {
    from: `"GigsWall" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📬 New Application for Your Gig: ${gigTitle}`,
    html: `
      <div style="background: linear-gradient(135deg, #3B4CCA, #667EEA, #A991F7); padding: 20px; font-family: 'Segoe UI', sans-serif; color: #fff;">
        <div style="background: #ffffff; border-radius: 10px; padding: 30px; max-width: 600px; margin: auto; color: #333;">
          <h2 style="color: #4B3BB3;">🚀 You've got a new gig application!</h2>
          <p><strong>${applicantName}</strong> just applied to your gig: <strong>${gigTitle}</strong>.</p>

          <table style="margin-top: 20px; font-size: 15px;">
            <tr>
              <td><strong>Applicant Name:</strong></td>
              <td>${applicantName}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td><a href="mailto:${applicantEmail}" style="color: #4B3BB3;">${applicantEmail}</a></td>
            </tr>
            <tr>
              <td><strong>Gig Title:</strong></td>
              <td>${gigTitle}</td>
            </tr>
          </table>

          <div style="margin-top: 30px;">
            <a href="https://gigswall.com/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #6B7FFF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View on Dashboard
            </a>
          </div>

          
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
