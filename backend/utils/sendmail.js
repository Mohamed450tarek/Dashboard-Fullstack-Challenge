import nodemailer from "nodemailer";

const sendEmail = async (options) => {
 
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,  
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

   
  const mailOptions = {
    from: "Mohamed Tarek  <no-reply@student-dashboard.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

 
  await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to: ${options.email}`);
};

export default sendEmail;
