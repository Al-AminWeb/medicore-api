import {NextFunction, Router} from "express";
import {specialityController} from "./speciality.controller";
import {checkAuth} from "../../middleware/checkAuth";
import {Role} from "../../../generated/prisma/enums";
import {multerUpload} from "../../config/multer.config";
import {validateRequest} from "../../middleware/validateRequest";
import {specialtyValidation} from "./speciality.validation";


const router = Router();

router.post("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(specialtyValidation.createSpecialtyZodSchema),
    specialityController.createSpeciality);
router.get('/', specialityController.getAllSpeciality);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), specialityController.deleteSpeciality);
router.patch("/:id", specialityController.updateSpeciality)


export const specialityRoute = router;

/*
* 1. CLIENT sends POST to /api/v1/specialities
   Body: { "title": "Cardiology" }

        ↓

2. ROUTER (speciality.route.ts)
   Matches POST "/" → calls specialityController.createSpeciality

        ↓

3. CONTROLLER (speciality.controller.ts)
   - Extracts req.body → { title: "Cardiology" }
   - Calls specialityService.createSpeciality(payload)
   - Waits for result

        ↓

4. SERVICE (speciality.service.ts)
   - Receives payload
   - Calls prisma.speciality.create({ data: payload })
   - Prisma generates SQL: INSERT INTO specialities (title) VALUES ('Cardiology')
   - Returns created record with auto-generated ID

        ↓

5. CONTROLLER receives result
   - Sends HTTP 201 response:
   {
     success: true,
     message: "Speciality created successfully",
     data: { id: "uuid-123", title: "Cardiology", createdAt: "..." }
   }

        ↓

6. CLIENT receives JSON response
*
*
* */