import type { SendMailOptions } from "nodemailer";
import mail from "../configs/mailer.js";
import type { SentMessageInfo } from "nodemailer/lib/smtp-transport/index.js";
import type { SMTPError } from "nodemailer/lib/smtp-connection/index.js";
import { getOtpEmailTemplate } from "../templates/otpTemplate.js";

class EmailService {
  async sendOTP(email: string, otp: string): Promise<SentMessageInfo> {
    const mailOptions: SendMailOptions = {
      from: `"App Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}`,
      html: getOtpEmailTemplate(otp),
    };
    try {
      const info = await mail.sendMail(mailOptions);
      return info;
    } catch (error) {
      const smtpError = error as SMTPError;
      console.error("Email delivery failed:", smtpError.message);
      throw smtpError;
    }
  }
}

const emailService = new EmailService();

export default emailService;
