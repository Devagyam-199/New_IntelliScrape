import APIError from "../Utils/apiError.utils.js";
const signUpValidation = (req, res, next) => {
  //null fields check
  //email proper format check
  //password length check
  //password format check

  const { name, email, password } = req.body;

  if (!name.trim() || !email.trim() || !password.trim()) {
    return next(new APIError(400, "All fields are required"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new APIError(400, "Invalid email format"));
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_.\/!#$%^&*])[A-Za-z\d@_.\/!#$%^&*]{8,12}$/;
  if (!strongPasswordRegex.test(password)) {
    return next(
      new APIError(
        400,
        "Password must be 8-12 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@_./!#$%^&*)"
      )
    );
  }
  next();
};

export default signUpValidation;