const nodemailer = require('nodemailer');

async function genOTP(email) {

    try{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSCODE
        }
    });

    const sendOTPEmail = (email, otp) => {
        const mailOptions = {
            from: process.env.GMAIL_ID,
            to: email,
            subject: `Your OTP:${otp}`,
            text: `Your OTP for registration is: ${otp}.`
        };

        return transporter.sendMail(mailOptions);
    };

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const otpGenerated = generateOTP()
    await sendOTPEmail(email, otpGenerated)
    return otpGenerated
}catch(err){
    res.status(500).json({e:"Unknown error occured"});
}
}

module.exports = genOTP