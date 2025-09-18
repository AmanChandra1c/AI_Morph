import React, { useState } from "react";
import { download } from "../assets";
import { downloadImage } from "../utils";

const ImageView = ({ isOpen, onClose, post }) => {

    const [hovered, setHovered] = useState(false);

    if (!isOpen || !post) {
    return null;
  }

  return (
    // Main overlay with a smooth fade-in transition
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-zoom-out transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal container with a pop-in animation. 
        A dark, semi-transparent, blurred background gives it a modern look.
        onClick is stopped from propagating to the overlay, so clicking the modal doesn't close it.
      */}
      <div
        className="bg-white-0 backdrop-blur-lg w-full max-w-3xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden cursor-auto transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: "scale(0.95)" }} // Initial state for animation
        // A simple trick for the entry animation on mount
        ref={(el) =>
          el && requestAnimationFrame(() => (el.style.transform = "scale(1)"))
        }
      >
        {/* Close Button: Styled with an SVG icon for a cleaner look */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 rounded-full w-9 h-9 flex items-center justify-center z-20 transition-colors duration-200"
          aria-label="Close image view"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container: Centers the image and allows it to take up available space */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0 relative"
        >
          <img
            src={post.photo}
            width={650}
            alt={post.prompt || "Generated image"}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition duration-300 ${
              hovered ? "blur-sm brightness-75" : ""
            }`}
          />
        </div>
        {hovered && (
          <button
            onMouseEnter={() => setHovered(true)}
            type="button"
            onClick={() =>
              downloadImage(
                post._id ? post._id : "AI_Morph" + post.prompt,
                post.photo
              )
            }
            className="outline-none bg-transparent border-none absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] shadow-md transition duration-300 "
          >
            <img
              src={download}
              alt="download"
              className="w-10 h-10 object-contain invert"
            />
          </button>
        )}

        {/* Prompt/Details Section: Displays the prompt text below the image */}
        {post.prompt && (
          <div className="flex-shrink-0  max-sm:flex items-center justify-between p-4 text-center bg-black/30">
            <p className="text-gray-200 text-sm md:text-base">{post.prompt}</p>
            <button
              type="button"
              onClick={() =>
                downloadImage(
                  post._id ? post._id : "AI_Morph" + post.prompt,
                  post.photo
                )
              }
              className="outline-none md:hidden bg-transparent border-none shadow-md transition duration-300 "
            >
              <img
                src={download}
                alt="download"
                className="w-6 h-6 object-contain invert"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageView;