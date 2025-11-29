import { useState } from "react";
import { passwordValidator } from "../utils/validators";

export default function EditPasswordPage(   ) {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!passwordValidator(password)) {
            setError("Password must contain 8+ chars, uppercase, lowercase, number & symbol.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        alert("Password changed successfully!");
    };

    return (
        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-6">Edit Password</h2>

            <div className="form-control w-full max-w-md">

                <label className="label">
                    <span className="label-text">New Password</span>
                </label>
                <input
                    type="password"
                    className="input input-bordered"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label className="label mt-4">
                    <span className="label-text">Confirm Password</span>
                </label>
                <input
                    type="password"
                    className="input input-bordered"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />

                {error && <p className="text-error mt-3">{error}</p>}

                <button className="btn btn-primary mt-6" onClick={handleSubmit}>
                    Save Changes
                </button>

                {/* Password rules */}
                <div className="mt-6 text-sm text-base-content/60">
                    <p>Password must include:</p>
                    <ul className="list-disc ml-6 mt-1">
                        <li>8+ characters</li>
                        <li>1 uppercase letter</li>
                        <li>1 lowercase letter</li>
                        <li>1 number</li>
                        <li>1 special symbol (@$!%*?&)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
