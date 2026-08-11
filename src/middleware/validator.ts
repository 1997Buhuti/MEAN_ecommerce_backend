import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, message: "Validation error", error: err.errors });
    }
    next(err);
  }
};
