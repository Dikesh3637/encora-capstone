export default function ProductCard({ product }) {
    const totalStock =
        product.variants?.reduce((acc, v) => acc + (v.stockQuantity || 0), 0) ||
        0;

    let stockStatus = { label: "In Stock", color: "text-success" };

    if (totalStock === 0) {
        stockStatus = { label: "Out of Stock", color: "text-error" };
    } else if (totalStock < 10) {
        stockStatus = { label: "Low Stock", color: "text-warning" };
    }

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer h-full flex flex-col">
            <figure className="relative h-64">
                <img
                    src={product.url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-xl"
                    loading="lazy"
                />

                {/* Category Badge */}
                <div className="badge badge-primary absolute top-3 left-3 shadow-sm">
                    {product.category?.name?.toUpperCase() || "GENERAL"}
                </div>

                {/* Gender Badge*/}
                <div className="badge badge-ghost badge-sm absolute top-3 right-3 bg-base-100/90 backdrop-blur-sm">
                    {product.gender}
                </div>
            </figure>

            <div className="card-body p-5 flex-grow">
                <div className="flex-grow">
                    <h2 className="card-title font-semibold text-lg mb-2">
                        {product.name}
                    </h2>

                    <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
                        {product.description}
                    </p>
                </div>

                {/* Price and Stock Row */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-base-200">
                    <span className="font-bold text-xl text-primary">
                        ₹{product.price}
                    </span>

                    {/* Dynamic Stock Label */}
                    <div
                        className={`flex items-center gap-1.5 text-xs font-medium ${stockStatus.color}`}
                    >
                        {/* Dot indicator */}
                        <span
                            className={`w-2 h-2 rounded-full bg-current opacity-75`}
                        ></span>
                        {stockStatus.label}
                    </div>
                </div>

                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-neutral btn-sm rounded-full w-full hover:btn-primary transition-colors disabled:bg-base-300 disabled:text-base-content/50"
                        disabled={totalStock === 0}
                    >
                        {totalStock === 0 ? "Notify Me" : "View Details"}
                    </button>
                </div>
            </div>
        </div>
    );
}
