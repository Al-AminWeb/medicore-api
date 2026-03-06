import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {ICreateReviewPayload} from "./review.interface";
import {prisma} from "../../lib/prisma";

const giveReview = async (user: IRequestUser, payload: ICreateReviewPayload) => {
    const patient = await prisma.patient.findUnique({
        where: {
            email: user.email
        }
    })
};

const getAllReviews = async () => {
};

const myReviews = async () => {
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