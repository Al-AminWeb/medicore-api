import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {ICreatePrescriptionPayload} from "./prescription.interface";
import {prisma} from "../../lib/prisma";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import {Role} from "../../../generated/prisma/enums";

const givePrescription = async (user: IRequestUser, payload: ICreatePrescriptionPayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })

    if (appointmentData.doctorId !== doctorData.id) {
        throw new AppError(status.BAD_REQUEST, "You can only give prescription for your own appointments");
    }
    const isAlreadyPrescribed = await prisma.prescription.findFirst({
        where: {
            appointmentId: payload.appointmentId
        }
    });

}
const myPrescriptions = async (user: IRequestUser) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: user?.email
        }
    })
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "Only patients can view their prescriptions");
    }

    if (isUserExist.role === Role.DOCTOR) {
        const prescriptions = await prisma.prescription.findMany({
            where: {
                doctor: {
                    email: user?.email
                }
            },
            include: {
                patient: true,
                doctor: true,
                appointment: true,
            }
        })
        return prescriptions;
    }
}

const getAllPrescriptions = async () => {
    const result = await prisma.prescription.findMany({
        include: {
            patient: true,
            doctor: true,
            appointment: true,
        }
    })
    return result;
}
const updatePrescription = async () => {
}
const deletePrescription = async () => {
}

export const PrescriptionService = {
    givePrescription,
    myPrescriptions,
    getAllPrescriptions,
    updatePrescription,
    deletePrescription,
}