import {specialityService} from "./speciality.service";
import {Request, Response} from "express";


const createSpeciality = async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await specialityService.createSpeciality(payload);
    res.status(201).json({
        success: true,
        message: "Speciality created successfully",
        data: result
    });
}

export const specialityController = {
    createSpeciality
}