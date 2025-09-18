import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, ImageView, Loader } from '../components';
import { isTokenValid } from '../utils/validator';

const CreatePost = () => {
  
  const user = JSON.parse(localStorage.getItem("user"));  
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: user.firstName,
    prompt: '',
    photo: '',
    admin: '',
  });

  
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiKey = import.meta.env.HF_API_KEY;
  const cloudApiKey = import.meta.env.CLOUD_API_KEY;

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);

        const response = await fetch(
          "http://localhost:8000/api/v1/imgGenerate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: form.prompt,
            }),
          }
        );
        const data = await response.json();
        setForm({ ...form, photo: data.photo, admin: user._id});
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please Provide a prompt")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8000/api/v1/post", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cloudApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        await response.json();
        navigate("/");
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token || isTokenValid()) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  useEffect(() => {
    checkToken();
  }, [navigate]);

  const handleClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

   const handleClickModel = () => {
     setIsModalOpen(false);
     selectedPost(null);
   };

  return (
    <section className="max-w-7xl mx-auto">
      <div className="justify-center text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">
          Create{" "}
          <mark class="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">
            AI
          </mark>{" "}
          Images
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          Unleash the power of our AI model from Hugging Face to turn your
          wildest ideas into stunning visual creations. Share your imagination
          with the community and bring your dreams to life!
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            name="name"
            value={user.firstName}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A Bollywood dance party with dancers in vibrant traditional attire...."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gradient-to-b from-[#E2E8F0] to-[#F0F4F8] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
            {form.photo ? (
              <img
                onClick={() => {
                  handleClick(form), setIsModalOpen(true),
                  console.log(form);
                  
                }}
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40 rounded-lg">
                <img
                  src={preview}
                  alt="preview"
                  className="w-9/12 h-9/12 object-contain"
                />
              </div>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={() => {
              generateImage();
              checkToken();
            }}
            className={`text-white bg-gradient-to-r from-[#4CAF50] to-[#45A249] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center focus:outline-none transition-all duration-300 ${
              generatingImg
                ? "cursor-not-allowed opacity-70"
                : "hover:opacity-90"
            }`}
            disabled={generatingImg}
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            <strong>Ready to showcase your creation?</strong> Share your
            imaginative image with the community!
          </p>
          <button
            type="submit"
            onClick={checkToken}
            className={`mt-4 text-white bg-gradient-to-r from-[#3B82F6] to-[#2563EB] font-medium rounded-md text-sm w-full sm:w-auto px-6 py-3 focus:outline-none transition-all duration-300 hover:opacity-90 transform hover:scale-105`}
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
      <ImageView isOpen={isModalOpen} onClose={handleClickModel } post={selectedPost} />
    </section>
  );
};

export default CreatePost;