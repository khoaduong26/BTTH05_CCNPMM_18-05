import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const ProductCard = ({ product }) => {
  const images = Array.isArray(product?.imageUrls) ? product.imageUrls.filter(Boolean) : [];
  const hasMultipleImages = images.length > 1;
  const price = product?.price ?? 0;
  const discountPrice = product?.discountPrice ?? product?.discount?.value ? product?.discountPrice : null;

  return (
    <Link
      to={`/products/${product?._id || product?.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Sửa nền chỗ chứa ảnh thành màu mist (xanh cực nhạt) thay vì slate-100 */}
      <div className="relative aspect-square w-full overflow-hidden bg-mist">
        {images.length > 0 ? (
          hasMultipleImages ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              loop
              slidesPerView={1}
              className="h-full w-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={`${product?.id ?? 'product'}-${index}`} className="h-full w-full">
                  <img
                    src={image}
                    alt={product?.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src={images[0]}
              alt={product?.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-blue-300">Chưa có ảnh</div>
        )}
        
        {/* Đổi nhãn Sale sang màu primary (Xanh dương) thay vì màu cam */}
        {discountPrice && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md shadow-blue-500/30">
            Giảm giá
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 bg-surface">
        {/* Đổi chữ Category thành màu xanh dương primary */}
        <p className="text-xs uppercase tracking-[0.15em] text-primary font-semibold">
          {product?.category?.name || 'Danh mục'}
        </p>
        
        {/* Đổi tiêu đề thành màu ink (xám đen chuyên nghiệp) */}
        <h4 className="text-lg font-bold text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product?.name}
        </h4>
        
        <p className="text-sm text-inkLight line-clamp-2">{product?.description}</p>
        
        <div className="mt-auto flex items-center gap-3 pt-2">
          {/* Đổi màu giá tiền thành màu Xanh dương đậm */}
          <span className="text-lg font-extrabold text-primary">
            {formatCurrency(discountPrice || price)}
          </span>
          {discountPrice && (
            <span className="text-sm text-inkLight line-through">
              {formatCurrency(price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;