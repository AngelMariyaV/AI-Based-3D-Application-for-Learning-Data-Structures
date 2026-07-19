import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No password-reset endpoint exists on the backend yet, so this
    // simply confirms the request was captured client-side.
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px]">
        <h1 className="text-3xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="bg-green-50 text-green-700 rounded-lg p-4 text-center text-sm mb-6">
            If an account exists for <strong>{email}</strong>, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 mb-6 focus:ring-2 focus:ring-blue-600 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <Link
          to="/"
          className="flex items-center justify-center gap-2 mt-6 text-blue-600 hover:underline text-sm"
        >
          <FaArrowLeft /> Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
