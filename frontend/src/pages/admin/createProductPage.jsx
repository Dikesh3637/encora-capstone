import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategoryList } from "../../query/getCategoryListQuery";
import { createProduct } from "../../query/createProductQuery";
import { toast } from "sonner";

const ProductCreatePage = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    description: "",
    gender: "",
    categoryId: "",
    price: "",
    sizes: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Product created!`);
      resetForm();
    },
    onError: (error) => {
      console.error(error.message);
      toast.error("Error creating product: " + error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (name.startsWith("size-")) {
      const size = name.replace("size-", "");
      setFormData((prev) => ({
        ...prev,
        sizes: { ...prev.sizes, [size]: parseInt(value) || 0 },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      image: null,
      name: "",
      description: "",
      gender: "",
      categoryId: "",
      price: "",
      sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    });
    setImagePreview(null); // Clear preview
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-start justify-center py-10">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Create Product</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Image</span>
              </label>

              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleInputChange}
                />

                {imagePreview && (
                  <div className="relative w-full h-64 bg-base-200 rounded-lg overflow-hidden border border-base-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: null }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

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
                  <option value="">Select gender</option>
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
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <select
                    name="categoryId"
                    className="select select-bordered w-full"
                    value={formData.categoryId}
                    onChange={handleInputChange}
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Price (₹)</span>
              </label>
              <input
                type="number"
                name="price"
                className="input input-bordered w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="divider mt-6 mb-2">Sizes & Stock</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <div className="form-control" key={size}>
                  <label className="label">
                    <span className="label-text font-bold">{size}</span>
                  </label>
                  <input
                    type="number"
                    name={`size-${size}`}
                    className="input input-bordered w-full"
                    placeholder="0"
                    min="0"
                    value={formData.sizes[size]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetForm}
                disabled={mutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  mutation.isPending || !formData.name || !formData.categoryId
                }
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;
