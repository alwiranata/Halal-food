import { Request, Response } from "express";
import * as adminService from "../services/admin";

export const dashboardStats = async (req: Request, res: Response) => {
  try {
    const data = await adminService.getDashboardStats();

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

export const getPendingSellers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await adminService.getPendingSellers();

    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const approveSeller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const result = await adminService.approveSeller(id);

    res.status(200).json({
      message: "Seller approved",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const rejectSeller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const result = await adminService.rejectSeller(id);

    res.status(200).json({
      message: "Seller rejected",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};
