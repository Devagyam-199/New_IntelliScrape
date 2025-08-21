import userSignUp from "../Controllers/UserSignUp.controllers.js";
import signUpValidation  from "../Middlewares/signUpValidation.middlewares.js";
import userLogin from "../Controllers/UserLogin.controllers.js";
import loginValidation from "../Middlewares/loginValidation.middlewares.js";
import Router from "express";

const uservalidationrouter = Router();

uservalidationrouter.post("/signup",signUpValidation,userSignUp)
uservalidationrouter.post("/login", loginValidation, userLogin);

export default uservalidationrouter;