import {prisma} from "../../lib/prisma";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    })
    return doctors;
}

export const doctorService = {
    getAllDoctors
}
//TODO get doctor by id
//TODO update doctor using zod update doctor zod schema
//TODO delete doctor