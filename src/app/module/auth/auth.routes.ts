import {Router} from "express";
import {authController} from "./auth.controller";
import {checkAuth} from "../../middleware/checkAuth";
import {Role} from "../../../generated/prisma/enums";


const router = Router();

router.post('/register',authController.registerPatient)
router.get('/login',authController.loginUser)
router.get('/me',checkAuth(Role.ADMIN,Role.DOCTOR,Role.PATIENT,Role.SUPER_ADMIN),authController.getMe)
router.post("/refresh-token", authController.getNewToken)
router.post("/change-password", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), authController.changePassword)
router.post("/logout", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), authController.logOut)


export const authRoutes = router;