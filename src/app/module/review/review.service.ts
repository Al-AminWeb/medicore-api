import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {ICreateReviewPayload} from "./review.interface";
import {prisma} from "../../lib/prisma";
import {PaymentStatus} from "../../../generated/prisma/enums";
import status from "http-status";
import AppError from "../../errorHelper/AppError";

const giveReview = async (user: IRequestUser, payload: ICreateReviewPayload) => {
    const patient = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })

    if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
        // @ts-ignore
        throw new AppError(status.BAD_REQUEST, "You cannot give review for unpaid appointment");
    }

    if (appointmentData.patientId !== patient.id) {
        // @ts-ignore
        throw new AppError(status.BAD_FORBIDDEN, "You cannot give review for other patient's appointment");
    }

    const isReviewed = await prisma.review.findFirst({
        where: {
            appointmentId: payload.appointmentId
        }
    })

    if (isReviewed) {
        throw new AppError(status.BAD_REQUEST, "You have already given review for this appointment")
    }
    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                ...payload,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
            }
        })
        const averageRating = await tx.review.aggregate({
            where: {
                doctorId: appointmentData.doctorId
            },

            _avg: {
                rating: true,
            }
        })

        await tx.doctor.update({
            where:{
                id:appointmentData.doctorId
            },
            data:{
                averageRating: averageRating._avg.rating as number,
            }
        });
        return review;
    });

    return result;
};

const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        include: {
            patient: true,
            doctor: true,
            appointment:true,
        }
    })
    return reviews;
};

const myReviews = async (user:IRequestUser) => {

};

const updateReview = async () => {
};


const deleteReview = async () => {

}


export const reviewService = {
    giveReview,
    getAllReviews,
    myReviews,
    updateReview
};