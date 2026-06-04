import { Request, Response } from "express";
import { ZodError } from "zod";
import * as authServices from "../services/auth";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await authServices.register(req.body);

    res.status(201).json({
      message: "Register success",
      data: result,
    });
    
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: error.issues[0]?.message || "Validation error",
      });
      return;
    }

    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await authServices.login(
      req.body
    );

    res.status(200).json({
      message: "Login success",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message:
          error.issues[0]?.message ||
          "Validation error",
      });
      return;
    }

    res.status(400).json({
      message: (error as Error).message,
    });
  }
};