const User = require('../models/user.models.js')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const generateAccessToken = require("../middleware/accesstoken.middleware.js")
const genOTP = require("../middleware/otp.register.middleware.js")

const registerUser = async (req, res) => {
    const { fullname,username ,email, password } = req.body;
    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ e: "All Fields are required" })
    }
    try {
        const userEmail = await User.findOne({ email })
        const userUsername=await User.findOne({ username })
        if (userEmail) {
            return res.status(409).json({ e: "This email is already registered" })
        }
        if (userUsername) {
            return res.status(409).json({ e: "This Username is already taken" })
        }
        const otp = await genOTP(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const regToken = jwt.sign(
            { fullname, email, password: hashedPassword, otp },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.cookie('_regToken', regToken, { httpOnly: true, maxAge: 600000 }).status(200).json({ m: "An otp has been send to your email to confirm registration" });
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}
const verifyUserRegistration = async (req, res) => {
    const { otpInput } = req.body;
    try {
        const regToken = req.cookies._regToken;
        const decodedToken = jwt.verify(regToken, process.env.JWT_SECRET);
        const { fullname, email, password, otp } = decodedToken;
        if (otpInput !== otp) {
            return res.status(401).json({ e: "Invalid OTP" })
        }
        const saveUser = await User.create({
            fullname,
            email,
            password
        })
        if (!saveUser) {
            return res.status(500).clearCookie('_regToken').json({ e: "Internal error" })
        }
        res.clearCookie('_regToken');
        res.status(200).json({ m: `${fullname} registered successfully` })
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ e: "All fields are required" })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ e: `${email} not registered` })
        }
        const passwordIsMatch = await bcrypt.compare(password, user.password);
        if (!passwordIsMatch) {
            return res.status(400).json({ e: "Incorrect Password" })
        }
        const accesstoken = generateAccessToken(user);
        res.cookie('accesstoken', accesstoken, { httpOnly: true });
        res.status(200).json({ m: `Successfully logged in as ${email}` });
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}

module.exports = { registerUser, verifyUserRegistration, loginUser };