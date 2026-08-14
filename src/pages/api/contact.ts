export async function handler(request: Request) {
  const formData = await request.formData();
  const subject = formData.has("subject") ? formData.get("subject") : "";
  const email = formData.has("email") ? formData.get("email") : "";
  const message = formData.has("message") ? formData.get("message") : "";
  const info = formData.get("info");

  // return early for the honeypot
  if (info) {
    console.warn("honey pot detected", { subject, email, message, info });
    return new Response("OK");
  }

  console.log("send email -> ", { subject, email, message });

  return new Response("OK");
}
