import sgMail from "@sendgrid/mail";

const avoidErrorByUrlAutoProcess = (text: string) => {
  const regex = /(https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+)"/g;
  return text.replaceAll(regex, "$1 \"");
}

const sendSystemMessageMail = async (mailTo: string, body: string, title = "") => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");
  const msg = {
    to: mailTo,
    from: process.env.SENDGRID_MAIL_FROM ?? "",
    subject: title || "System Mail from THERS",
    text: avoidErrorByUrlAutoProcess(body),
  };
  console.log("mail", msg);
  try {
    await sgMail.send(msg);
    console.log("mail sent");
  } catch (e) {
    console.error(e);
  }
};

export { sendSystemMessageMail };
