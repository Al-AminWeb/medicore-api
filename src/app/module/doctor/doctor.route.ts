
import {Router} from "express";
import {doctorController} from "./doctor.controller";


const routes = Router()

routes.get("/", doctorController.getAllDoctors)

export const doctorRoute = routes