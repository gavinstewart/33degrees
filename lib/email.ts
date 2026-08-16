import { Resend } from "resend";

const FROM_ADDRESS = process.env.ENQUIRY_FROM_EMAIL ?? "Thirty Three Degrees <onboarding@resend.dev>";

export async function sendEnquiryNotification({
  name,
  email,
  message,
  recipients,
}: {
  name: string;
  email: string;
  message: string;
  recipients: string[];
}) {
  if (recipients.length === 0) return;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: recipients,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}
