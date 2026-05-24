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

const getBestSellingProducts = async (limit = 8) => {
  const items = await Product.find({ isActive: true })
    .populate('category')
    .sort({ soldQuantity: -1, createdAt: -1 })
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
  // LOG 1: Xem Frontend đang gửi chuỗi gì lên
  console.log('====== DEBUG GET PRODUCT ======');
  console.log('>>> Tham số nhận vào idOrSlug:', idOrSlug);

  const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
  const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
  
  // LOG 2: Xem câu lệnh tìm kiếm thực tế là gì
  console.log('>>> Câu lệnh Query tạo ra:', query);

  const product = await Product.findOne(query).populate('category');
  
  if (!product) {
    // LOG 3: Nếu không tìm thấy bản ghi nào trong DB
    console.log('>>> KẾT QUẢ: Không tìm thấy sản phẩm nào trong Database!');
    console.log('================================');
    return null;
  }

  console.log('>>> KẾT QUẢ: Tìm thấy sản phẩm:', product.name);
  console.log('================================');

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
  getRelatedProducts
};
