import { useEffect, useState } from "react";
import AnimatedBackground from "../utils/LoginBackground";
import IntelliscrapeIcon from "../utils/intelliscrapeicon";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();

    console.log("Login Attempted with:", { identifier, password });
  };
  useEffect;
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatedBackground />
      <div className="flex flex-col my-5 space-y-6 relative w-5/6 sm:w-4/6 lg:w-2/3 max-w-md mx-auto z-10">
        <div className="flex flex-col justify-center items-center text-white">
          <div className="flex items-center space-x-2">
            <span className="flex pt-4 justify-center items-center">
              <IntelliscrapeIcon />
            </span>
            <p className="font-bold pr-4 text-2xl sm:text-3xl md:text-4xl">
              Intelliscrape
            </p>
          </div>
          <div className="text-sm sm:text-md md:text-base text-cyan-400 font-normal ">
            Scraping Made Simple
          </div>
        </div>
        <div className="backdrop-blur-xs bg-slate-800/50 flex flex-col p-8 border border-gray-700 rounded-xl w-full shadow-lg">
          <div className="flex flex-col justify-center gap-y-3 items-center text-white">
            <p className="font-semibold text-xl sm:text-2xl">Welcome Back</p>
            <div className="text-xs sm:text-sm text-slate-400 font-normal ">
              Sign in to access your scrapper
            </div>
          </div>
          <form
            onSubmit={loginHandler}
            className="flex mt-4 flex-col w-full sm:p-1 md:p-3 gap-4 "
          >
            <div className="flex flex-col gap-y-6 w-full">
              <div>
                <label
                  htmlFor="username/email"
                  className="text-cyan-400 font-semibold text-xs sm:text-sm md:text-base"
                >
                  Email/Username
                </label>
                <div className="relative mt-2 w-full">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      stroke="#b0b0b0"
                      className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3 font-bold text-gray-300"
                      fill="currentColor"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M256,0c-65.733,0-119.211,53.479-119.211,119.211S190.267,238.423,256,238.423s119.211-53.479,119.211-119.211 S321.733,0,256,0z M256,218.024c-54.486,0-98.813-44.328-98.813-98.813S201.515,20.398,256,20.398s98.813,44.328,98.813,98.813 S310.485,218.024,256,218.024z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M426.272,331.529c-45.48-45.48-105.952-70.529-170.272-70.529c-64.32,0-124.791,25.047-170.273,70.529 c-45.48,45.48-70.529,105.952-70.529,170.272c0,5.632,4.566,10.199,10.199,10.199h461.204c5.632,0,10.199-4.567,10.199-10.199 C496.801,437.482,471.752,377.01,426.272,331.529z M35.831,491.602C41.179,374.789,137.889,281.398,256,281.398 s214.821,93.391,220.17,210.204H35.831z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M182.644,457.944H66.295c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h116.349 c5.633,0,10.199-4.567,10.199-10.199S188.277,457.944,182.644,457.944z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                        <g>
                          {" "}
                          <g>
                            {" "}
                            <path d="M225.621,457.944h-7.337c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h7.337 c5.633,0,10.199-4.567,10.199-10.199S231.254,457.944,225.621,457.944z"></path>{" "}
                          </g>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your email/username"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-[#0b1b2b] text-white text-xs flex items-center sm:text-sm md:text-base rounded-md 
               border border-cyan-400 
               shadow-[0_0_10px_rgba(0,255,255,0.2)] 
               focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.6)] transition-all duration-150"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="username/email"
                  className="text-cyan-400 py-2 font-semibold text-xs sm:text-sm md:text-base"
                >
                  Password
                </label>
                <div className="relative mt-2 w-full">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3 font-bold text-gray-300"
                      fill="currentColor"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <g id="Password">
                          {" "}
                          <path d="M391,233.9478H121a45.1323,45.1323,0,0,0-45,45v162a45.1323,45.1323,0,0,0,45,45H391a45.1323,45.1323,0,0,0,45-45v-162A45.1323,45.1323,0,0,0,391,233.9478ZM184.123,369.3794a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Zm108,0a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Zm108,0a9.8954,9.8954,0,1,1-9.8964,17.1387l-16.33-9.4287v18.8593a9.8965,9.8965,0,0,1-19.793,0V377.0894l-16.33,9.4287a9.8954,9.8954,0,0,1-9.8964-17.1387l16.3344-9.4307-16.3344-9.4306a9.8954,9.8954,0,0,1,9.8964-17.1387l16.33,9.4282V323.9487a9.8965,9.8965,0,0,1,19.793,0v18.8589l16.33-9.4282a9.8954,9.8954,0,0,1,9.8964,17.1387l-16.3344,9.4306Z"></path>{" "}
                          <path d="M157.8965,143.9487a98.1035,98.1035,0,1,1,196.207,0V214.147h19.793V143.9487a117.8965,117.8965,0,0,0-235.793,0V214.147h19.793Z"></path>{" "}
                        </g>{" "}
                      </g>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 bg-[#0b1b2b] text-white text-xs flex items-center sm:text-sm md:text-base rounded-md 
               border border-cyan-400 
               shadow-[0_0_10px_rgba(0,255,255,0.2)] 
               focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.6)] transition-all duration-150"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3" />
                    ) : (
                      <Eye className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-3 bg-amber-500 cursor-pointer shadow-[0_4px_20px_rgba(225,191,0,0.3)] flex justify-center items-center space-x-2 hover:bg-amber-600 text-center text-black font-semibold py-2 px-4 rounded-md transition-all duration-200 focus:outline-none"
              >
                <span>Sign in</span>
                <span>
                  <svg
                    fill="#000000"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 340.034 340.034"
                    xml:space="preserve"
                    className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <polygon points="222.814,52.783 200.902,74.686 280.748,154.528 0,154.528 0,185.513 280.748,185.513 200.902,265.353 222.814,287.252 340.034,170.023 "></polygon>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </span>
              </button>
            </div>
            <div className="flex select-none items-center w-full my-4">
              <div className="flex-1 border-t mt-1 border-gray-600"></div>
              <span className="text-gray-400 text-md">or</span>
              <div className="flex-1 border-t mt-1 border-gray-600"></div>
            </div>
            <div>
              <button className="w-full backdrop-blur-md cursor-pointer bg-slate-700/80 px-5 py-3 text-white font-normal rounded-md ">
                Continue with Google
              </button>
            </div>
            <div className="flex justify-center text-xs sm:text-sm md:text-base mt-2 items-center font-semibold">
              <p className="text-slate-400">Don't have an account?</p>
              <Link to={"/signup"} className="text-cyan-400 hover:text-cyan-300 transition-all duration-200 ml-1 cursor-pointer">
                Sign up
              </Link>
            </div>
          </form>
        </div>
        <div className="p-2">
          <p className="text-xs sm:text-sm md:text-md text-slate-400 text-center">
            By signing in, you agree to our{" "}
            <Link to={"/terms-and-conditions"}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-all duration-200"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to={"/privacy-policy"}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-all duration-200"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
