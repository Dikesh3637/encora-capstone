import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminSearchProducts } from "../../query/adminSearchQuery";
import AdminProductCard from "../../components/adminProductCard";

const AdminProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productId, setProductId] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-search", searchTerm, productId],
    queryFn: () =>
      adminSearchProducts({
        query: searchTerm.trim(),
        productId: productId.trim() || undefined,
        page: 0,
        size: 12,
      }),
  });

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">🔍 Admin Product Search</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name/Description Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Search by Name</span>
            </label>
            <input
              type="text"
              placeholder="tshirt, cotton..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Product ID Search */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product ID</span>
            </label>
            <input
              type="number"
              placeholder="123"
              className="input input-bordered w-full"
              value={productId}
              min="1"
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onSelect={onProductSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductSearch;
