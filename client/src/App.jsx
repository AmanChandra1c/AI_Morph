import React from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { github, logo2 } from './assets';
import { Home, CreatePost, Register, Login, Profile } from './pages';
import { isTokenValid } from './utils/validator';

const App = () => {

  const navigate = useNavigate();

  const handleLogOut = () =>{
     localStorage.removeItem("token");
     navigate("/login");
  }
  const token = localStorage.getItem("token");
  const checkToken = token && token.length > 0;
 
  
  return (
    <>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 py-4 px-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo2} alt="" className="w-14 object-contain" />
        </Link>

        <div className="flex gap-x-4">
          <Link
            to="/profile"
            className={`font-inter font-medium ${
              checkToken ? "" : "hidden"
            } bg-blue-500 text-white px-4 py-2 rounded-md`}
          >
            profile
          </Link>
          <Link
            to="/create-post"
            className={`font-inter font-medium ${
              checkToken ? "" : "hidden"
            } bg-blue-500 text-white px-4 py-2 rounded-md`}
          >
            Create
          </Link>

          <button
            className={`font-inter font-medium ${
              checkToken ? "" : "hidden"
            } bg-blue-500 text-white px-4 py-2 rounded-md`}
            onClick={handleLogOut}
          >
            logOut
          </button>

          <Link
            to="https://github.com/AmanChandra1c/AI_Morph"
            target="_blank"
            className="flex border-black border-2 font-medium text-white px-2 py-2 rounded-md"
          >
            <img src={github} alt="git" className="w-6 h-6 mx-1" />
          </Link>
        </div>
      </header>

      <main className="sm:p-8 px-4 py-8 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App
