import nodemailer from "nodemailer";
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

  console.log("SMTP_EMAIL", SMTP_EMAIL);
  console.log("SMTP_PASSWORD", SMTP_PASSWORD);

  const transport = nodemailer.createTransport({
    service: "gmail",
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
    });

    console.log("sendResult", sendResult);
  } catch (error) {
    console.log(error);
  }
}

export function compileBookedSessionTemplate(title: string, content: string) {
  const template = handlebars.compile(bookedSessionTemplate);
  const htmlBody = template({
    title: title,
    content: content,
  });
  return htmlBody;
}
