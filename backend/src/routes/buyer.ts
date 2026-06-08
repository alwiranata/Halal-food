import express from "express";
import { buyerDashboard } from "../controllers/buyer";

const buyerRouter = express.Router();

buyerRouter.get("/dashboard" , buyerDashboard);

export default buyerRouter;
