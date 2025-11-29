import { Link } from "react-router";
import { useUser } from "../provider/userProvider";
import AvaterPlaceholder from "./avatarPlaceholder";

function Navbar() {
  const { user, logout } = useUser();
  const logoutHandler = () => {
    logout();
  };
  return (
    <>
      <div className="navbar bg-base-100 shadow-lg px-10">
        <div className="flex-1 navbar-start">
          <Link className="btn btn-ghost text-xl" to={"/"}>
            Capstone
          </Link>
        </div>

        <div className="navbar-end flex gap-4">
          <Link to={"/products"}>
            <button className="btn btn-accent">Products</button>
          </Link>
          {user?.roles.includes("ADMIN") && (
            <Link to={"/admin"}>
              <button className="admin-button btn btn-primary">
                Admin Panel
              </button>
            </Link>
          )}
          {user != null ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="cursor-pointer">
                <AvaterPlaceholder name={user.userName} />
              </div>
              <ul
                tabIndex="-1"
                className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
              >
                <li>
                  <Link to={"/profile"}>profile</Link>
                </li>
                <li>
                  <div onClick={logoutHandler}>logout</div>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex-none">
              <Link to={"/auth/login"}>
                <button className="btn btn-primary">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
