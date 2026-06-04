import nodemailer, { type Transporter } from "nodemailer";

import type { SentMessageInfo } from "nodemailer/lib/smtp-transport/index.js";

const mail: Transporter<SentMessageInfo> = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

export default mail;
