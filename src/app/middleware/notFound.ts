
import status from "http-status";
import { Request, Response, NextFunction } from "express";


export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};