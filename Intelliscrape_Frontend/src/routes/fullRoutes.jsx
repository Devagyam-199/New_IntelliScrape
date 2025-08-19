import { lazy } from "react";

const Home = lazy(()=>import("../components/Home"))
const UserSignUp = lazy(()=>import("../components/userSignUp"))
const UserLogin = lazy(()=>import("../components/userLogin"))
const TermsnConditions = lazy(()=>import("../components/TermsnConditions"))
const PrivacyPolicy = lazy(()=>import("../components/PrivacyPolicy"))

const fullRoutes = [
  { path: "/", element: <Home /> },
  { path: "/signup", element: <UserSignUp /> },
  { path: "/login", element: <UserLogin /> },
  { path: "/terms-and-conditions", element: <TermsnConditions /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
];

export default fullRoutes;
