const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, trim: true, lowercase: true },
        otp_code: { type: String, required: true },
        expiresAt: { type: Date, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Otp', otpSchema);