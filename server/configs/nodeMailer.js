import nodemailer from "nodemailer";

// Create a transporter object using the SMTP settings
const transporter = nodemailer.createTransport({
    host: "",
    PORT: 587,
    sccure: false, //true for 465, false for other ports
    auth: {
        user: "",
        pass: ""
    },
});

const sendEmail = async ({to, subject, body}) => {
    const response = transporter.sendMail({
        from: "",
        to,
        subject,
        html: body,
    });
    return response;
}

export default sendEmail;