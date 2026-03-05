import {Router} from "express";
import {specialityRoute} from "../module/specialty/speciality.route";
import {authRoutes} from "../module/auth/auth.routes";
import {userRoute} from "../module/user/user.route";
import {doctorRoute} from "../module/doctor/doctor.route";
import {adminRoutes} from "../module/admin/admin.route";
import { scheduleRoutes } from "../module/schedule/schedule.route";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.route";
import {PatientRoutes} from "../module/patient/patient.route";


const router = Router();
router.use("/specialities", specialityRoute)
router.use('/auth',authRoutes)
router.use("/users",userRoute)
router.use("/patients",PatientRoutes)
router.use("/doctors",doctorRoute)
router.use("/admins", adminRoutes)
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
// router.use("/appointments", AppointmentRoutes)


export const indexRoute = router;