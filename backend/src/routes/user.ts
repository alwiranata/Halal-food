import express from "express";
import { registerSeller } from "../controllers/user";
import { upload } from "../middlewares/upload";

const sellerRegisterRouter = express.Router();

sellerRegisterRouter.post(
  "/register",
  upload.fields([{ name: "ktp_photo", maxCount: 1 }]),
  registerSeller,
);

export default sellerRegisterRouter;
