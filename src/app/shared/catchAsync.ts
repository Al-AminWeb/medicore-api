// Disable ESLint warning for using 'any' type (needed for error handling)
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import Express types for type safety
import {NextFunction, Request, RequestHandler, Response} from "express";

// Export catchAsync utility that wraps async route handlers
export const catchAsync = (fn: RequestHandler) => {
    // Return a new async function that Express will call
    return async (req: Request, res: Response, next: NextFunction) => {
        // Try to execute the original handler
        try {
            // Await the original function with req, res, next parameters
            await fn(req, res, next);
            // Catch any error thrown by the original function
        } catch (error: any) {
            next(error)

        }
    }
}
