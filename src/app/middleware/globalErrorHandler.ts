import {NextFunction, Request, Response} from "express";
import {envVars} from "../config/env";
import status from "http-status";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error From Global Error Handler:", err)
    }
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";

    console.log(err)
    res.status(500).json(
        {
            success: false,
            err: err.message,
            message: "Internal server error"
        })
}