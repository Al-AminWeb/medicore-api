import {catchAsync} from "../../shared/catchAsync";
import {Request, Response} from "express";
import {doctorService} from "./doctor.service";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";


const getAllDoctors = catchAsync(
    async (req: Request, res: Response) => {
        const result = await doctorService.getAllDoctors();  // Crashes here if undefined
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctors fetched successfully",
            data: result
        })
    }
)
export const doctorController = {
    getAllDoctors
}