// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { useToast } from "@/components/ui/toaster";

export default function Login() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://ai-morph-ju7z.onrender.com/api/v1/login-user",
        user,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.status === 200) {
        navigate("/home");
        toastSuccess("Login successful");
      }
      else {
        toastError("");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toastError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://ai-morph-ju7z.onrender.com/api/v1/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/home");
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Loader />
        </div>
      ) : (
        <div className="flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password with eye toggle */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-500/50 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20"
                } transition`}
              >
                Login
              </button>
            </form>

            {/* Register redirect */}
            <p className="text-sm text-gray-300 text-center mt-4">
              Don’t have an account?{" "}
              <Link className="text-cyan-400" to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
