import { lazy } from "react";
import ProtectRoutes from "../components/ProtectRoutes";

const Home = lazy(() => import("../pages/Home"));
const UserSignUp = lazy(() => import("../pages/userSignUp"));
const UserLogin = lazy(() => import("../pages/userLogin"));
const TermsnConditions = lazy(() => import("../pages/TermsnConditions"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const ScrapedHistory = lazy(() => import("../pages/ScrapedHistory"));

const fullRoutes = [
  { path: "/", element: <UserLogin /> },
  { path: "/signup", element: <UserSignUp /> },
  { path: "/home", element: <Home /> },
  { path: "/terms-and-conditions", element: <TermsnConditions /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  {
    path: "about-us",
    element: (
      <ProtectRoutes>
        <AboutUs />
      </ProtectRoutes>
    ),
  },
  {
    path: "userhistory",
    element: (
      <ProtectRoutes>
        <ScrapedHistory />
      </ProtectRoutes>
    ),
  },
];

export default fullRoutes;
