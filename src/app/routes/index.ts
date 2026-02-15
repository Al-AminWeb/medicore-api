import {Router} from "express";
import {specialityRoute} from "../module/specialty/speciality.route";


const router = Router();

router.use("/specialities", specialityRoute)

export const indexRoute = router;