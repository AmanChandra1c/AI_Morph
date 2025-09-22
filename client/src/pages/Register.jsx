import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Register = () => {
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
      alert("First name is required!");
      return;
    }else{
      user.firstName =
        user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    }
    if (!user.email.trim()) {
      alert("Email is required!");
      return;
    }
    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    if (user.otp.length < 6) {
      alert("Please enter a valid OTP!");
      return;
    }


    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/create-user",
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

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.status === 200) navigate("/");
    } catch (error) {
      console.error("Register failed:", error);
      alert(error.response?.data?.message || "Something went wrong!");
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
          navigate("/"); // redirect after success
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          localStorage.removeItem("token"); // clear bad token
        });
    }
  }, [navigate]);

  const sendOTP = async () => {    
    if (user.email.length < 5 ) { 
      alert("Please enter your email!");
      return;
    };
    try {
      const res = await axios.get("http://localhost:8000/api/v1/send-otp", {
        params: { email: user.email },
      });
      setSessionID(res?.data?.sessionID);
    } catch (error) {
      console.error("invalid OTP:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setCount(1);
      alert("OTP sent to your email!");
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
          <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Create an Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter last name"
                />
              </div>

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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
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
                    className={`block text-gray-700 ${
                      count <= 0 ? "hidden" : ""
                    } text-sm mb-1`}
                  >
                    Enter OTP
                  </span>
                  <span
                    className="text-blue-500 cursor-pointer underline"
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
                className={`w-full bg- text-white py-2 rounded-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } transition`}
              >
                Register
              </button>
            </form>

            {/* Already have an account */}
            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Link className="text-blue-500" to="/login">
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
