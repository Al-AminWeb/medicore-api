import {NextFunction, Request, Response} from "express";
import {envVars} from "../config/env";
import status from "http-status";
import {TErrorResponse, TErrorSources} from "../interfaces/error.interfaces";
import z from "zod";
import {handleZodError} from "../errorHelper/handleZodError";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("Error From Global Error Handler:", err)
    }


    // @ts-ignore
    let errorSource: TErrorSources = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";

    if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        // @ts-ignore
        errorSource = [...simplifiedError.errorSources]

    }


    const errorResponse: TErrorResponse = {
        success: false,
        // @ts-ignore
        errorSource,
        message: "Internal server error",
        error: envVars.NODE_ENV === "development" ? err : undefined
    }


    console.log(err)
    res.status(500).json(errorResponse)
}