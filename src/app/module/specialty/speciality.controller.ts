import {specialityService} from "./speciality.service";
import {Request, Response} from "express";
import {catchAsync} from "../../shared/catchAsync";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";


const createSpeciality = catchAsync(

    async (req: Request, res: Response) => {
        console.log(req.body)
        const payload = {
            ...req.body,
            icon: req.file?.path
        }
        const result = await specialityService.createSpeciality(payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality created successfully",
            data: result,
        })
    });


const getAllSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const specialities = await specialityService.getAllSpeciality();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality fetched successfully",
            data: specialities
        })
    })


const deleteSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await specialityService.deleteSpeciality(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality deleted successfully",
            data: result
        })
    })


const updateSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const payload = req.body;
        const result = await specialityService.updateSpeciality(id as string, payload);
        sendResponse(res,{
            httpStatusCode: status.OK,
            success: true,
            message: "Speciality updated successfully",
            data: result
        })
    })

export const specialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    updateSpeciality

}