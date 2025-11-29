import { Link } from "react-router";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl p-6">
        <Link to="/admin/create-product">
          <button
            className="btn btn-primary btn-lg h-40 w-full text-2xl font-bold gap-3"
            onClick={() => console.log("Create Product")}
          >
            <span className="text-4xl">＋</span>
            <span>Create Product</span>
          </button>
        </Link>
        <Link to={"/admin/create-category"}>
          <button
            className="btn btn-accent btn-lg h-40 w-full text-2xl font-bold gap-3"
            onClick={() => console.log("Create Category")}
          >
            <span className="text-3xl">📂</span>
            <span>Create Category</span>
          </button>
        </Link>
        <Link to="/admin/update-product">
          <button
            className="btn btn-secondary btn-lg h-40 w-full text-2xl font-bold gap-3"
            onClick={() => console.log("Update Product")}
          >
            <span className="text-3xl">✏</span>
            <span>Update Product</span>
          </button>
        </Link>
        <Link to="/admin/delete-product">
          <button
            className="btn btn-error btn-lg h-40 w-full text-2xl font-bold gap-3"
            onClick={() => console.log("Delete Product")}
          >
            <span className="text-3xl">🗑</span>
            <span>Delete Product</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
