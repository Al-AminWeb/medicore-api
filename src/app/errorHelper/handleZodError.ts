import status from "http-status";
import z from "zod";
import {TErrorResponse, TErrorSources} from "../interfaces/error.interfaces";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "zod validation error";
    const errorSource: TErrorSources[] = []

    err.issues.forEach(issue => {
        // @ts-ignore
        errorSource.push({

            path: issue.path.join("=>"),
            message: issue.message
        })
    })
    return {
        success: false,
        message,
        // @ts-ignore
        errorSource,
        statusCode
    }
}