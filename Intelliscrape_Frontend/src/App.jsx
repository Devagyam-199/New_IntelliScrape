import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import fullRoutes from "./routes/fullRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="flex bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 justify-center md:text-xl text-lg lg:text-3xl font-medium text-white items-center h-screen">
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
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;