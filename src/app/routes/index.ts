import {Router} from "express";
import {specialityRoute} from "../module/specialty/speciality.route";
import {authRoutes} from "../module/auth/auth.routes";
import {userRoute} from "../module/user/user.route";
import {doctorRoute} from "../module/doctor/doctor.route";


const router = Router();

router.use("/specialities", specialityRoute)
router.use('/auth',authRoutes)
router.use("/users",userRoute)
router.use("/doctors",doctorRoute)


export const indexRoute = router;