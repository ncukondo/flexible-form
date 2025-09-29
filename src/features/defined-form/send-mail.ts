import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  pool: true,
});


const sendSystemMessageMail = async (mailTo: string, body: string, title = "") => {
  const msg = {
    to: mailTo,
    from: process.env.EMAIL_FROM ?? "",
    subject: title || "System Mail from THERS",
    text: body,
  };
  console.log("mail", msg);
  try {
    await transporter.sendMail(msg);
    console.log("mail sent");
  } catch (e) {
    console.error(e);
  }
};

export { sendSystemMessageMail };
