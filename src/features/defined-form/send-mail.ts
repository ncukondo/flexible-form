import nodemailer from 'nodemailer';

const makeTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  pool: true,
});


const sendSystemMessageMail = async (mailTo: string, body: string, title = "") => {
  const transporter = makeTransporter();
  const msg = {
    to: mailTo,
    from: process.env.EMAIL_FROM ?? "",
    subject: title || "System Mail from THERS",
    text: body,
  };
  console.log("mail", msg);
  await transporter.sendMail(msg);
  console.log("mail sent");
};

export { sendSystemMessageMail };
