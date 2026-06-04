// ProductCard.jsx
import Image from "next/image";
export default function ProductCard({ product }) {
  const { id, title, description, price, image, category, rating } = product;

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rate) ? "text-amber-400" : "text-gray-300"}>
        {i < Math.round(rate) ? "★" : "☆"}
      </span>
    ));
  };

  return (
    <div className="relative w-72 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Category Badge */}
      <span className="absolute top-3 left-3 z-10 text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
        {category}
      </span>

      {/* Image */}
      <div className="bg-gray-50 h-56 flex items-center justify-center px-6 pt-6 pb-4">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Body */}
      <div className="p-5 border-t border-gray-100">
        
        {/* SKU */}
        <p className="text-[11px] text-gray-400 mb-1">SKU #{String(id).padStart(3, "0")}</p>

        {/* Title */}
        <h2 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex text-sm">{renderStars(rating.rate)}</div>
            <span className="text-xs text-gray-400">
              {rating.rate}{" "}
              <span className="text-gray-300">({rating.count})</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-200">
            🛒 Add to cart
          </button>
          <button className="px-3 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-red-400 rounded-xl transition-colors duration-200">
            ♡
          </button>
        </div>
      </div>
    </div>
  );
}