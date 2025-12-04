import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://project-management-sfrn.onrender.com/api/v1/login",
        form
      );

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("role", res.data.role);

      navigate("/projects");
    } catch (err) {
      setErrorMsg("Invalid Credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300  px-4">

      <div className="relative w-full max-w-sm  rounded-2xl bg-white  ">
        <div className=" p-8 rounded-2xl shadow-2xl ">

          <h2 className="text-4xl  text-center mb-8 text-blue-600 font-bold ">
            LOGIN
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="">
              <label className="">
                Email Address
              </label>
              <input
                className="w-full p-3 rounded-lg   border   focus:outline-none"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="">
              <label className="text-black ">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg  text-white border   focus:outline-none"
                  onChange={(e) =>
                    setForm({ ...form, [e.target.name]: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-200 cursor-pointer hover:text-white transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-red-400 text-sm font-semibold mt-1">
                {errorMsg}
              </p>
            )}

            {/* Forgot Password */}
            <a
              href="/ForgetPassword"
              className="block text-sm  hover:text-blue-300 hover:underline cursor-pointer transition"
            >
              Forgot Password?
            </a>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 mt-2 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
