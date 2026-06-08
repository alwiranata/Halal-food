import express from "express";
import { getMyOrders } from "../controllers/order";
const orderRouter = express.Router();

orderRouter.get("/get", getMyOrders);

export default orderRouter;
