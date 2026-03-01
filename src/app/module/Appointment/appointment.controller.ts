

import {catchAsync} from "../../shared/catchAsync";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";
import {AppointmentService} from "./appointment.service";

const bookAppointment = catchAsync(
    async (req, res) => {
        const payload = req.body;
        const user = req.user;
        const appointment = await AppointmentService.bookAppointment(payload, user);
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: 'Appointment booked successfully',
        })
    }
)

const getMyAppointments = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: 'My appointments fetched successfully',
        })
    }
)

const changeAppointmentStatus = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: ' Appointment status changed successfully',
        })
    }
)

const getMySingleAppointment = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: ' My single appointment fetched successfully',
        })
    }
)

const getAllAppointments = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: ' All appointments fetched successfully',
        })
    }
)

const bookAppointmentWithPayLater = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: ' Appointment booked with pay later successfully',
        })
    }
)

const initiatePayment = catchAsync(
    async (req, res) => {
        sendResponse(res, {
            success: true,
            httpStatusCode: status.OK,
            message: ' Payment initiated successfully',
        })
    }
)


export const AppointmentController = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
}