const express = require('express');
const catalogController = require('../controllers/catalogController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');
const productImageUpload = require('../middlewares/productImageUpload');

const router = express.Router();

const handleProductImageUpload = (req, res, next) => {
	productImageUpload.array('images', 10)(req, res, (error) => {
		if (error) {
			const message = error.code === 'LIMIT_FILE_SIZE'
				? 'Each product image must be smaller than 10MB.'
				: error.message || 'Unable to process uploaded files.';

			return res.status(400).json({ message });
		}

		return next();
	});
};

router.get('/categories', catalogController.getCategories);
router.get('/products', catalogController.getProducts);
router.get('/products/latest', catalogController.getLatestProducts);
router.get('/products/best-sellers', catalogController.getBestSellingProducts);
router.get('/products/most-viewed', catalogController.getMostViewedProducts);
router.get('/products/promotions', catalogController.getPromotionProducts);
router.get('/products/:id', catalogController.getProductDetail);
router.post(
	'/products/:id/images',
	authenticateToken,
	authorizeRoles('ADMIN'),
	handleProductImageUpload,
	catalogController.uploadProductImages
);

module.exports = router;
