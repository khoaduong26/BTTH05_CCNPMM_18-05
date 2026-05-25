const catalogService = require('../services/catalogService');
const productImageService = require('../services/productImageService');

const logControllerError = (operation, error) => {
  console.error(`[catalogController:${operation}]`, {
    message: error.message,
    stack: error.stack
  });
};

const getCategories = async (_req, res) => {
  try {
    const categories = await catalogService.getCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    logControllerError('getCategories', error);
    return res.status(500).json({
      message: `Failed to load categories: ${error.message}`,
      operation: 'getCategories'
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await catalogService.getProducts(req.query || {});
    return res.status(200).json(result);
  } catch (error) {
    logControllerError('getProducts', error);
    return res.status(500).json({
      message: `Failed to load products: ${error.message}`,
      operation: 'getProducts'
    });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 8);
    const items = await catalogService.getLatestProducts(limit);
    return res.status(200).json({ items });
  } catch (error) {
    logControllerError('getLatestProducts', error);
    return res.status(500).json({
      message: `Failed to load latest products: ${error.message}`,
      operation: 'getLatestProducts'
    });
  }
};

const getBestSellingProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 8);
    const items = await catalogService.getBestSellingProducts(limit);
    return res.status(200).json({ items });
  } catch (error) {
    logControllerError('getBestSellingProducts', error);
    return res.status(500).json({
      message: `Failed to load best sellers: ${error.message}`,
      operation: 'getBestSellingProducts'
    });
  }
};

const getMostViewedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 10);
    const items = await catalogService.getMostViewedProducts(limit);
    return res.status(200).json({ items });
  } catch (error) {
    logControllerError('getMostViewedProducts', error);
    return res.status(500).json({
      message: `Failed to load most viewed products: ${error.message}`,
      operation: 'getMostViewedProducts'
    });
  }
};

const getPromotionProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 8);
    const items = await catalogService.getPromotionProducts(limit);
    return res.status(200).json({ items });
  } catch (error) {
    logControllerError('getPromotionProducts', error);
    return res.status(500).json({
      message: `Failed to load promotions: ${error.message}`,
      operation: 'getPromotionProducts'
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await catalogService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const related = await catalogService.getRelatedProducts(product.id, product.category?.id);
    return res.status(200).json({ product, related });
  } catch (error) {
    logControllerError('getProductDetail', error);
    return res.status(500).json({
      message: `Failed to load product: ${error.message}`,
      operation: 'getProductDetail'
    });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    const product = await productImageService.replaceProductImages({
      productId: req.params.id,
      files: req.files ?? [],
      req
    });

    return res.status(200).json({
      message: 'Product images updated successfully.',
      product
    });
  } catch (error) {
    logControllerError('uploadProductImages', error);
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to update product images.',
      operation: 'uploadProductImages'
    });
  }
};

module.exports = {
  getCategories,
  getProducts,
  getLatestProducts,
  getBestSellingProducts,
  getPromotionProducts,
  getProductDetail,
  uploadProductImages,
  getMostViewedProducts
};
