import React, { useEffect, useState } from "react";
import { Mail, Calendar, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isTokenValid } from "../utils/validator";
import { Card, ImageView, Loader } from "../components";
import { Buffer } from "buffer";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);

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

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-post/",
          { params: { id: user._id } }
        );

        setAllPosts(response.data?.reverse() || []);
      } catch (error) {
        alert(error);
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
  };

  const handleImageChange = (e) => {    
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }    
  };
  
  const handleSave = async () => {
  if (!image) {
    alert("Please select an image to upload");
    return;
  }
  try {
    const formData = new FormData();
    formData.append('profilePicture', image); 
    formData.append('id', user._id);
        
    const response = await axios.post(
      "http://localhost:8000/api/v1/profile-picture/",
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    if (response.data.success) {
      const updatedUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);      
      alert("Profile picture updated successfully!");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Failed to update profile picture. Please try again.");
  } finally {
    setIsEditing(false);
    setImage(null);
  };
};

  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
                  <img
                    src={
                      user?.profilePicture
                        ? user?.profilePicture
                        :"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
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
                    className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
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
                      For="profile-image-input"
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-2 shadow-lg cursor-pointer transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </label>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {user?.firstName + " " + user?.lastName}
                </h1>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-4">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">{user?.email}</span>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {user?.createdAt ? user.createdAt.split("T")[0] : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Save and Cancel buttons - Show when editing */}
                {isEditing && (
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
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
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              My Images
            </h2>
            <div className="">
              {!loading ? (
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                  {allPosts ? (
                    allPosts?.map((post) => {
                      return (
                        <div
                          className="rounded-xl group relative shadow-card hover:shadow-cardhover cursor-pointer card"
                          key={post._id}
                          onClick={() => handleClick(post)}
                        >
                          <Card {...post} />
                        </div>
                      );
                    })
                  ) : (
                    <Loader />
                  )}
                </div>
              ) : (
                <div className="text-md text-bold">
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
