import nodemailer from "nodemailer";
import validateEnv from "./validateEnv";

const sendEmail = async (name: string, from: string, message: string) => {
  console.log("the details", name, from, message);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: validateEnv.EMAIL_USER, // Your Gmail email
        pass: validateEnv.EMAIL_PASS, // Your App Password
      },
    });

    const mailOptions = {
      from: from,
      to: validateEnv.EMAIL_USER, // Your email to receive messages
      subject: `New Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #333;">📬 New Message from ${name}</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${from}" style="color: #1a73e8; text-decoration: none;">${from}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This message was sent from your contact form website.</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email received:", result.response);
  } catch (error) {
    console.error("Error receiving email:", error);
    throw new Error("Failed to receive email");
  }
};

export default sendEmail;
