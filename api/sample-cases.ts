import type { Request, Response } from "express";
import { sampleCasesHandler } from "../expressApp.js";

// Dedicated Vercel serverless function for /api/sample-cases
export default function handler(req: Request, res: Response) {
  return sampleCasesHandler(req, res);
}
