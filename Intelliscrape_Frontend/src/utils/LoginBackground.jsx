import React, { useEffect, useMemo } from "react";

export default function AnimatedBackground() {
  const stars = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
    }));
  }, []); // only generate once

  useEffect(() => {
    document.querySelectorAll(".star").forEach((star) => {
      star.style.animationDelay = `${Math.random() * 3}s`;
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 overflow-hidden">
      {/* Moving lines */}
      <div className="absolute top-1/4 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-40 animate-moveLine"></div>
      <div className="absolute top-3/4 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-40 animate-moveLine-delay"></div>

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
  );
}
