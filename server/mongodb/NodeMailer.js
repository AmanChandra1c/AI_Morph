const Brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Brevo API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

async function sendEmail(name, email, message) {
  const sendSmtpEmail = {
    sender: { name: "Portfolio Message", email: process.env.GMAIL },
    to: [{ email: process.env.GMAIL }],
    subject: `📩 New Message from ${name} (${email})`,
    htmlContent: `
      <div style="
        font-family: 'Segoe UI', Roboto, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 12px;
        max-width: 600px;
        margin: auto;
        border: 1px solid #e0e0e0;
      ">
        <h2 style="color: #2b7a78; text-align: center;">💌 New Contact Message</h2>
        <p style="font-size: 16px; color: #333;">
          You received a new message from your portfolio website.
        </p>

        <div style="margin-top: 20px; background: #fff; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <p><strong style="color:#17252A;">👤 Name:</strong> ${name}</p>
          <p><strong style="color:#17252A;">📧 Email:</strong> <a href="mailto:${email}" style="color:#3AAFA9;">${email}</a></p>
          <p><strong style="color:#17252A;">💬 Message:</strong></p>
          <div style="background:#DEF2F1; padding:10px 15px; border-radius:8px; color:#222; white-space:pre-line;">
            ${message}
          </div>
        </div>

        <p style="font-size: 13px; color: #888; margin-top: 20px; text-align: center;">
          Sent automatically from your <strong>Portfolio Contact Form</strong>.
        </p>
      </div>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully!");
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Email failed to send.", error };
  }
}

module.exports = sendEmail;
