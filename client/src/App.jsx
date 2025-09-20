import React from "react";
import { Home, CreatePost, Register, Login, Profile } from "./pages";
import { Route, Routes } from "react-router-dom";

import Navbar from "./pages/partials/Navbar";

const App = () => {
  return (
    <>
      <div className="overflow-hidden relative pt-2">
        <Navbar />
      <main className="sm:p-8 px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      </div>
    </>
  );
};

export default App;
