const Product = require('../models/Product');
const Category = require('../models/Category');
const Discount = require('../models/Discount');
const mongoose = require('mongoose');

const normalizeNumber = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildSearchFilter = ({ search }) => {
  if (!search) {
    return {};
  }
  const regex = new RegExp(search, 'i');
  return {
    $or: [{ name: regex }, { description: regex }]
  };
};

const buildProductFilters = ({
  categoryId,
  minPrice,
  maxPrice,
  discounted,
  bestSelling,
  newest,
  inStock
}) => {
  const filters = {
    isActive: true
  };

  if (categoryId) {
    filters.category = categoryId;
  }

  if (inStock === true) {
    filters.stockQuantity = { $gt: 0 };
  }

  if (discounted === true) {
    filters.discountPrice = { $ne: null };
  }

  if (minPrice !== null || maxPrice !== null) {
    filters.price = {};
    if (minPrice !== null) {
      filters.price.$gte = minPrice;
    }
    if (maxPrice !== null) {
      filters.price.$lte = maxPrice;
    }
  }

  return filters;
};

const buildSort = ({ sort }) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'newest':
      return { createdAt: -1 };
    case 'best_selling':
      return { soldQuantity: -1 };
    default:
      return { createdAt: -1 };
  }
};

const getCategories = async () => {
  return Category.find({ isActive: true }).sort({ name: 1 });
};

const getProducts = async (query) => {
  const page = Math.max(normalizeNumber(query.page, 1), 1);
  const limit = Math.min(Math.max(normalizeNumber(query.limit, 12), 1), 60);
  const search = query.search?.trim();
  const categoryId = query.categoryId?.trim();
  const minPrice = normalizeNumber(query.minPrice, null);
  const maxPrice = normalizeNumber(query.maxPrice, null);
  const discounted = query.discounted === 'true';
  const bestSelling = query.bestSelling === 'true';
  const newest = query.newest === 'true';
  const inStock = query.inStock === 'true';

  const filters = buildProductFilters({
    categoryId,
    minPrice,
    maxPrice,
    discounted,
    bestSelling,
    newest,
    inStock
  });

  const searchFilter = buildSearchFilter({ search });

  const combinedFilter = {
    ...filters,
    ...searchFilter
  };

  const sort = buildSort({ sort: query.sort });

  const [items, total] = await Promise.all([
    Product.find(combinedFilter)
      .populate('category')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(combinedFilter)
  ]);
  return {
    items: items.map((item) => item.toJSON()),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getLatestProducts = async (limit = 8) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ createdAt: -1 })
    .limit(limit);
  return items.map((item) => item.toJSON());
};

const getBestSellingProducts = async (limit = 10) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ soldQuantity: -1, createdAt: -1 })
    .limit(limit);
  return items.map((item) => item.toJSON());
};

const getMostViewedProducts = async (limit = 10) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ viewCount: -1, createdAt: -1 }) 
    .limit(limit);
  return items.map((item) => item.toJSON());
};


const getPromotionProducts = async (limit = 8) => {
  const now = new Date();

  const discounts = await Discount.find({
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  })
    .populate({
      path: 'product',
      populate: { path: 'category' }
    })
    .limit(limit);

  const products = discounts
    .map((discount) => ({
      ...discount.product?.toJSON(),
      discount: discount.toJSON()
    }))
    .filter((item) => item.id);

  return products;
};

const getProductById = async (idOrSlug) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
  
  // Dùng findOneAndUpdate để cộng view an toàn. (ĐÃ XÓA LỆNH SAVE CŨ BÊN DƯỚI)
  const product = await Product.findOneAndUpdate(
    query,
    { $inc: { viewCount: 1 } },
    { new: true } 
  ).populate('category');
  
  if (!product) {
    return null;
  }

  const now = new Date();
  const discount = await Discount.findOne({
    product: product._id, 
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  });

  return {
    ...product.toJSON(),
    discount: discount ? discount.toJSON() : null
  };
};

const getRelatedProducts = async (productId, categoryId, limit = 6) => {
  const items = await Product.find({
    _id: { $ne: productId },
    category: categoryId,
    isActive: true
  })
    .populate('category')
    .sort({ soldQuantity: -1, createdAt: -1 })
    .limit(limit);

  return items.map((item) => item.toJSON());
};

module.exports = {
  getCategories,
  getProducts,
  getLatestProducts,
  getBestSellingProducts,
  getPromotionProducts,
  getProductById,
  getRelatedProducts,
  getMostViewedProducts
};