import { Router } from "express";
import * as adminController from "../controllers/admin";
import { verifyToken } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.get("/dashboard", adminController.dashboardStats);

adminRouter.get("/sellers",  adminController.getPendingSellers);

adminRouter.patch("/seller/:id/approve", adminController.approveSeller);

adminRouter.patch("/seller/:id/reject", adminController.rejectSeller);

export default adminRouter;
 