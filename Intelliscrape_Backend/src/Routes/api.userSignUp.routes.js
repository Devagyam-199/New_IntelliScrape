import userSignUp from "../Controllers/UserSignUp.controllers.js";

import Router from "express";

const router = Router();

router.route("/signup").post(userSignUp);

export default router;