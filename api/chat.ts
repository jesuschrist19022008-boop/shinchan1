import type { Request, Response } from "express";
import { chatHandler } from "../expressApp.js";

// Dedicated Vercel serverless function for /api/chat
export default function handler(req: Request, res: Response) {
  return chatHandler(req, res);
}
