import React, { useState, useEffect } from "react";
import { Card, FormField, ImageView, Loader } from "../components";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "../utils/validator";
import { useToast } from "@/components/ui/toaster";

const RenderCards = ({ data, title, onCardClick }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <div
        className="rounded-xl group relative shadow-card hover:shadow-cardhover cursor-pointer card"
        key={post._id}
        onClick={() => onCardClick(post)}
      >
        <Card {...post} />
      </div>
    ));
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { error } = useToast();

  useEffect(() => {
    checkToken();
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://ai-morph-ju7z.onrender.com/api/v1/post",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        error(String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleClick = (post) => {
    checkToken();
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleClickModel = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (!token || isTokenValid()) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div className="justify-center text-center">
        <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl font-extrabold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
            Text-to-Image
          </span>{" "}
          AI Generator
        </h1>
        <p className="text-lg font-normal text-gray-300 lg:text-xl">
          Dive into a world of imagination with our Text-to-Image Generator.
          Explore captivating visuals crafted effortlessly. Click "Create" to
          unleash your creativity!
        </p>
      </div>

      <div className="mt-14">
        <FormField
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
          className="rounded-full border border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-xl mb-3 text-gray-300 ">
                Showing results for{" "}
                <span className="text-white">{searchText}</span>{" "}
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search Results Found"
                  onCardClick={handleClick}
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No Posts Yet"
                  onCardClick={handleClick}
                />
              )}
            </div>
          </>
        )}
      </div>

      <ImageView
        isOpen={isModalOpen}
        onClose={handleClickModel}
        post={selectedPost}
      />
    </section>
  );
};

export default Home;
