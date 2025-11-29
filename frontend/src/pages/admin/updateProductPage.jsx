import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchProductById } from "../../query/getProductById";
import { updateProduct } from "../../query/updateProductQuery";
import { fetchCategoryList } from "../../query/getCategoryListQuery"; // Import this

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    gender: "MEN",
    categoryId: "",
  });

  const [stockMap, setStockMap] = useState(
    SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // 1. Fetch Categories (for Dropdown)
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });

  // 2. Fetch Product Data
  const {
    data: product,
    isLoading: isProductLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  // 3. Pre-fill Form
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        gender: product.gender || "MEN",
        categoryId: product.category?.id || "",
      });

      setImagePreview(product.url || "");

      // Pre-fill Stock Map
      const newStock = SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {});
      if (product.variants) {
        product.variants.forEach((v) => {
          if (SIZES.includes(v.size)) {
            newStock[v.size] = v.stockQuantity;
          }
        });
      }
      setStockMap(newStock);
    }
  }, [product]);

  // Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries(["product", id]);
      queryClient.invalidateQueries(["products"]);
      navigate("/admin/update-product"); // Or navigate(-1) to go back
    },
    onError: (err) => {
      console.error(err);
      toast.error("Update failed: " + (err.response?.data || err.message));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const productDto = {
      ...formData,
      sizes: stockMap,
    };

    const data = new FormData();
    data.append(
      "product",
      new Blob([JSON.stringify(productDto)], { type: "application/json" })
    );

    if (imageFile) {
      data.append("image", imageFile);
    }

    mutation.mutate({ id, formData: data });
  };

  if (isProductLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-center text-error font-bold">
        Error loading product details.
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 flex items-start justify-center py-10">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Update Product</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative w-full h-64 bg-base-200 rounded-lg overflow-hidden border border-base-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    {/* Optional: Clear Image Button */}
                    <button
                      type="button"
                      className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
                      onClick={() => {
                        // Don't clear if it's the original image unless you logic supports deleting images
                        // For now, just revert to original logic or clear preview if it's a new file
                        if (imageFile) {
                          setImageFile(null);
                          setImagePreview(product?.url || ""); // Revert to server image
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Gender & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  name="gender"
                  className="select select-bordered w-full"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                {isCategoriesLoading ? (
                  <div className="flex items-center justify-center h-12">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : (
                  <select
                    name="categoryId"
                    className="select select-bordered w-full"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price (₹)</span>
              </label>
              <input
                type="number"
                name="price"
                className="input input-bordered w-full"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Sizes & Stock Grid */}
            <div className="divider mt-6 mb-2">Sizes & Stock</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIZES.map((size) => (
                <div className="form-control" key={size}>
                  <label className="label">
                    <span className="label-text font-bold">{size}</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="0"
                    min="0"
                    value={stockMap[size]}
                    onChange={(e) =>
                      setStockMap({
                        ...stockMap,
                        [size]: parseInt(e.target.value) || 0,
                      })
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
                disabled={mutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdatePage;
