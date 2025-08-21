import { Router } from "express";
import accessTokenAuthorized from "../Middlewares/verifyAccessToken.middlewares.js";
import userLogout from "../Controllers/UserLogout.controllers.js";
import verifyRefreshToken from "../Middlewares/verifyRefreshToken.middlewares.js";
import refreshAccessToken from "../Controllers/accessRefresh.controllers.js";

const accessTokenValidatorRoute = Router();

accessTokenValidatorRoute.post(
  "/protected",
  accessTokenAuthorized,
  (req, res) => {
    res.json({
      message: "You accessed protected data!",
      user: { name: req.user.name, email: req.user.email },
    });
  }
);

accessTokenValidatorRoute.post("/logout", verifyRefreshToken, userLogout);

accessTokenValidatorRoute.post(
  "/refresh",
  verifyRefreshToken,
  refreshAccessToken
);

export default accessTokenValidatorRoute;
