import { User } from "../Models/user.models.js";
import APIError from "../Utils/apiError.utils.js";
import jwt from "jsonwebtoken";

const accessTokenAuthorized = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new APIError(401, "Access token missing please check");
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    if (!decoded || typeof decoded.id !== "string" || !decoded.id.trim()) {
      throw new APIError(401, "Invalid token payload");
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user) {
      throw new APIError(401, "User not found");
    }

    if (!user.refreshToken) {
      throw new APIError(401, "Refresh token missing, please login again");
    }

    req.user = {
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Access token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid access token" });
    }
    return res
      .status(401)
      .json({ message: error.message || "Authentication failed" });
  }
};

export default accessTokenAuthorized;
