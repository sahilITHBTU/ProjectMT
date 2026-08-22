import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async(options)=>{
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "ProjectMT",
        link: "https://ProjectMT.js/",
      }
    })

   const emailTextual =  mailGenerator.generatePlaintext(options.mailgenContent)
   const emailHtml = mailGenerator.generate(options.mailgenContent);
   

  const transport =  nodemailer.createTransport({
     host: process.env.MAILTRAP_SMTP_HOST,
     port: process.env.MAILTRAP_SMTP_PORT,
     auth: {
       user: process.env.MAILTRAP_SMTP_USER,
       pass: process.env.MAILTRAP_SMTP_PASSWORD
     }
   });

   const mail = {
     from:"mail.ProjectMT@example.com",
     to: options.email,
     subject:options.subject,
     text: emailTextual,
     html:emailHtml
   }
   try {
    await transport.sendMail(mail)
   } catch (error) {
    console.error("Email service failed . Make sure that u have provided your mailTrap credential in the .env file");
    console.error("Error",error);
   }
}

const emailVerficationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Mailgen! We\'re very excited to have you on board.",
      action: {
        instructions: "To verfiy  please click here",
        button: {
          color: "#5bbcf5",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we  love to help ",
    },
  };
};

const ForgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset the password of your account",
      action: {
        instructions: "To Reset your password  please click here",
        button: {
          color: "#f20505",
          text: "Verify your email",
          link: passwordResetUrl,
        }
      },
      outro:
        "Need help, or have questions? Just reply to this email, we  love to help ",
    }
  };
};

export {emailVerficationMailgenContent,ForgotPasswordMailgenContent,sendEmail}