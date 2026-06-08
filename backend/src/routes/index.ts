import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import authRouter from "./auth";
import adminRouter from "./admin";
import sellerRouter from "./seller";
import productRouter from "./product";
import cartRouter from "./cart";
import orderRouter from "./order";
import buyerRouter from "./buyer";
import profileRouter from "./profile";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/seller", verifyToken, sellerRouter);
router.use("/product", verifyToken, productRouter);
router.use("/cart", verifyToken, cartRouter);
router.use("/order", verifyToken, orderRouter);
router.use("/buyer", verifyToken, buyerRouter);
router.use("/profile", verifyToken, profileRouter);

export default router;
