// import {catchAsync} from "../../shared/catchAsync";
// import {sendResponse} from "../../shared/sendResponse";
// import status from "http-status";
//
// const createSchedule = catchAsync(
//     async (req, res) => {
//         const payload = req.body;
//         const schedule = await scheduleService.createSchedule(payload);
//         sendResponse(res, {
//             success: true,
//             message: "Schedule created successfully",
//             data: schedule,
//             httpStatusCode: status.CREATED
//         })
//     }
// )
//
//
// const getAllSchedule = catchAsync(
//     async (req, res) => {
//         const schedule = await scheduleService.getAllSchedule();
//         sendResponse(res, {
//             success: true,
//             message: "Schedule fetched successfully",
//             data: schedule,
//             httpStatusCode: status.OK
//         })
//     }
// )
//
// const getScheduleById = catchAsync(
//     async (req, res) => {
//         const {id} = req.params;
//         const schedule = await scheduleService.getScheduleById(id);
//         sendResponse(res, {
//             success: true,
//             message: "Schedule fetched successfully",
//             data: schedule,
//             httpStatusCode: status.OK
//         })
//     }
// )
//
// const updateSchedule = catchAsync(
//     async (req, res) => {
//         const {id} = req.params;
//         const payload = req.body;
//         const schedule = await scheduleService.updateSchedule(id, payload);
//         sendResponse(res, {
//             success: true,
//             message: "Schedule updated successfully",
//             data: schedule,
//             httpStatusCode: status.OK
//         })
//     }
// )
//
// const deleteSchedule = catchAsync(
//     async (req, res) => {
//         const {id} = req.params;
//         const schedule = await scheduleService.deleteSchedule(id);
//         sendResponse(res, {
//             success: true,
//             message: "Schedule deleted successfully",
//             httpStatusCode: status.NO_CONTENT,
//             data: schedule
//         })
//     }
// )
//
//
// export const scheduleController = {
//     getAllSchedule,
//     getScheduleById,
//     createSchedule,
//     updateSchedule,
//     deleteSchedule,
// }


const createSchedule = async () => {
}

const getAllSchedules = async () => {
}
const getScheduleById = async () => {
}
const updateSchedule = async () => {
}
const deleteSchedule = async () => {
}

export const scheduleService = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
}