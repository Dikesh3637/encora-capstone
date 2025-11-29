import { Link } from "react-router";

export default function AccountPage() {
    return (
        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>

            <p className="text-base-content/70 mb-8">
                Manage your profile details and security settings.
            </p>

            <Link to="/profile/account/editpassword">
                <button className="btn btn-primary">Change Password</button>
            </Link>
        </div>
    );
}
