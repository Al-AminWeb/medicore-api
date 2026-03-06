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

const getAllReviews = catchAsync(
    async (req: Request, res: Response) => {
        const result = await reviewService.getAllReviews();
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: "Reviews fetched successfully",
            data: result
        })
    }
)

const myReviews = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await reviewService.myReviews(user);
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: "Reviews retrieval successfully",
        })
    })


const updateReview = catchAsync(async (req: Request, res: Response) => {
        const user = req.user;
        const reviewId = req.params.id;
        const payload = req.body;

        const result = await reviewService.updateReview(user, reviewId as string, payload);
        sendResponse(res, {
            httpStatusCode: httpStatus.OK,
            success: true,
            message: 'Review updated successfully',
            data: result
        });
    }
);

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const reviewId = req.params.id;
    const result = await reviewService.deleteReview(user, reviewId as string);
    sendResponse(res, {
        httpStatusCode: httpStatus.OK,
        success: true,
        message: 'Review deleted successfully',
        data: result
    });
});

export const ReviewController = {
    getAllReviews,
    giveReview,
    myReviews,
    updateReview,
    deleteReview
}