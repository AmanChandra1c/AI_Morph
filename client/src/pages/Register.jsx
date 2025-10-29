import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { useToast } from "@/components/ui/toaster";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Register = () => {
  const { error, success, info } = useToast();
  const API_BASE = "https://ai-morph-server.onrender.com";
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
  });
  const [sessionID, setSessionID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.firstName.trim()) {
      error("First name is required!");
      return;
    } else {
      user.firstName =
        user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    }

    if (!user.email.trim()) {
      error("Email is required!");
      return;
    }

    if (user.password.length < 6) {
      error("Password must be at least 6 characters long!");
      return;
    }

    if (user.otp.length < 6) {
      error("Please enter a valid OTP!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/api/v1/create-user`,
        {
          ...user,
          firstName: user.firstName.trim(),
          lastName: user.lastName.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Session-ID": sessionID,
          },
          withCredentials: true,
        }
      );

      // ✅ Handle success codes
      if (response.status === 200) {
        success("Registration successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/home");
      } else if (response.status === 201) {
        success("User created successfully!");
      } else if (response.status === 204) {
        success("Request processed successfully (no content).");
      }
    } catch (err) {
      console.error("Register failed:", err);
      const status = err.response?.status;
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong!";

      // ✅ Status-specific toast messages
      switch (status) {
        case 400:
          if (String(msg).toLowerCase().includes("otp")) {
            error("❌ Incorrect OTP. Please try again.");
          } else {
            error("⚠️ Bad Request: " + msg);
          }
          break;
        case 401:
          error("🔒 Unauthorized. Please log in again.");
          break;
        case 403:
          error("🚫 Forbidden. You don't have permission for this action.");
          break;
        case 404:
          error("❓ Resource not found.");
          break;
        case 409:
          error("⚠️ User already exists. Please log in instead.");
          break;
        case 500:
          error("💥 Internal Server Error. Try again later.");
          break;
        case 502:
          error("⚡ Bad Gateway. Server issue detected.");
          break;
        case 503:
          error("🕓 Service Unavailable. Please try later.");
          break;
        case 504:
          error("⏱️ Gateway Timeout. The server took too long to respond.");
          break;
        default:
          error("⚠️ " + msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_BASE}/api/v1/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/home"); // redirect after success
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          localStorage.removeItem("token"); // clear bad token
        });
    }
  }, [navigate]);

  const sendOTP = async () => {
    if (user.email.length < 5) {
      error("Please enter your email!");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/v1/send-otp`, {
        params: { email: user.email },
      });
      setSessionID(res?.data?.sessionID);
      setCount(1);
      info("OTP sent to your email!");
    } catch (e) {
      console.error("invalid OTP:", e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        "Failed to send OTP";
      const status = e.response?.status;
      if (status === 409) {
        error("User already exists");
      } else {
        error(msg);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Loader />
        </div>
      ) : (
        <div className="flex items-center justify-center ">
          <div className="w-full max-w-md rounded-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-md ring-1 ring-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                  placeholder="Enter last name"
                />
              </div>

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
                  placeholder="Enter email"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div>
                <div
                  className={`flex items-center ${
                    count <= 0 ? "justify-end" : "justify-between"
                  } mb-2`}
                >
                  <span
                    className={`block text-gray-300 ${
                      count <= 0 ? "hidden" : ""
                    } text-sm mb-1`}
                  >
                    Enter OTP
                  </span>
                  <span
                    className="text-cyan-400 cursor-pointer underline"
                    onClick={sendOTP}
                  >
                    Send OTP
                  </span>
                </div>
                <div className={count <= 0 ? "hidden" : ""}>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    name="otp"
                    value={user.otp}
                    onChange={(value) => setUser({ ...user, otp: value })}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-500/50 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"
                } transition`}
              >
                Register
              </button>
            </form>

            {/* Already have an account */}
            <p className="text-sm text-gray-300 text-center mt-4">
              Already have an account?{" "}
              <Link className="text-cyan-400" to="/login">
                login
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
