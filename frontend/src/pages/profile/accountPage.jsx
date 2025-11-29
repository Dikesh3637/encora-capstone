import { useUser } from "../../provider/userProvider";
import { Link } from "react-router";

function AccountPage() {
  const { user, logout } = useUser();

  // Safety check to prevent rendering if user is null
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-base-content/70">
          Manage your profile and security settings
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Placeholder */}
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-24">
              <span className="text-3xl font-bold">
                {user.userName?.substring(0, 2).toUpperCase() || "U"}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-grow text-center md:text-left space-y-2">
            <h2 className="card-title text-2xl justify-center md:justify-start">
              {user.userName}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-base-content/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <span>{user.email}</span>
            </div>
            <div className="badge badge-success badge-outline mt-2">
              {user.roles?.includes("ADMIN") ? "Administrator" : "User"}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Actions Card */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">Security & Session</h3>
          <div className="divider my-1"></div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link to="/profile/account/change-password">
              <button className="btn btn-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Change Password
              </button>
            </Link>

            <button className="btn btn-error btn-outline" onClick={logout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
