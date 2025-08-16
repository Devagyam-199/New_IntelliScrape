import React, { useEffect } from "react";

const SignUpBackground = () => {
  useEffect(() => {
    document.querySelectorAll(".star").forEach((star) => {
      star.style.animationDelay = `${Math.random() * 3}s`;
    });
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="star absolute bg-cyan-300 rounded-full opacity-50 animate-starPulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignUpBackground;
