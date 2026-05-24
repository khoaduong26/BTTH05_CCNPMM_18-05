const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
	registerLimiter,
	loginLimiter,
	registerValidation,
	loginValidation,
	authenticateToken,
	authorizeRoles
} = require('../middlewares/authMiddleware');

router.post('/register', registerLimiter, registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.get('/user/profile', authenticateToken, authorizeRoles('USER'), authController.getProfile);
router.get('/admin/profile', authenticateToken, authorizeRoles('ADMIN'), authController.getProfile);

module.exports = router;