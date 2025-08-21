import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <div className="bg-red-900 w-full h-10">navbar</div>;
    </>
  );
};

export default Navbar;
