import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

const loginUser = async () => {

    try {

        const res = await axios.post(
            "http://127.0.0.1:5000/login",
            formData
        );

        // Save logged-in user
        localStorage.setItem(
            "user",
            JSON.stringify(res.data)
        );

        alert(res.data.message);

        navigate("/dashboard");

    } catch(err) {

        alert(err.response?.data?.message || "Login Failed");

    }

}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white">
          <h1 className="text-5xl font-bold text-white leading-tight">
  DSVerse AI
</h1>

          <p className="mt-6 text-lg text-gray-200">
            Master Data Structures with interactive 3D visualizations, AI-powered tutoring, quizzes, and personalized learning.
          </p>

          <div className="mt-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              alt="Learning"
              className="w-72"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-10 md:p-14">
          <h2 className="text-4xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to continue learning.
          </p>

          <form
  className="mt-10"
  autoComplete="off"
  onSubmit={(e) => {
    e.preventDefault();
    loginUser();
  }}
>

            <div className="relative mb-6">
              <FaEnvelope className="absolute top-4 left-4 text-gray-400" />

              <input
  type="email"
  name="user_email"
  autoComplete="off"
  placeholder="Email Address"
  value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute top-4 left-4 text-gray-400" />

              <input
  type="password"
  name="user_password"
  autoComplete="new-password"
  placeholder="Password"
  value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="flex justify-between text-sm mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
  type="submit"
              onClick={loginUser}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
            >
              Login
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?

              <Link
                to="/register"
                className="text-blue-600 font-semibold ml-2 hover:underline"
              >
                Register
              </Link>
            </p>

         </form> 
        </div>
      </div>
    </div>
  );
}

export default Login;