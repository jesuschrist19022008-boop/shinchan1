import type { Request, Response } from "express";
import { healthHandler } from "../expressApp.js";

// Dedicated Vercel serverless function for /api/health
export default function handler(req: Request, res: Response) {
  return healthHandler(req, res);
}
