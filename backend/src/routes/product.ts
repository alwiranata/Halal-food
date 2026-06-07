import express from "express";
import { getProducts } from "../controllers/product";
const productRouter = express.Router();

productRouter.get("/", getProducts);

export default productRouter;
