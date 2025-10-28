import React, { useEffect, useState } from "react";
import { Mail, Calendar, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isTokenValid } from "../utils/validator";
import { Card, ImageView, Loader } from "../components";
import { useToast } from "@/components/ui/toaster";
import { Buffer } from "buffer";

const Profile = () => {
  const { error, success, info } = useToast();
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || isTokenValid) {
      axios
        .get("http://localhost:8000/api/v1/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Invalid token:", err);
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (!user?._id) return;

    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-post/",
          { params: { id: user._id } }
        );

        setAllPosts(response.data?.reverse() || []);
      } catch (error) {
        error(String(error));
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  const handleClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleClickModel = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImage(null);
    setFirstName(user?.firstName);
    setLastName(user?.lastName);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      info("Profile image selected. Remember to Save changes.");
    }
  };

  const handleNameChange = (field, value) => {
    // Capitalize first letter of each word
    const capitalizeFirstLetter = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (field === "firstName") {
      setFirstName(capitalizeFirstLetter(value));
    } else {
      setLastName(capitalizeFirstLetter(value));
    }
  };

  const handleSave = async () => {
    try {
      // Validate first name (required)
      if (!firstName || firstName.trim() === "") {
        error("First name is required and cannot be empty");
        return;
      }

      // Password validation before sending request
      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          error("New passwords don't match");
          return;
        }

        if (passwordData.newPassword.length < 6) {
          error("Password must be at least 6 characters long");
          return;
        }
      }

      // Create FormData for single API call
      const formData = new FormData();
      formData.append("id", user._id);

      // Always send name data (current or updated)
      if (firstName !== user.firstName) {
        formData.append("firstName", firstName.trim());
      } else {
        formData.append("firstName", user.firstName);
      }
      formData.append("lastName", lastName.trim());

      // Add profile picture if selected
      if (image) {
        formData.append("profilePicture", image);
      }

      // Add password data if provided
      if (passwordData.currentPassword && passwordData.newPassword) {
        formData.append("password", passwordData.newPassword);
        formData.append("oldPassword", passwordData.currentPassword);
      }

      // Detect what is changing for granular toasts
      const isNameChanged =
        firstName.trim() !== (user?.firstName || "") ||
        (lastName || "").trim() !== (user?.lastName || "");
      const isImageChanged = Boolean(image);

      // Make API call
      const response = await axios.post(
        "http://localhost:8000/api/v1/profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      if (isNameChanged && isImageChanged) {
        success("Name and profile image updated successfully!");
      } else if (isNameChanged) {
        success("Name updated successfully!");
      } else if (isImageChanged) {
        success("Profile image updated successfully!");
      } else {
        success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsEditing(false);
      setImage(null);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      error("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/v1/change-password",
        {
          id: user._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        success("Password updated successfully!");
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      error(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    }
  };

  const handleEditPassword = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="rounded-3xl p-6 lg:p-8 mb-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 relative">
              {/* Profile Photo */}
              <div className={`group ${isEditing ? "relative" : ""}`}>
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-black/20 ring-1 ring-white/10 shadow-lg">
                  <img
                    src={
                      user?.profilePicture
                        ? user?.profilePicture
                        : "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                    }
                    width={100}
                    height={100}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Edit Button - Show when not editing */}
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                )}

                {/* File Input - Show when editing */}
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profile-image-input"
                    />
                    <label
                      htmlFor="profile-image-input"
                      className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 shadow-lg cursor-pointer transition-colors duration-200 ring-1 ring-white/10"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    </label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left w-full">
                {/* Editable Name Section */}
                {isEditing ? (
                  <div className="mb-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) =>
                          handleNameChange("firstName", e.target.value)
                        }
                        placeholder="First Name"
                        required
                        className="text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500/50 focus:border-white/20 outline-none transition-all duration-200 flex-1 invalid:border-red-500"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) =>
                          handleNameChange("lastName", e.target.value)
                        }
                        placeholder="Last Name (Optional)"
                        className="text-lg font-semibold text-white bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500/50 focus:border-white/20 outline-none transition-all duration-200 flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <h1 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                    {user?.firstName} {user?.lastName}
                  </h1>
                )}

                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-300 mb-4">
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                  <span className="text-sm lg:text-lg break-all">
                    {user?.email}
                  </span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">
                      {user?.createdAt ? user.createdAt.split("T")[0] : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Password Fields - Show when editing */}
                {isEditing && (
                  <div className="mb-6">
                    <div className="rounded-xl p-4 border border-white/10 bg-white/5">
                      <h3 className="text-md font-medium text-gray-200 mb-4 text-center lg:text-left">
                        Change Password (Optional)
                      </h3>
                      <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Current Password"
                          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="New Password"
                            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                          />
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Confirm Password"
                            className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 max-w-md mx-auto lg:mx-0">
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium shadow-lg shadow-cyan-500/20"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto bg-white/10 hover:bg_white/15 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-medium ring-1 ring-white/10"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="rounded-3xl p-6 lg:p-8 border border-white/10 bg_white/5 backdrop-blur-md shadow-xl">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              My Images
            </h2>
            <div className="">
              {allPosts?.length > 0 ? (
                <div
                  className={`grid ${
                    loading
                      ? "grid-cols-1"
                      : "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center ">
                      <Loader />
                    </div>
                  ) : (
                    allPosts.map((post) => (
                      <div
                        className="rounded-xl group relative shadow-card hover:shadow-cardhover cursor-pointer card"
                        key={post._id}
                        onClick={() => handleClick(post)}
                      >
                        <Card {...post} />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-md font-semibold text-gray-300 text-center py-8">
                  Images Are Not Generated Yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ImageView
        isOpen={isModalOpen}
        onClose={handleClickModel}
        post={selectedPost}
      />
    </div>
  );
};

export default Profile;
