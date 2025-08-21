import { User } from "../Models/user.models.js";
import bcrypt from "bcrypt";
import APIError from "../Utils/apiError.utils.js";

const userSignUp = async (req, res) => {
  // 1): Take user details from request body
  // 2): Hash the password
  // 3): try to see if user already exists
  // 4): If user exists, return error
  // 6): If user does not exist, create a new user
  // 7): Return success response with user details
  // 8): If any error occurs, return error response
  try {
    const { name, email, password } = req.body;

    const exisitingUser = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    });
    if (exisitingUser) {
      throw new APIError(409, "User already exisits with this email");
    }

    const passHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      passHash,
    });

    //send response to frontend
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      data: {
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Error while signing up user",
      error: error.message,
    });
  }
};

export default userSignUp;
