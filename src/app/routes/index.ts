import {Router} from "express";
import {specialityRoute} from "../module/specialty/speciality.route";
import {authRoutes} from "../module/auth/auth.routes";


const router = Router();

router.use("/specialities", specialityRoute)
router.use('/auth',authRoutes)


export const indexRoute = router;