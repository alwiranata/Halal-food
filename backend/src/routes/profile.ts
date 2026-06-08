import express from "express";
import { getProfile ,updateProfile } from "../controllers/profile";
const profileRouter = express.Router();

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile)

export default profileRouter