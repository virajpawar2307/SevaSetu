import express from "express";
import { body } from "express-validator";
import { register, login, adminLogin } from "../controller/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").notEmpty(),
    body("username").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);

router.post("/login", login);
router.post("/admin-login", adminLogin);

export default router;
