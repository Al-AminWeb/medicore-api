import {catchAsync} from "../../shared/catchAsync";
import {Request, Response} from "express";
import {userService} from "./user.service";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await userService.createDoctor(payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor created successfully",
            data: result
        })
    }
)
export const userController = {
    createDoctor
}