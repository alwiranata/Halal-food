import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import authRouter from "./auth";
import adminRouter from "./admin";
import sellerRouter from "./seller";
import productRouter from "./product";
import cartRouter from "./cart";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/seller", verifyToken, sellerRouter);
router.use("/product",verifyToken, productRouter);
router.use("/cart", verifyToken, cartRouter);
export default router;
