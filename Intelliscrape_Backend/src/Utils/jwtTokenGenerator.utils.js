import jwt from "jsonwebtoken";

const jwtGenerator = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET, 
    {
        expiresIn: process.env.JWT_ACCESS_EXPIRY
    }
    );
  const refreshToken = jwt.sign(
    {userId},
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY
    }
  );
  return { accessToken, refreshToken };
};

export default jwtGenerator;