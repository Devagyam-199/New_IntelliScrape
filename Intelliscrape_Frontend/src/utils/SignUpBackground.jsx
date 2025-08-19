import React, { useEffect, useMemo } from "react";

const SignUpBackground = () => {
  const stars = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
    }));
  }, []);

  useEffect(() => {
    document.querySelectorAll(".star").forEach((star) => {
      star.style.animationDelay = `${Math.random() * 3}s`;
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div>
        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star absolute bg-cyan-300 rounded-full opacity-50 animate-starPulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SignUpBackground;
