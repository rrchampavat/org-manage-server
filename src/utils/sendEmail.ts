import nodemailer from "nodemailer";

const hostEmail = process.env.HOST_EMAIL;
const hostPassword = process.env.HOST_PASSWORD;

interface IReceiverEmail {
  receiverEmails: Array<string> | string;
  receiverName?: string;
  text?: string;
  html?: string;
  subject?: string;
}

const sendEmail = async (data: IReceiverEmail) => {
  try {
    const {
      receiverEmails,
      receiverName,
      text = `Welcome to Organisations Management ${receiverName || ""}`,
      html = `<h6>HTML here</h6>`,
      subject = "Organisations Management",
    } = data;

    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: hostEmail,
        pass: hostPassword,
      },
    });

    await transporter.verify();

    const mailContent = {
      from: `"Rutvikraj Champavat"<${hostEmail}>`,
      to: receiverEmails,
      bcc: "work.rrchampavat@gmail.com",
      subject: subject,
      text: text,
      html: html,
    };

    await transporter.sendMail(mailContent);
  } catch (error) {
    console.log("sendEmail  error >>>", error);
    throw new Error("Error while shooting email!");
  }
};

export default sendEmail;
