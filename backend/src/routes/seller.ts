import { Router } from "express";
import * as sellerController from "../controllers/seller";
import { upload } from "../middlewares/upload";

const sellerRouter = Router();

sellerRouter.get("/dashboard", sellerController.dashboardStats);

sellerRouter.post(
  "/products",
  upload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "halal_certificate", maxCount: 1 },
  ]),
  sellerController.createProduct,
);

sellerRouter.get("/products", sellerController.getProducts);

sellerRouter.get("/products/:id", sellerController.getProductById);

sellerRouter.put(
  "/products/:id",
  upload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "halal_certificate", maxCount: 1 },
  ]),
  sellerController.updateProduct,
);
sellerRouter.delete("/products/:id", sellerController.deleteProduct);

sellerRouter.put("/orders/:id/status", sellerController.updateOrderStatus);
sellerRouter.get("/orders", sellerController.getSellerOrders);

export default sellerRouter;
