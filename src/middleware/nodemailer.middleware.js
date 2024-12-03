const nodemailer = require("nodemailer");

async function resetPasswordLink(email,resetLink){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSCODE,
        },
      });
      
      transporter.sendMail(
        {
          from: process.env.GMAIL_ID,
          to: email,
          subject: "Password Reset",
          html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        },
        (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
          } else {
            console.log("Email sent successfully:", info.response);
          }
        }
      ); 
}

module.exports=resetPasswordLink