import {Router} from "express"
import * as authController from "../controllers/auth"

const  authRouter= Router()
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

export default authRouter