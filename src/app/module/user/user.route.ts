
import {Router} from "express";
import {userController} from "./user.controller";

const routes = Router()

routes.post("/create-doctor", userController.createDoctor)

export const userRoute = routes