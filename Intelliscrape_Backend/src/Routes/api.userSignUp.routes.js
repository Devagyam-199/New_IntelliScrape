import userSignUp from "../Controllers/UserSignUp.controllers.js";
import signUpValidation  from "../Middlewares/signUpValidation.middlewares.js";
import userLogin from "../Controllers/UserLogin.controllers.js";
import loginValidation from "../Middlewares/loginValidation.middleware.js";
import Router from "express";

const router = Router();

router.post("/signup",signUpValidation,userSignUp)
router.post("/login", loginValidation, userLogin);

export default router;