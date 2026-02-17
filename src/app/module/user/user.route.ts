
import {Router} from "express";
import {userController} from "./user.controller";
import {createDoctorZodSchema} from "./user.validation";
import {validateRequest} from "../../middleware/validateRequest";

const routes = Router()

routes.post("/create-doctor", validateRequest(createDoctorZodSchema),userController.createDoctor)

export const userRoute = routes