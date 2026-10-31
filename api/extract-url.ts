import type { Request, Response } from "express";
import { extractUrlHandler } from "../expressApp.js";

// Dedicated Vercel serverless function for /api/extract-url
export default function handler(req: Request, res: Response) {
  return extractUrlHandler(req, res);
}
