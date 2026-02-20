import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { adminService } from "./admin.service";

const getAllAdmins = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminService.getAllAdmins();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admins fetched successfully",
            data: result,
        })
    }
)

const getAdminById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const admin = await adminService.getAdminById(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin fetched successfully",
            data: admin,
        })
    }
)

const updateAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;

        const updatedAdmin = await adminService.updateAdmin(id as string, payload);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin updated successfully",
            data: updatedAdmin,
        })
    }
)

const deleteAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        // @ts-ignore
        const user = req.user;

        const result = await adminService.deleteAdmin(id as string, user);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Admin deleted successfully",
            data: result,
        })
    }

)

export const adminController = {
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    getAdminById,
};