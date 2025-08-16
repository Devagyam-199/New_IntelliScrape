import React from "react";
import signupbg from "../images/signupbg.png";
import SignUpBackground from "../utils/SignUpBackground";
import IntelliscrapeIcon from "../utils/intelliscrapeicon";

const UserSignUp = () => {
  return (
    <>
      <div className="flex w-full overflow-hidden h-screen">
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 relative overflow-hidden">
          {/* Overlay only on image side */}
          <div
            className="absolute inset-0 opacity-70 bg-cover"
            style={{ backgroundImage: `url(${signupbg})` }}
          ></div>

          <SignUpBackground />
          <div className="w-full flex flex-col justify-center items-center h-full animate-floatingTitle relative z-10">
            <div className="flex items-center space-x-2">
              <span className="flex pt-4 justify-center items-center">
                <IntelliscrapeIcon />
              </span>
              <p className="font-semibold pr-4 text-3xl text-cyan-400 sm:text-4xl md:text-6xl">
                Intelliscrape
              </p>
            </div>
            <div className="text-sm sm:text-md md:text-xl text-cyan-400 font-normal">
              Scraping Made Simple
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSignUp;
