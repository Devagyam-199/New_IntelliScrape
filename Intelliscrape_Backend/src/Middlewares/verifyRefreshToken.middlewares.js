import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";
import APIError from "../Utils/apiError.utils.js";

const verifyRefreshToken = async (req, res, next) => {
  try {
    //console.log("Request headers:", req.headers); // Logs headers to verify cookie receipt
    //console.log("Request cookies:", req.cookies); // Ensures refreshToken is received

    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    //console.log("Received refresh token:", refreshToken || "none");

    if (!refreshToken) {
      throw new APIError(401, "Refresh token missing, please login again");
    }

    const decodedNoVerify = jwt.decode(refreshToken);
    //console.log("Decoded token (no verify):", decodedNoVerify);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET ? "set" : "undefined");
    // console.log("Decoded token (verified):", decoded);
    // console.log("Extracted ID:", decoded.id, "Extracted userId:", decoded.userId);

    const user = await User.findById(decoded.id || decoded.userId).select("+refreshToken");
    // console.log("Query used:", decoded.id || decoded.userId);
    // console.log("Fetched user:", user ? { id: user._id, refreshToken: user.refreshToken } : "not found");

    if (!user) {
      throw new APIError(401, "User not found for this token");
    }

    const sentToken = refreshToken.trim();
    const storedToken = user.refreshToken?.trim() || "";
    // console.log("Sent token (trimmed):", sentToken);
    // console.log("Stored token (trimmed):", storedToken);
    // console.log("Token comparison:", sentToken === storedToken);

    if (sentToken !== storedToken) {
      throw new APIError(401, "Invalid refresh token, please login again");
    }

    req.user = user;
    next();
  } catch (error) {
    /*console.error("VerifyRefreshToken error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });*/
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired, please login again" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token signature, please login again" });
    }
    return res.status(401).json({ message: error.message || "Refresh token invalid" });
  }
};

export default verifyRefreshToken;

/* ===========================================================================
   Challenges Faced and Resolutions
   =========================================================================== 
   - Challenge: User not found error due to mismatch between token payload (userId) and middleware expectation (id).
     - Resolution: Updated middleware to handle both fields and aligned login controller to use id, ensuring correct user lookup.
   - Challenge: Lack of visibility into token verification process.
     - Resolution: Added debug logs (now commented) to trace payload and query, aiding in identifying the mismatch.
   - Challenge: Potential token comparison failures due to whitespace or encoding.
     - Resolution: Implemented trimming in token comparison to prevent such issues.
   =========================================================================== */