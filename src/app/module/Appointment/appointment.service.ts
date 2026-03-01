import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {IBookAppointmentPayload} from "./appointment.interface";
import {prisma} from "../../lib/prisma";
import {uuidv7} from "zod";

const bookAppointment = async (payload:IBookAppointmentPayload, user:IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where:{
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where : {
            id : payload.scheduleId,
        }
    });

    const doctorSchedule= await prisma.doctorSchedules.findUniqueOrThrow({
        where:{
           doctorId_scheduleId: {
               scheduleId: payload.scheduleId,
               doctorId: doctorData.id,
           }
        }
    });

    const videoCallingId = String(uuidv7())


    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data:{
                doctorId:payload.doctorId,
                patientId:patientData.id,
                scheduleId:doctorSchedule.scheduleId,
                videoCallingId,
            }
        })
        await tx.doctorSchedules.update({
            where:{
                doctorId_scheduleId:{
                    doctorId:payload.doctorId,
                    scheduleId:doctorSchedule.scheduleId,
                }
            },
            data:{
                isBooked:true,
            }
        });

        return appointmentData;
    });
    return result;

}
const getMyAppointments = async (user:IRequestUser) => {
}
const changeAppointmentStatus = async () => {
}
const getMySingleAppointment = async () => {
}
const getAllAppointments = async () => {
}
const bookAppointmentWithPayLater = async () => {
}
const initiatePayment = async () => {
}

export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
}