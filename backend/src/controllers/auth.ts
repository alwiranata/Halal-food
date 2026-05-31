import { Request, Response } from "express";
import * as authServices from "../services/auth"

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   const result = await authServices.register(req.body)
   res.status(201).json({
    message : "Regsiter success",
    data : result
   })
  } catch (error) {
   res.status(400).json({
    message : (error as Error).message
   })
  }
};