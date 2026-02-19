import {NextFunction, Request, Response} from "express";
import {envVars} from "../config/env";
import status from "http-status";
import {TErrorResponse, TErrorSources} from "../interfaces/error.interfaces";
import z from "zod";
import {handleZodError} from "../errorHelper/handleZodError";
import AppError from "../errorHelper/AppError";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error From Global Error Handler:", err)
    }


    // @ts-ignore
    let errorSource: TErrorSources = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";
    let stack: string | undefined = undefined;


    if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        // @ts-ignore
        errorSource = [...simplifiedError.errorSources]
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        // @ts-ignore
        errorSource = [
            {
                path: '',
                message: err.message
            }
        ]
    } else if (err instanceof Error) {
        message = err.message;
        statusCode = status.INTERNAL_SERVER_ERROR;
        stack = err.stack;
        // @ts-ignore
        errorSource = [
            {
                path: '',
                message: err.message
            }
        ]
    }


    const errorResponse: TErrorResponse = {
        success: false,
        // @ts-ignore
        errorSource,
        message: "Internal server error",
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
        error: envVars.NODE_ENV === "development" ? err : undefined

    }


    console.log(err)
    res.status(statusCode).json(errorResponse)
}