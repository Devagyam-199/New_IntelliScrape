import bcrypt from "bcrypt";
import { User } from "../Models/user.models.js";
import APIError from "../Utils/apiError.utils.js";
import jwtGenerator from "../Utils/jwtTokenGenerator.utils.js";

const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({ email: identifier }).select("+passHash");

    if (!user) {
      throw new APIError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passHash);
    if (!isPasswordValid) {
      throw new APIError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = jwtGenerator(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login Successful",
      data: { //id: user._id,
       name: user.name, 
       email: user.email 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export default login;

/* ===========================================================================
   Challenges Faced and Resolutions
   =========================================================================== 
   - Challenge: Token payload used userId instead of id, causing middleware to fail in finding the user.
     - Resolution: Updated token signing to use id, aligning with middleware expectation and fixing user lookup.
   - Challenge: 
     - Resolution: 
   =========================================================================== */