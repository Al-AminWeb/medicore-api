import {Router} from "express";
import {authController} from "./auth.contoleer";


const router = Router();

router.post('/register',authController.registerPatient)

export const authRoutes = router;