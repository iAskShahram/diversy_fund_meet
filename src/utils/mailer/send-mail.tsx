import { env } from "@/env";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const CLIENT_ID = env.G_CLIENT_ID;
const CLIENT_SECRET = env.G_CLIENT_SECRET;
const G_REFRESH_TOKEN = env.G_REFRESH_TOKEN;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const MAIL_FROM = env.G_MAIL_FROM;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({
  refresh_token: G_REFRESH_TOKEN,
});

let cachedAccessToken: null | undefined | string = null;
let accessTokenExpiry: null | undefined | number = null;
const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const transporter = await createTransporter();

  try {
    const mailOptions = {
      from: MAIL_FROM,
      to,
      subject,
      html: body,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email not sent", error);
    throw error;
  }
}

async function createTransporter() {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MAIL_FROM,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: G_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
}

async function getAccessToken() {
  if (
    accessTokenExpiry &&
    cachedAccessToken &&
    Date.now() < accessTokenExpiry - FIVE_MINUTES_IN_MS
  ) {
    return cachedAccessToken;
  }

  const { token, res } = await oAuth2Client.getAccessToken();
  if (!token || !res?.data.expiry_date) {
    throw new Error("Failed to get access token");
  }
  cachedAccessToken = token;
  accessTokenExpiry = Date.now() + res.data.expiry_date * 1000;
  return cachedAccessToken;
}
