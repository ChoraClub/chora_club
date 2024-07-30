const nodemailer = require("nodemailer");
import * as handlebars from "handlebars";
import { bookedSessionTemplate } from "./templates/bookedSession";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  // console.log("SMTP_EMAIL", SMTP_EMAIL);
  // console.log("SMTP_PASSWORD", SMTP_PASSWORD);

  console.log("to", to);
  console.log("name", name);
  // console.log("subject", subject);
  // console.log("body", body);

  const transport = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    secure: true,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log("testResult", testResult);
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: `${name} ${SMTP_EMAIL}`,
      to,
      subject,
      html: body,
      headers: {
        "List-Unsubscribe": "",
      },
    });

    console.log("sendResult", sendResult);
  } catch (error) {
    console.log(error);
  }
}

export function compileBookedSessionTemplate(
  title: string,
  title2: string,
  title3: string,
  content: string
) {
  const template = handlebars.compile(bookedSessionTemplate);
  const htmlBody = template({
    title: title,
    title2: title2,
    title3: title3,
    content: content,
  });
  return htmlBody;
}
