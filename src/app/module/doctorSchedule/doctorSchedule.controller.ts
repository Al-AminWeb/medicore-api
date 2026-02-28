

// router.post("/create-my-doctor-schedule",
//     checkAuth(Role.DOCTOR),
//     DoctorScheduleController.createMyDoctorSchedule);
// router.get("/my-doctor-schedules", checkAuth(Role.DOCTOR), DoctorScheduleController.getMyDoctorSchedules);
// router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorScheduleController.getAllDoctorSchedules);
// router.get("/:doctorId/schedule/:scheduleId", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorScheduleController.getDoctorScheduleById);
// router.patch("/update-my-doctor-schedule",
//     checkAuth(Role.DOCTOR),
//     DoctorScheduleController.updateMyDoctorSchedule);
// router.delete("/delete-my-doctor-schedule/:id", checkAuth(Role.DOCTOR), DoctorScheduleController.deleteMyDoctorSchedule);


import {catchAsync} from "../../shared/catchAsync";
import {sendResponse} from "../../shared/sendResponse";
import status from "http-status";

const createMyDoctorSchedule = catchAsync(
    async (req, res) => {
        const payload = req.body;

        sendResponse(res, {
            success: true,
            message:"Doctor schedule created successfully",
            data: payload,
            httpStatusCode: status.CREATED
        })
    }
)

const getMyDoctorSchedules = catchAsync(
    async (req, res) => {
        const payload = req.body;
        sendResponse(res, {
            success: true,
            message:"Doctor schedule fetched successfully",
            data: payload,
            httpStatusCode: status.OK
        })
    }
)

const getAllDoctorSchedules = catchAsync(
    async (req, res) => {
        const payload = req.body;
        sendResponse(res, {
            success: true,
            message:"All doctor schedules fetched successfully",
            data: payload,
            httpStatusCode: status.OK
        })
    }
)

const getDoctorScheduleById = catchAsync(
    async (req , res) => {
        const payload = req.body;
        sendResponse(res, {
            success: true,
            message:"Doctor schedule fetched successfully",
            data: payload,
            httpStatusCode: status.OK
        })
    }
)

const updateMyDoctorSchedule = catchAsync(
    async (req,res) => {
        const payload = req.body;
        sendResponse(res, {
            success: true,
            message:"Doctor schedule updated successfully",
            data: payload,
            httpStatusCode: status.OK
        })
    }
)


const deleteMyDoctorSchedule = catchAsync(
    async (req,res) => {
        const payload = req.body;
        sendResponse(res, {
            success: true,
            message:"Doctor schedule deleted successfully",
            data: payload,
            httpStatusCode: status.OK
        })
    }
)

export const DoctorScheduleController ={
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule,

}