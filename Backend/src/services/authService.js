const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/OTP');
const emailService = require('./emailService');
const { generateOTP } = require('../utils/generateOTP');

const register = async (email, password, name = '') => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new Error('EMAIL_EXISTS');
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        status: 'INACTIVE'
    });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 phút

    await Otp.create({ email: normalizedEmail, otp_code: otpCode, expiresAt });

    const delivery = await emailService.sendOtpMail(normalizedEmail, otpCode);

    return {
        email: normalizedEmail,
        otpCode,
        delivery
    };
};

const verifyOtp = async (email, otpCode) => {
    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({ email: normalizedEmail, otp_code: otpCode }).sort({ createdAt: -1 });

    if (!otpRecord) throw new Error('OTP_INVALID');
    if (new Date() > otpRecord.expiresAt) throw new Error('OTP_EXPIRED');

    await User.updateOne(
        { email: normalizedEmail },
        { $set: { status: 'ACTIVE' } }
    );

    await Otp.deleteMany({ email: normalizedEmail });
};

const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (user.status !== 'ACTIVE') {
        throw new Error('ACCOUNT_INACTIVE');
    }

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        secret,
        { expiresIn: process.env.JWT_EXPIRE || '1d' }
    );

    return {
        token,
        user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name ?? '',
            role: user.role
        },
        redirectUrl: user.role === 'ADMIN' ? '/admin/profile' : '/user/profile'
    };
};

module.exports = { register, verifyOtp, login };