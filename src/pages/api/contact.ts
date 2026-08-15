import { Resource } from "sst";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export async function handler(request: Request) {
  const formData = await request.formData();
  const subject = formData.has("subject") ? (formData.get("subject") as string) : null;
  const email = formData.has("email") ? (formData.get("email") as string) : null;
  const message = formData.has("message") ? (formData.get("message") as string) : null;
  const info = formData.get("info");

  // return early for the honeypot
  if (info) {
    console.warn("honey pot detected", { subject, email, message, info });
    return new Response();
  }

  if (!subject || !email || !message) {
    console.log("incomplete form submission", { subject, email, message, info });
    return new Response("Incomplete submission", {
      status: 400,
      statusText: "Incomplete form submission",
    });
  }

  console.log("send email -> ", { subject, email, message });

  // TODO: where do we put the users emails?
  const client = new SESv2Client();

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: Resource.ContactFormEmail.sender,
      Destination: {
        ToAddresses: [Resource.ContactFormEmail.sender],
      },
      Content: {
        Simple: {
          Subject: {
            Data: `[website contact form] ${subject}`,
          },
          Body: {
            Text: {
              Data: [`New message from: ${email}`, "", message.trim()].join("\n"),
            },
          },
        },
      },
    }),
  );

  return new Response("Success", {
    statusText: "Successful submission",
  });
}
