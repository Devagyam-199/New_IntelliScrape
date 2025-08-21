import APIError from "../Utils/apiError.utils.js";

const loginValidation = (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    return next(new APIError(400, "Username or email is required"));
  }
  if (!password) {
    return next(new APIError(400, "Password is required"));
  }

  req.body.identifier = identifier.trim();
  if (req.body.identifier.includes("@")) {
    req.body.identifier = req.body.identifier.toLowerCase(); // normalize email
  }

  next();
};

export default loginValidation;