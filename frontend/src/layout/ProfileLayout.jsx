import { Outlet, Link } from "react-router";

function ProfilePageLayout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex w-full flex-col items-center justify-center">
        <Outlet />
        <label htmlFor="my-drawer-3" className="btn drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <Link to="/profile/account">
            <button className="btn btn-ghost">Account</button>
          </Link>
          <div className="divider"></div>
          <Link to="/profile/order-history">
            <button className="btn btn-ghost">Order History</button>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default ProfilePageLayout;
