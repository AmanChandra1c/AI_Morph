import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Image, Type, LogIn, UserPlus } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/api/v1/get-user", {
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
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#0f1020] via-[#12142a] to-[#0b0d1a] py-12 md:py-16 lg:py-20">
      {/* Aurora background - responsive sizing */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 sm:-top-32 sm:-left-32 w-64 h-64 sm:w-96 sm:h-96 lg:w-[36rem] lg:h-[36rem] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_60%)] blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 sm:-bottom-32 sm:-right-32 w-72 h-72 sm:w-[32rem] sm:h-[32rem] lg:w-[40rem] lg:h-[40rem] bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.25),transparent_60%)] blur-3xl"></div>
      </div>

      {/* Hero */}
      <div className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm bg-white/5 ring-1 ring-white/10 mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
            <span className="whitespace-nowrap">
              New: Faster, sharper generations
            </span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight px-2">
            Imagine it.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
              We create it.
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-6 text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto px-4">
            Turn words into breathtaking visuals. Design with precision, style
            with AI, and build your creative universe in seconds.
          </p>
        </motion.div>

        {/* Primary CTAs - responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
        >
          <Link to="/login" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm sm:text-base">
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In
            </Button>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm sm:text-base">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Sign Up
            </Button>
          </Link>
          <Link to="/create-post" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-sm sm:text-base">
              <Image className="w-4 h-4 sm:w-5 sm:h-5" /> Start Creating
            </Button>
          </Link>
        </motion.div>

        {/* Feature buttons - responsive grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <Link to="/home" className="w-full">
            <Button className="w-full justify-center bg-white/5 hover:bg-white/10 text-gray-200 ring-1 ring-white/10 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2 text-sm sm:text-base transition-all duration-300 hover:ring-cyan-300/30">
              <Image className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
              <span>Explore Gallery</span>
            </Button>
          </Link>
          <Link to="/create-post" className="w-full">
            <Button className="w-full justify-center bg-white/5 hover:bg-white/10 text-gray-200 ring-1 ring-white/10 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2 text-sm sm:text-base transition-all duration-300 hover:ring-indigo-300/30">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
              <span>Text → Image</span>
            </Button>
          </Link>
          <Link to="/prompt-generator" className="w-full">
            <Button className="w-full justify-center bg-white/5 hover:bg-white/10 text-gray-200 ring-1 ring-white/10 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2 text-sm sm:text-base transition-all duration-300 hover:ring-purple-300/30">
              <Type className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
              <span>Prompt Generator</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Floating orbs - responsive positioning and sizing */}
      <motion.div
        className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-cyan-400/20 rounded-full blur-3xl top-10 left-4 sm:top-20 sm:left-12"
        animate={{ x: [0, 25, -25, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-violet-400/20 rounded-full blur-3xl bottom-10 right-4 sm:bottom-16 sm:right-12"
        animate={{ x: [0, -25, 25, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Footer - responsive positioning */}
      <footer className="mt-12 sm:mt-16 md:mt-20 lg:absolute lg:bottom-6 text-gray-400 text-xs sm:text-sm text-center px-4 relative z-10">
        © {new Date().getFullYear()} • Crafted with ❤️ by{" "}
        <span className="text-cyan-300">AI Morph</span>
      </footer>
    </section>
  );
}
