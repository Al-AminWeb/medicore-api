import {catchAsync} from "../../shared/catchAsync";
import {Request, Response} from "express";
import {sendResponse} from "../../shared/sendResponse";
import {reviewService} from "./review.service";
import httpStatus from "http-status";

const giveReview = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const user = req.user;
        const result = await reviewService.giveReview(user, payload);
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: "Review given successfully",
            data: result
        })
    }
)

export const ReviewController = {
    getAllReviews,
    giveReview,
    myReviews,
    updateReview,
    deleteReview
}