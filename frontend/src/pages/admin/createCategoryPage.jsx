import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../../query/createCategoryQuery";
import { toast } from "sonner";

const CategoryCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`Category created! ID: ${data.categoryId}`);
      resetForm();
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="bg-base-200 flex items-center justify-center py-10 flex-1">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl ">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create Category</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="Enter category name (e.g. T-Shirts)"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full"
                rows={4}
                placeholder="Optional description..."
                value={formData.description}
                onChange={handleInputChange}
              />
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
                disabled={mutation.isPending || !formData.name.trim()}
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreatePage;
