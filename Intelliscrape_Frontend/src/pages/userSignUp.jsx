import signupbg from "../images/signupbg.png";
import SignUpBackground from "../utils/SignUpBackground";
import IntelliscrapeIcon from "../utils/intelliscrapeicon";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/loadingScreen";

const UserSignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [policyAccept, setPolicyAccept] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    policy: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (signSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [signSuccess, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { policy: "" };

    if (!policyAccept) {
      newErrors.policy = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const signUpHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `https://new-intelliscrape.onrender.com/api/v1/user/signup`,
        {
          name: userName,
          email: email,
          password: password,
        }
      );
      console.log(response.data);
      setSignSuccess(true);
    } catch (error) {
      const newErrors = { userName: "", email: "", password: "", policy: "" };
      if (error.response && error.response.data && error.response.data.message) {
        const message = error.response.data.message.trim();
        
        if (message === "All fields are required") {
          newErrors.userName = "Full name is required";
          newErrors.email = "Email is required";
          newErrors.password = "Password is required";
        } else if (message === "Invalid email format") {
          newErrors.email = message;
        } else if (message.startsWith("Password must be 8-12 characters long")) {
          newErrors.password = message;
        } else if (message === "User already exisits with this email") {
          newErrors.email = "User already exisits with this email";
        } else if (message === "Error while signing up user") {
          alert(message);
        } else {
          alert(message);
        }
      } else {
        alert("Network error. Please check your connection and try again.");
      }
      setErrors(newErrors);
    }
  };

  if (signSuccess) {
    return <LoadingScreen loading={signSuccess} />;
  }

  return (
    <div className="flex w-full h-screen">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${signupbg})` }}
        ></div>
        <SignUpBackground />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
          <div className="flex flex-col items-center justify-center animate-floatingTitle">
            <div className="flex items-center space-x-2">
              <span className="flex justify-center w-18 h-18 items-center">
                <IntelliscrapeIcon />
              </span>
              <p className="font-semibold text-xl sm:text-3xl md:text-5xl lg:text-6xl text-cyan-400 pr-4">
                Intelliscrape
              </p>
            </div>
            <div className="text-sm sm:text-md md:text-lg text-cyan-400 font-normal">
              Scraping Made Simple
            </div>
          </div>
          <div className="max-w-md text-slate-300 text-center mt-10 md:text-sm lg:text-[17px] font-normal">
            <p>
              Harness the power of intelligent data scraping and analysis with
              our cutting-edge platform. Transform raw data into actionable
              insights.
            </p>
          </div>
          <div className="max-w-md flex justify-center text-center text-sm lg:text-base font-medium text-cyan-400 items-center gap-x-16 mt-8 px-3 py-2">
            <div className="flex flex-col justify-center items-center gap-y-2">
              <span>
                <svg
                  fill="#22ddee"
                  className="lg:w-16 lg:h-16 md:w-12 md:h-12 w-10 h-10 animate-pulse"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512.00 512.00"
                  xml:space="preserve"
                  stroke="#22ddee"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke="#CCCCCC"
                    stroke-width="4.096"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M144.851,164.786c-0.145-0.712-0.356-1.414-0.634-2.081c-0.278-0.679-0.623-1.325-1.024-1.926 c-0.412-0.612-0.868-1.18-1.38-1.692c-0.523-0.512-1.091-0.979-1.703-1.38c-0.601-0.401-1.247-0.746-1.914-1.024 c-0.668-0.278-1.369-0.501-2.081-0.634c-1.436-0.289-2.916-0.289-4.352,0c-0.712,0.134-1.414,0.356-2.081,0.634 c-0.668,0.278-1.325,0.623-1.926,1.024c-0.612,0.401-1.18,0.868-1.692,1.38c-0.512,0.512-0.979,1.08-1.38,1.692 c-0.401,0.601-0.746,1.247-1.024,1.926c-0.278,0.668-0.49,1.369-0.634,2.081c-0.145,0.712-0.223,1.447-0.223,2.17 s0.078,1.458,0.223,2.17c0.145,0.712,0.356,1.414,0.634,2.081c0.278,0.679,0.623,1.325,1.024,1.926 c0.401,0.612,0.868,1.18,1.38,1.692c0.512,0.512,1.08,0.979,1.692,1.38c0.601,0.412,1.258,0.746,1.926,1.024 c0.668,0.278,1.369,0.501,2.081,0.646c0.712,0.134,1.447,0.211,2.17,0.211c0.735,0,1.458-0.078,2.182-0.211 c0.712-0.145,1.414-0.367,2.081-0.646c0.668-0.278,1.313-0.612,1.914-1.024c0.612-0.401,1.18-0.868,1.703-1.38 c0.512-0.512,0.968-1.08,1.38-1.692c0.401-0.601,0.746-1.247,1.024-1.926c0.278-0.668,0.49-1.369,0.634-2.081 s0.211-1.447,0.211-2.17S144.996,165.498,144.851,164.786z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M500.87,222.609h-33.391v-55.652c0-6.147-4.983-11.13-11.13-11.13H267.13v-24.175 c12.955-4.595,22.261-16.966,22.261-31.477c0-18.412-14.979-33.391-33.391-33.391c-18.412,0-33.391,14.979-33.391,33.391 c0,14.51,9.306,26.882,22.261,31.477v24.175h-77.171c-6.147,0-11.13,4.983-11.13,11.13s4.983,11.13,11.13,11.13h277.518v55.652 v133.565v55.652H66.783v-55.652V233.739v-55.652h33.391c6.147,0,11.13-4.983,11.13-11.13s-4.983-11.13-11.13-11.13H55.652 c-6.147,0-11.13,4.983-11.13,11.13v55.652H11.13c-6.147,0-11.13,4.983-11.13,11.13v133.565c0,6.147,4.983,11.13,11.13,11.13 h33.391v55.652c0,6.147,4.983,11.13,11.13,11.13h400.696c6.147,0,11.13-4.983,11.13-11.13v-55.652h33.391 c6.147,0,11.13-4.983,11.13-11.13V233.739C512,227.592,507.017,222.609,500.87,222.609z M256,111.304 c-6.137,0-11.13-4.993-11.13-11.13c0-6.137,4.993-11.13,11.13-11.13c6.137,0,11.13,4.993,11.13,11.13 C267.13,106.311,262.137,111.304,256,111.304z M44.522,356.174H22.261V244.87h22.261V356.174z M489.739,356.174h-22.261V244.87 h22.261V356.174z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M166.957,244.87c-18.412,0-33.391,14.979-33.391,33.391c0,18.412,14.979,33.391,33.391,33.391 c18.412,0,33.391-14.979,33.391-33.391C200.348,259.849,185.369,244.87,166.957,244.87z M166.957,289.391 c-6.137,0-11.13-4.993-11.13-11.13s4.993-11.13,11.13-11.13s11.13,4.993,11.13,11.13S173.094,289.391,166.957,289.391z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M345.043,244.87c-18.412,0-33.391,14.979-33.391,33.391c0,18.412,14.979,33.391,33.391,33.391 c18.412,0,33.391-14.979,33.391-33.391C378.435,259.849,363.455,244.87,345.043,244.87z M345.043,289.391 c-6.137,0-11.13-4.993-11.13-11.13s4.993-11.13,11.13-11.13s11.13,4.993,11.13,11.13S351.181,289.391,345.043,289.391z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M311.652,311.652H200.348c-6.147,0-11.13,4.983-11.13,11.13c0,36.824,29.959,66.783,66.783,66.783 s66.783-29.959,66.783-66.783C322.783,316.635,317.799,311.652,311.652,311.652z M256,367.304 c-20.707,0-38.158-14.21-43.113-33.391h86.226C294.158,353.094,276.707,367.304,256,367.304z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </span>
              <span>AI Powered</span>
            </div>
            <div className="flex flex-col align-text-bottom items-center gap-y-3">
              <div>
                <svg
                  fill="#22ddee"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xml:space="preserve"
                  className="lg:w-12 lg:h-12 md:w-8 animate-pulse md:h-8 mt-3 w-10 h-10"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path d="M412.324,209.102C406.777,198.586,395.886,192,383.996,192h-60.219l72.844-145.688c4.953-9.922,4.422-21.703-1.406-31.133 C389.386,5.742,379.09,0,367.996,0h-160c-13.781,0-26,8.813-30.359,21.883l-80,240c-3.25,9.758-1.609,20.484,4.406,28.828 c6.016,8.344,15.672,13.289,25.953,13.289h74.703l-26.328,171.133c-2.266,14.75,5.953,29.117,19.828,34.617 c3.844,1.523,7.844,2.25,11.781,2.25c10.297,0,20.266-4.977,26.391-13.867l176-256C417.105,232.336,417.855,219.617,412.324,209.102 z"></path>{" "}
                  </g>
                </svg>
              </div>
              <p>Real-Time</p>
            </div>
            <div className="flex flex-col justify-center items gap-y-2">
              <span>
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  id="secure"
                  fill="#22ddee"
                  className="w-10 animate-pulse h-10 md:w-12 mt-1 md:h-12 lg:w-14 lg:h-14"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M19.42,3.83,12.24,2h0A.67.67,0,0,0,12,2a.67.67,0,0,0-.2,0h0L4.58,3.83A2,2,0,0,0,3.07,5.92l.42,5.51a12,12,0,0,0,7.24,10.11l.88.38h0a.91.91,0,0,0,.7,0h0l.88-.38a12,12,0,0,0,7.24-10.11l.42-5.51A2,2,0,0,0,19.42,3.83ZM15.71,9.71l-4,4a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,11.59l3.29-3.3a1,1,0,0,1,1.42,1.42Z"></path>
                  </g>
                </svg>
              </span>
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col space-y-6 w-full md:w-1/2 items-center justify-center bg-gray-900">
        <div className="lg:w-2/3 md:w-4/5 w-10/11 justify-center items-center p-6 rounded-2xl border border-gray-700 backdrop-blur-sm flex flex-col bg-slate-800/50">
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-sm md:text-md lg:text-2xl text-white font-bold">
              Create Your Account
            </p>
            <p className="text-xs md:text-xs lg:text-base text-slate-400 font-medium">
              Be part of something amazing — sign up now!
            </p>
          </div>
          <form
            onSubmit={signUpHandler}
            className="flex w-5/6 mt-7 flex-col gap-y-4"
          >
            {/* Full Name Field */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="name"
                className="text-white font-medium text-xs md:text-sm lg:text-base"
              >
                Full Name
              </label>
              <div className="relative w-full">
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
                    aria-hidden="true"
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
                  id="name"
                  className={`w-full pl-9 sm:pl-10 pr-4 py-3 bg-[#0b1b2b] text-white text-xs md:text-sm lg:text-base rounded-md 
                    border ${errors.userName ? "border-red-500" : "border-cyan-400"} 
                    shadow-[0_0_10px_rgba(0,255,255,0.2)] 
                    focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.6)] transition-all duration-150`}
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setErrors((prev) => ({ ...prev, userName: "" }));
                  }}
                  required
                  autoComplete="username"
                />
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="email"
                className="text-white font-medium text-xs md:text-sm lg:text-base"
              >
                Email Address
              </label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-600">
                  <svg
                    className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3 font-bold text-gray-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#b0b0b0"
                    aria-hidden="true"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                        stroke="#b0b0b0"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="#b0b0b0"
                        stroke-width="2"
                        stroke-linecap="round"
                      ></rect>{" "}
                    </g>
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-9 sm:pl-10 pr-4 py-3 bg-[#0b1b2b] text-white text-xs md:text-sm lg:text-base rounded-md 
                    border ${errors.email ? "border-red-500" : "border-cyan-400"} 
                    shadow-[0_0_10px_rgba(0,255,255,0.2)] 
                    focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.6)] transition-all duration-150`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="pass"
                className="text-white font-medium text-xs md:text-sm lg:text-base"
              >
                Password
              </label>
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                  <svg
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3 font-bold text-gray-300"
                    fill="currentColor"
                    aria-hidden="true"
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
                  id="pass"
                  className={`w-full pl-9 sm:pl-10 pr-4 py-3 bg-[#0b1b2b] text-white text-xs md:text-sm lg:text-base rounded-md 
                    border ${errors.password ? "border-red-500" : "border-cyan-400"} 
                    shadow-[0_0_10px_rgba(0,255,255,0.2)] 
                    focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.6)] transition-all duration-150`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center w-5 justify-center text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3" />
                  ) : (
                    <Eye className="lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3 sm:w-3 sm:h-3" />
                  )}
                </button>
              </div>
              <label
                htmlFor="password"
                className="text-slate-400 text-[8px] md:text-[7px] lg:text-xs"
              >
                Must be at least 8 characters with mixed case, numbers & symbols
              </label>
              {errors.password && (
                <p className="text-red-500 text-[8px] md:text-[9px] lg:text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Policy Checkbox */}
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="policy"
                className="lg:h-4 lg:w-4 m-0 p-0 h-2 w-2"
                checked={policyAccept}
                onChange={(e) => {
                  setPolicyAccept(e.target.checked);
                  setErrors((prev) => ({ ...prev, policy: "" }));
                }}
              />
              <p className="text-slate-300 text-[8px] lg:text-base px-2">
                I agree to the{" "}
                <span className="text-cyan-400 hover:text-cyan-600 hover:underline transition-all duration-150">
                  <Link to={"/terms-and-conditions"}>Terms of Service</Link>
                </span>{" "}
                and{" "}
                <span className="text-cyan-400 hover:text-cyan-600 hover:underline transition-all duration-150">
                  <Link to={"/privacy-policy"}>Privacy Policy</Link>
                </span>
              </p>
            </div>
            {errors.policy && (
              <p className="text-red-500 text-xs mt-1">{errors.policy}</p>
            )}

            <button
              type="submit"
              className="w-full mt-3 text-xs md:text-sm lg:text-base bg-amber-500 cursor-pointer flex justify-center items-center space-x-2 hover:bg-amber-400 text-center text-black font-semibold py-2 md:py-2 lg:py-3 px-4 rounded-md transition-all duration-200 focus:outline-none"
            >
              <span>Create Account</span>
            </button>
          </form>
          <div className="flex select-none items-center text-xs md:text-sm lg:text-base justify-center w-full my-4">
            <div className="flex-1 border-t ml-2 mt-1 border-gray-600"></div>
            <span className="text-gray-400 mx-5 text-md">or</span>
            <div className="flex-1 border-t mr-2 mt-1 border-gray-600"></div>
          </div>
          <p className="text-xs md:text-sm lg:text-lg text-slate-100 text-center">
            Already have an account?{" "}
            <span className="text-cyan-400 hover:text-cyan-600 hover:underline transition-all duration-150">
              <Link to={"/"}>Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;