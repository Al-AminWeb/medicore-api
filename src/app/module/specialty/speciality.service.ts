
import {prisma} from "../../lib/prisma";
import {Specialty} from "../../../generated/prisma/client";


const createSpeciality = async (payload: Specialty): Promise<Specialty> => {

    const speciality = await prisma.specialty.create({
        data: payload
    })
    return speciality
}



const getAllSpeciality = async ():Promise<Specialty[]> => {
  const specialities = await prisma.specialty.findMany();
  return specialities
}

const deleteSpeciality = async (id: string):Promise<Specialty> => {
    const speciality = await prisma.specialty.delete({
        where: {id}
    })
    return speciality
}

const updateSpeciality = async (id: string, payload: Specialty):Promise<Specialty> => {
    const speciality = await prisma.specialty.update({
        where: {id},
        data: payload
    })
    return speciality
}
export const specialityService = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality,
    updateSpeciality
}