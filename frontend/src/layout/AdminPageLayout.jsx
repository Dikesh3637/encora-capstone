import { Outlet } from "react-router";

function AdminPageLayout() {
  return (
    <div className="flex-1 flex flex-col justify-start">
      <Outlet />
    </div>
  );
}

export default AdminPageLayout;
