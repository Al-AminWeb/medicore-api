import {ICreateDoctorPayload} from "./user.interface";
import {prisma} from "../../lib/prisma";
import {Role, Specialty} from "../../../generated/prisma/client";
import {auth} from "../../lib/auth";


const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialities: Specialty[] = []
    for (const specialtyId of payload.specialties) {
        const speciality = await prisma.specialty.findUnique({where: {id: specialtyId}})
        if (!speciality) {
            throw new Error("Speciality not found")
        }
        specialities.push(speciality)
    }
    const userExist = await prisma.user.findUnique({where: {email: payload.doctor.email}})
    if (userExist) {
        throw new Error("User already exist")
    }

    const userData = await auth.api.signUpEmail({
        body:{
            email: payload.doctor.email,
            password: payload.password,
            role:Role.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true,
        }
    })

    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                }
            })
            const doctorSpecialtyData = specialities.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialtyId: specialty.id,
                }
            })
            await tx.doctorSpecialty.createMany({
                data: doctorSpecialtyData
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    specialties: {
                        select: {
                            specialty: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            })

            return doctor;
        })
    }


    catch (error) {
        console.log("Transaction error:", error)
        await prisma.user.delete({where: {id: userData.user.id}})
    }
}


export const userService = {
    createDoctor
}