import {catchAsync} from "../../shared/catchAsync";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";
import {Request, Response} from "express";
import {scheduleService} from "./schedule.service";

const createSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const schedule = await scheduleService.createSchedule();
        sendResponse(res, {
            success: true,
            message: "Schedule created successfully",
            data: schedule,
            httpStatusCode: status.CREATED
        })
    }
)


const getAllSchedules = catchAsync(
    async (req: Request, res: Response) => {
        const schedule = await scheduleService.getAllSchedules();
        sendResponse(res, {
            success: true,
            message: "Schedule fetched successfully",
            data: schedule,
            httpStatusCode: status.OK
        })
    }
)

const getScheduleById = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const schedule = await scheduleService.getScheduleById();
        sendResponse(res, {
            success: true,
            message: "Schedule fetched successfully",
            data: schedule,
            httpStatusCode: status.OK
        })
    }
)

const updateSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const payload = req.body;
        const schedule = await scheduleService.updateSchedule();
        sendResponse(res, {
            success: true,
            message: "Schedule updated successfully",
            data: schedule,
            httpStatusCode: status.OK
        })
    }
)

const deleteSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const {id} = req.params;
        const schedule = await scheduleService.deleteSchedule();
        sendResponse(res, {
            success: true,
            message: "Schedule deleted successfully",
            httpStatusCode: status.NO_CONTENT,
            data: schedule
        })
    }
)


export const scheduleController = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
}