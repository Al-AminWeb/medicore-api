import {Router} from "express";
import {specialityController} from "./speciality.controller";

const router = Router();

router.post("/", specialityController.createSpeciality);
router.get('/', specialityController.getAllSpeciality);
router.delete("/:id", specialityController.deleteSpeciality);
router.patch("/:id",specialityController.updateSpeciality)


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