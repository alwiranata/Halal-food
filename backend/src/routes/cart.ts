import express from "express";
import { addToCart, checkout, getCart, removeCartItem, updateCartQty } from "../controllers/cart";
const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/get", getCart);
cartRouter.delete("/remove/:id", removeCartItem);
cartRouter.patch("/update/:id", updateCartQty);
cartRouter.post("/checkout", checkout);

export default cartRouter;
