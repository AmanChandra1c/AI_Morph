// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components";

export default function Login() {
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
        "http://localhost:8000/api/v1/login-user",
        user,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.status === 200) {
        navigate("/");
      } else {
        setUser({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setUser({ email: "", password: "" });
      alert(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/api/v1/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/");
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
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password with eye toggle */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg- text-white py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition`}
              >
                Login
              </button>
            </form>

            {/* Register redirect */}
            <p className="text-sm text-gray-600 text-center mt-4">
              Don’t have an account?{" "}
              <Link className="text-blue-500" to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
