import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import IntelliscrapeIcon from "../utils/intelliscrapeicon";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [hamopen, setHamOpen] = useState(false);

  // Hide Navbar on these routes
  const hideNavbarPaths = ["/login", "/signup"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from AuthContext
      navigate("/login"); // Navigate to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/*for laptop and tablets navbar*/}
      <div className="bg-slate-900/65 border-b-2 border-b-slate-800 backdrop-blur-lg w-full h-20 top-0 sm:flex sm:justify-center sm:items-center hidden fixed">
        <div className="flex justify-center w-1/3 mx-2 items-center">
          <span className="w-12 h-12 mx-3">
            <IntelliscrapeIcon />
          </span>
          <span className="text-white font-semibold text-2xl">
            Intelliscrape
          </span>
        </div>
        {user ? (
          <>
            <div className="flex w-2/3 h-full items-center">
              <ul className="flex w-full justify-center gap-x-2 sm:gap-x-3 items-center font-normal text-base text-white">
                <li
                  className={`px-4 sm:px-7 py-1.5 transition-[border-color,border-width] duration-200 ${
                    location.pathname === "/"
                      ? "border-b-[3px] border-b-cyan-600"
                      : ""
                  } hover:border-b-[2px] hover:border-b-cyan-500`}
                >
                  <Link
                    to="/"
                    className="block text-center focus-visible:outline focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
                  >
                    Home
                  </Link>
                </li>
                <li
                  className={`px-4 sm:px-7 py-1.5 transition-[border-color,border-width] duration-200 ${
                    location.pathname === "/userhistory"
                      ? "border-b-[3px] border-b-cyan-600"
                      : ""
                  } hover:border-b-[3px] hover:border-b-cyan-500`}
                >
                  <Link
                    to="/userhistory"
                    className="block text-center focus-visible:outline focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
                  >
                    History
                  </Link>
                </li>
              </ul>
            </div>
            <div className="h-full w-1/3 flex justify-center items-center">
              <button
                onClick={handleLogout}
                className="md:w-1/2 lg:w-1/3 hover:text-lg bg-amber-500 cursor-pointer flex justify-center items-center space-x-2 hover:bg-amber-600 active:bg-amber-600 hover-px-5 hover-py-3 shadow-[0_4px_20px_rgba(225,191,0,0.3)] text-center text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="h-full w-1/3 flex space-x-5 justify-center items-center">
            <Link
              to="/login"
              className="md:w-1/2 lg:w-1/3 hover:text-lg mt-3 border border-cyan-400 cursor-pointer flex justify-center items-center space-x-2 hover:border-2 hover-px-5 hover-py-3 text-center text-cyan-400 hover:text-white hover:bg-cyan-400 active:bg-cyan-400 active:text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="md:w-1/2 lg:w-1/3 mt-3 hover:text-lg bg-amber-500 cursor-pointer flex justify-center items-center space-x-2 hover:bg-amber-600 active:bg-amber-600 hover-px-5 hover-py-3 shadow-[0_4px_20px_rgba(225,191,0,0.3)] text-center text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none"
            >
              Signup
            </Link>
          </div>
        )}
      </div>

      {/* for screens smaller than tablets navbar */}
      <div
        className={`bg-slate-900/60 border-b  border-b-slate-700 backdrop-blur-lg w-full h-14 top-0 sm:hidden flex flex-col  items-stretch fixed ${
          hamopen
            ? "h-screen transition-all duration-600 py-3"
            : "justify-center"
        } `}
      >
        <div className="flex items-center">
          <div className="flex justify-start mx-2 items-center">
            <span className="w-9 h-9 mx-3">
              <IntelliscrapeIcon />
            </span>
            <span className="text-white font-semibold text-2xl">
              Intelliscrape
            </span>
          </div>
          <button
            className={`fixed px-5 py-2 right-0`}
            onClick={() => setHamOpen(!hamopen)}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        {/* we are using && logic cuz we are only going to show one component, i.e. there is no other component to be shown when hammenu is closed */}
        {hamopen && (
          <div className="w-full flex flex-col justify-center items-center mt-8">
            <ul className="space-y-7 text-center font-medium text-lg text-white">
              <li
                className={`px-4 sm:px-7 py-1.5 transition-[border-color,border-width] duration-200 ${
                  location.pathname === "/"
                    ? "border-b-[3px] border-b-cyan-600"
                    : ""
                } hover:border-b-[3px] hover:border-b-cyan-500`}
              >
                <Link to={"/"}>Home</Link>
              </li>
              <li
                className={`px-4 sm:px-7 py-1.5 transition-[border-color,border-width] duration-200 ${
                  location.pathname === "/userhistory"
                    ? "border-b-[3px] border-b-cyan-600"
                    : ""
                } hover:border-b-[3px] hover:border-b-cyan-500`}
              >
                <Link to={"/userhistory"}>History</Link>
              </li>
            </ul>
            <button
              onClick={handleLogout}
              className="w-full mt-3 hover:text-lg fixed bottom-0 bg-amber-500 cursor-pointer flex justify-center items-center space-x-2 hover:bg-amber-600 active:bg-amber-600 hover-px-5 hover-py-3 shadow-[0_4px_20px_rgba(225,191,0,0.3)] text-center text-white font-semibold py-2 px-4 transition-all duration-200 focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
