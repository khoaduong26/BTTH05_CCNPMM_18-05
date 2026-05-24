const multer = require('multer');
const { PRODUCT_IMAGE_MAX_FILES, PRODUCT_IMAGE_MAX_FILE_SIZE } = require('../config/sharpConfig');

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed.'));
  }

  return cb(null, true);
};

const productImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: PRODUCT_IMAGE_MAX_FILES,
    fileSize: PRODUCT_IMAGE_MAX_FILE_SIZE
  }
});

module.exports = productImageUpload;