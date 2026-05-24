const nodemailer = require('nodemailer');
require('dotenv').config();

const hasSmtpCredentials = () => {
    return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const createTransporter = () => {
    if (!hasSmtpCredentials()) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const logOtpFallback = (email, otp) => {
    console.warn('[emailService] SMTP credentials are missing or invalid. Falling back to console OTP output.');
    console.log('OTP CODE:', otp);
    console.log('OTP EMAIL:', email);
};

const sendOtpMail = async (email, otp) => {
    if (!email || !otp) {
        throw new Error('EMAIL_SERVICE_INVALID_INPUT');
    }

    const transporter = createTransporter();

    if (!transporter) {
        logOtpFallback(email, otp);
        return {
            sent: false,
            fallback: true,
            message: 'SMTP credentials missing; OTP printed to terminal.'
        };
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã OTP Xác Nhận Đăng Ký Tài Khoản',
        html: `<h3>Mã OTP của bạn là: <b>${otp}</b></h3><p>Mã này có hiệu lực trong 5 phút.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            sent: true,
            fallback: false,
            message: 'OTP email sent successfully.'
        };
    } catch (error) {
        console.error('[emailService] sendMail failed', {
            message: error.message,
            stack: error.stack
        });
        logOtpFallback(email, otp);
        return {
            sent: false,
            fallback: true,
            message: error.message
        };
    }
};

module.exports = { sendOtpMail };