import { Router } from "express";
import { cadastro, login } from "../controllers/auth.controller";

const router = Router();

router.post("/cadastro", cadastro);
router.post("/login", login);

export default router;