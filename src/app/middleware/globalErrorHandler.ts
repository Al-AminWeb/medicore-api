import {NextFunction, Request, Response} from "express";
import {envVars} from "../config/env";
import status from "http-status";
import {TErrorResponse, TErrorSources} from "../interfaces/error.interfaces";
import z from "zod";
import {handleZodError} from "../errorHelper/handleZodError";
import AppError from "../errorHelper/AppError";
import {deleteFileFromCloudinary} from "../config/cloudinary.config";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {

    // DEBUG: Log error type and details
    console.log("========== GLOBAL ERROR HANDLER ==========");
    console.log("Error Type:", typeof err);
    console.log("Error Constructor:", err?.constructor?.name);
    console.log("Is ZodError:", err instanceof z.ZodError);
    console.log("Is AppError:", err instanceof AppError);
    console.log("Is Error:", err instanceof Error);
    console.log("Raw Error:", err);
    console.log("==========================================");

    if (envVars.NODE_ENV === "development") {
        console.log("Full Error:", err);
    }
    if(req.file){
        await deleteFileFromCloudinary(req.file.path)
    }

    if(req.files && Array.isArray(req.files) && req.files.length > 0){
        const imageUrls = req.files.map((file) => file.path);
        await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)));
    }


    // FIX: Initialize as array, not single object
    let errorSources: TErrorSources[] = [];
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = "Internal server error";
    let stack: string | undefined = undefined;

    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
        console.log("✅ Handling as ZodError");
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources || [];
        stack = err.stack;

        // Handle custom AppError
    } else if (err instanceof AppError) {
        console.log("✅ Handling as AppError");
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [{
            path: '',
            message: err.message
        }];

        // Handle generic JavaScript errors
    } else if (err instanceof Error) {
        console.log("✅ Handling as generic Error");
        message = err.message;
        statusCode = status.INTERNAL_SERVER_ERROR;
        stack = err.stack;
        errorSources = [{
            path: '',
            message: err.message
        }];

        // Handle unknown error types (strings, objects, etc.)
    } else {
        console.log("⚠️ Handling as unknown error type");
        message = String(err) || "Unknown error occurred";
        errorSources = [{
            path: '',
            message: message
        }];
    }

    // DEBUG: Log final values
    console.log("========== FINAL ERROR RESPONSE ==========");
    console.log("statusCode:", statusCode);
    console.log("message:", message);
    console.log("errorSources:", errorSources);
    console.log("==========================================");

    // FIX: Use the message variable, not hardcoded string
    const errorResponse: TErrorResponse = {
        success: false,
        errorSources,  // Fixed: removed @ts-ignore
        message: message,  // Fixed: use variable, not hardcoded
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
        error: envVars.NODE_ENV === "development" ? err : undefined
    };

    res.status(statusCode).json(errorResponse);
};