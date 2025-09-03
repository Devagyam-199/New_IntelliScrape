import jwt from "jsonwebtoken";

const refreshAccessToken = async (req, res) => {
  try {
    const user = req.user;

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Access token refreshed" });
  } catch (error) {
    return res.status(500).json({ message: "Could not refresh access token" });
  }
};

export default refreshAccessToken;