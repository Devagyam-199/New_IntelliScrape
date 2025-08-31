import { User } from "../Models/user.models.js";

const protectedController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id).select("name email");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Protected route error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default protectedController;