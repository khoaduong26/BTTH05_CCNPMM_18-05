const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const Product = require('../models/Product');
const {
  PRODUCT_IMAGE_SIZE,
  PRODUCT_IMAGE_QUALITY,
  PRODUCT_IMAGE_FORMAT
} = require('../config/sharpConfig');

const uploadDirectory = path.resolve(__dirname, '..', '..', 'uploads', 'products');

const ensureUploadDirectory = async () => {
  await fs.mkdir(uploadDirectory, { recursive: true });
};

const buildPublicUrl = (req, filename) => {
  return `${req.protocol}://${req.get('host')}/uploads/products/${filename}`;
};

const processSingleImage = async ({ buffer, outputPath }) => {
  const pipeline = sharp(buffer, { failOnError: true }).rotate();
  const metadata = await pipeline.metadata();

  if ((metadata.width ?? 0) < PRODUCT_IMAGE_SIZE || (metadata.height ?? 0) < PRODUCT_IMAGE_SIZE) {
    const error = new Error('Each product image must be at least 1200x1200 to avoid upscaling.');
    error.statusCode = 400;
    throw error;
  }

  await sharp(buffer, { failOnError: true })
    .rotate()
    .resize(PRODUCT_IMAGE_SIZE, PRODUCT_IMAGE_SIZE, {
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: true
    })
    .toFormat(PRODUCT_IMAGE_FORMAT, { quality: PRODUCT_IMAGE_QUALITY, effort: 4 })
    .toFile(outputPath);
};

const replaceProductImages = async ({ productId, files, req }) => {
  if (!Array.isArray(files) || files.length === 0) {
    const error = new Error('At least one image file is required.');
    error.statusCode = 400;
    throw error;
  }

  await ensureUploadDirectory();

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  const uploadedUrls = [];

  for (const [index, file] of files.entries()) {
    const fileName = `product-${productId}-${Date.now()}-${index + 1}.${PRODUCT_IMAGE_FORMAT}`;
    const outputPath = path.join(uploadDirectory, fileName);

    await processSingleImage({ buffer: file.buffer, outputPath });
    uploadedUrls.push(buildPublicUrl(req, fileName));
  }

  product.imageUrls = uploadedUrls;
  await product.save();

  const populatedProduct = await Product.findById(productId).populate('category');
  return populatedProduct ? populatedProduct.toJSON() : null;
};

module.exports = {
  replaceProductImages
};