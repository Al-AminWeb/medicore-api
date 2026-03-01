import {Request, Response} from "express";
import status from "http-status";
import {IQueryParams} from "../../interfaces/query.interface";
import {catchAsync} from "../../shared/catchAsync";
import {sendResponse} from "../../shared/sendResponse";
import {scheduleService} from "./schedule.service";


const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const schedule = await scheduleService.createSchedule(payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await scheduleService.getAllSchedules();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedules retrieved successfully',
        data: result

    });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const schedule = await scheduleService.getScheduleById();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;
    const payload = req.body;
    const updatedSchedule = await scheduleService.updateSchedule();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
        const {id} = req.params;
        await scheduleService.deleteSchedule();
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: 'Schedule deleted successfully',
        });
    }
);

export const scheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}