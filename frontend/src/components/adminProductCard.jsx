import { Link } from "react-router";

const AdminProductCard = ({ product, onSelect }) => {
  const totalStock =
    product.variants?.reduce(
      (sum, variant) => sum + variant.stockQuantity,
      0
    ) || 0;
  const hasStock = totalStock > 0;
  const lowStock = totalStock > 0 && totalStock < 5;

  // Admin stock status
  const stockStatus = {
    label: `${totalStock} in stock`,
    color: lowStock ? "text-warning" : hasStock ? "text-success" : "text-error",
  };

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer h-full flex flex-col hover:border-primary"
      onClick={() => onSelect?.(product)}
    >
      <figure className="relative h-64 overflow-hidden rounded-t-xl">
        <img
          src={product.imageUrl || product.url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => (e.target.style.display = "none")}
        />

        {/* Admin Badges */}
        <div className="badge badge-secondary absolute top-3 left-3 shadow-sm">
          ID: {product.id}
        </div>

        <div className="badge badge-primary absolute top-3 right-3 shadow-sm">
          {product.category?.name?.toUpperCase() || "GENERAL"}
        </div>

        <div className="badge badge-ghost badge-sm absolute bottom-3 right-3 bg-base-100/90 backdrop-blur-sm">
          {product.gender}
        </div>
      </figure>

      <div className="card-body p-5">
        <div className="">
          <h2 className="card-title font-semibold text-lg mb-2 line-clamp-1">
            {product.name}
          </h2>
          <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
            {product.description || "No description"}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-base-200">
          <span className="font-bold text-xl text-primary">
            ₹{product.price?.toLocaleString("en-IN") || "0"}
          </span>

          <div
            className={`flex items-center gap-1.5 text-sm font-semibold ${stockStatus.color}`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full bg-current ${
                lowStock ? "animate-pulse" : ""
              }`}
            ></span>
            {stockStatus.label}
          </div>
        </div>

        {/* Admin Action Buttons */}
        <div className="card-actions w-full flex justify-end mt-4 gap-2">
          <Link to={`/admin/update-product/${product.id}`}>
            <button className="btn btn-primary">Edit Product</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
