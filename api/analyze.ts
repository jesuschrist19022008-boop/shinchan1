import type { Request, Response } from "express";
import { analyzeHandler } from "../expressApp.js";

// Dedicated Vercel serverless function for /api/analyze
export default function handler(req: Request, res: Response) {
  return analyzeHandler(req, res);
}
