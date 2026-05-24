const authService = require('../services/authService');

const logControllerError = (operation, error) => {
    console.error(`[authController:${operation}]`, {
        message: error.message,
        stack: error.stack
    });
};

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);

        return res.status(200).json({
            message: result?.delivery?.fallback
                ? 'Đăng ký thành công. SMTP không khả dụng, OTP đã được in ra terminal.'
                : 'Đăng ký thành công. Vui lòng kiểm tra email để lấy OTP.',
            delivery: result?.delivery ?? { sent: false, fallback: true }
        });
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(409).json({ message: "Email đã tồn tại trong hệ thống." });
        }

        logControllerError('register', error);
        return res.status(500).json({
            message: `Register failed: ${error.message}`,
            operation: 'register',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        return res.status(200).json({
            message: 'Đăng nhập thành công.',
            token: result.token,
            user: result.user,
            url: result.redirectUrl
        });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        if (error.message === 'ACCOUNT_INACTIVE') {
            return res.status(403).json({ message: 'Tài khoản chưa được kích hoạt.' });
        }

        logControllerError('login', error);
        return res.status(500).json({
            message: `Login failed: ${error.message}`,
            operation: 'login',
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyOtp(email, otp);
        return res.status(200).json({ message: "Xác thực thành công. Tài khoản đã được kích hoạt." });
    } catch (error) {
        if (error.message === 'OTP_INVALID') return res.status(400).json({ message: "Mã OTP không chính xác." });
        if (error.message === 'OTP_EXPIRED') return res.status(400).json({ message: "Mã OTP đã hết hạn." });
        logControllerError('verifyOtp', error);
        return res.status(500).json({
            message: `OTP verification failed: ${error.message}`,
            operation: 'verifyOtp',
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        message: 'Lấy thông tin profile thành công.',
        user,
        url: user.role === 'ADMIN' ? '/admin/profile' : '/user/profile'
    });
};

module.exports = { register, login, verifyOtp, getProfile };