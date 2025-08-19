import APIError from "../Utils/apiError.utils.js";
import { User } from "../Models/user.models.js";
import bcrypt from "bcrypt";
import jwtGenerator from "../Utils/jwtTokenGenerator.utils.js";

const userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const exisiting = await User.findOne({
      $or: [{ name: identifier }, { email: identifier }],
    }).select("+passHash"); //explicitly select passHash to compare passwords

    if (!exisiting) {
      throw new APIError(403, "User does not exist with this name or email");
    }

    const ispassvalid = await bcrypt.compare(password, exisiting.passHash);

    if (!ispassvalid) {
      throw new APIError(403, "Invalid Password");
    }

    const { accessToken, refreshToken } = jwtGenerator(exisiting._id);

    exisiting.refreshToken = refreshToken;
    await exisiting.save();

    //acess token sent as a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // will send cookie only for https requests if secure is true
      sameSite: "strict", // helps to prevent cross-site request forgery attacks
      maxAge:  15 * 60 * 1000, // 15 mins in milliseconds
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        name: exisiting.name,
        email: exisiting.email,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default userLogin;
