import {specialityService} from "./speciality.service";
import {Request, Response} from "express";
import {catchAsync} from "../../shared/catchAsync";


const createSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await specialityService.createSpeciality(payload);
        res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: result
        });
    }
)


const getAllSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const specialities = await specialityService.getAllSpeciality();
        res.status(200).json({
            success: true,
            data: specialities
        })
    }
)

const deleteSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await specialityService.deleteSpeciality(id as string);
        res.status(200).json({
            success: true,
            message: "Speciality deleted successfully",
            data: result
        })
    }
)

const updateSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const payload = req.body;
        const result = await specialityService.updateSpeciality(id as string, payload);
        res.status(200).json({
            success: true,
            message: "Speciality updated successfully",
            data: result
        })
    }
)

export const specialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    updateSpeciality

}