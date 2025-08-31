import React, { useState } from "react";

const ResizableSidebar = ({ children, minWidth = 170, maxWidth = 350 }) => {
  const [width, setWidth] = useState(250); // default width
  const [collapsed, setCollapsed] = useState(false);

  const startResizing = (e) => {
    const startX = e.clientX;
    const startWidth = width;
    let lastUpdate = 0;

    const onMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; //debouncing, means limiting the change to 60 frames per second
      lastUpdate = now;

      const newWidth = startWidth + e.clientX - startX;

      if (newWidth < minWidth) {
        setCollapsed(true);
        setWidth(0);
      } else {
        setCollapsed(false);
        setWidth(Math.min(Math.max(minWidth, newWidth), maxWidth));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {/* Sidebar */}
      {!collapsed && (
        <div
          style={{ width }}
          className="resizable-sidebar  shadow-amber-600  bg-slate-900/65 backdrop-blur-xl  flex flex-col h-full text-xl overflow-y-auto border-e-2 border-slate-950"
        >
          {children}
        </div>
      )}

      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="w-1 cursor-col-resize bg-cyan-900 hover:bg-cyan-700 transition-colors"
      />
    </>
  );
};

export default ResizableSidebar;
