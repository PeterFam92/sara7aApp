import { Router } from "express";
import * as authService from "./auth.service.js";

const router = Router();

router.post("/signup", authService.signUp);
router.post("/login", authService.logIn);

export default router;
