import {Specialty} from "../../../generated/prisma/client";
import {prisma} from "../../lib/prisma";


const createSpeciality = async (payload: Specialty): Promise<Specialty> => {

    const speciality = await prisma.specialty.create({
        data: payload
    })
    return speciality

}

export const specialityService = {
    createSpeciality
}