import {Router} from "express"
import * as authController from "../controllers/auth"

const  authRouter= Router()
authRouter.post("/register", authController.register)

export default authRouter