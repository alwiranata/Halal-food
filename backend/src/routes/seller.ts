import { Router } from "express";
import * as sellerController from "../controllers/seller";

const sellerRouter = Router();

sellerRouter.get("/dashboard", sellerController.dashboardStats);

sellerRouter.post("/products", sellerController.createProduct);

sellerRouter.get("/products", sellerController.getProducts);

sellerRouter.get("/products/:id", sellerController.getProductById);

sellerRouter.put("/products/:id", sellerController.updateProduct);

sellerRouter.delete("/products/:id", sellerController.deleteProduct);

export default sellerRouter;
