import React from "react";
import { Home, CreatePost, Register, Login, Profile, LandingPage } from "./pages";
import { Route, Routes } from "react-router-dom";

import Navbar from "./pages/partials/Navbar";
import { ToasterProvider } from "@/components/ui/toaster";

const App = () => {
  return (
    <ToasterProvider>
      <div className="overflow-hidden relative h-16 w-full">
        <Navbar />
      </div>
      <main className="sm:p-8 px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </ToasterProvider>
  );
};

export default App;
