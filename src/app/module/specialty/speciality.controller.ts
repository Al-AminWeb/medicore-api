import {specialityService} from "./speciality.service";
import {Request, Response} from "express";
import {prisma} from "../../lib/prisma";


const createSpeciality = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await specialityService.createSpeciality(payload);
        res.status(201).json({
            success: true,
            message: "Speciality created successfully",
            data: result
        });
    } catch (err:any) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Failed to create speciality",
            error: err.message
        })
    }
}


const getAllSpeciality = async (req: Request, res: Response) => {
    try {
        const specialities = await specialityService.getAllSpeciality();
        res.status(200).json({
            success: true,
            data: specialities
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch specialities"
            }
        )
    }
}

const deleteSpeciality = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const result = await specialityService.deleteSpeciality(id as string);
        res.status(200).json({
            success: true,
            message: "Speciality deleted successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(
            {
                success: false,
                message: "Failed to fetch specialities"
            }
        )
    }
}

export const specialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality

}