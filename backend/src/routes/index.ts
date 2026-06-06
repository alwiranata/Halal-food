import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import authRouter from "./auth";
import adminRouter from "./admin";
import sellerRouter from "./seller";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/seller", verifyToken, sellerRouter);

export default router;
