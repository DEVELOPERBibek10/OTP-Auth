import type { SendMailOptions } from "nodemailer";
import mail from "../configs/mailer.js";
import type { SentMessageInfo } from "nodemailer/lib/smtp-transport/index.js";
import type { SMTPError } from "nodemailer/lib/smtp-connection/index.js";
import { getOtpEmailTemplate } from "../templates/otpTemplate.js";
import ApiError from "../utils/ApiError.js";

class EmailService {
  async sendOTP(email: string, otp: number): Promise<SentMessageInfo> {
    const mailOptions: SendMailOptions = {
      from: `"App Security" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}`,
      html: getOtpEmailTemplate(otp),
    };
    try {
      const info = await mail.sendMail(mailOptions);

      if (info.rejected.length > 0) {
        throw new ApiError(
          400,
          "EMAIL_DELIVERY_FAILED",
          `Email address ${email} was rejected by the provider.`
        );
      }
      return info;
    } catch (error) {
      const smtpError = error as SMTPError;
      console.error("Email delivery failed:", smtpError);
      throw new ApiError(
        smtpError.responseCode || 502,
        smtpError.code || "EMAIL_SERVICE_ERROR",
        smtpError.message
      );
    }
  }
}

const emailService = new EmailService();

export default emailService;
