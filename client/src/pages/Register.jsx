import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    const response = await axios.post("http://localhost:8000/api/v1/create-user", user,{
      withCredentials: true,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    
    if (response.status === 200) navigate("/");
  };
  useEffect(() =>{
      const token = localStorage.getItem("token");
      if(token){
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

  return (
    <>
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
              <label className="block text-gray-700 text-sm mb-1">Email</label>
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
            Already have an account? <Link className="text-blue-500" to="/login">login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
