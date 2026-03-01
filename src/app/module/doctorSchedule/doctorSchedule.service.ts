import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {ICreateDoctorSchedulePayload} from "./doctorSchedule.interface";
import {prisma} from "../../lib/prisma";

const createMyDoctorSchedule = async (user: IRequestUser, payload: ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
        doctorId: doctorData.id,
        scheduleId,
    }));

    const result = await prisma.doctorSchedules.createMany({
        data: doctorScheduleData,
    });

    return result;
}

const getMyDoctorSchedules = async () => {
}
const getAllDoctorSchedules = async () => {
}
const getDoctorScheduleById = async () => {
}
const updateMyDoctorSchedule = async (user: IRequestUser, payload: ICreateDoctorSchedulePayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const deleteIds = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id);
    const createIds = payload.scheduleIds.filter(schedule => !schedule.shouldDelete).map(schedule => schedule.id);
    const result = await prisma.$transaction(async (tx) => {

        await tx.doctorSchedules.deleteMany({
            where: {
                isBooked: false,
                doctorId: doctorData.id,
                scheduleId: {
                    in: deleteIds
                }
            }
        });

        const doctorScheduleData = createIds.map((scheduleId) => ({
            doctorId: doctorData.id,
            scheduleId
        }))

        const result = await tx.doctorSchedules.createMany({
            data: doctorScheduleData
        });

        return result;
    })
    return result;
}
const deleteMyDoctorSchedule = async () => {
}

export const DoctorScheduleService = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule,
}