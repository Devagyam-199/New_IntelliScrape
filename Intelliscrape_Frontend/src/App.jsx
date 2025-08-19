import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import fullRoutes from "./routes/fullRoutes";

const App = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 justify-center text-6xl font-medium text-white items-center h-screen">
            Loading...
          </div>
        }
      >
        <Routes>
          {fullRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
