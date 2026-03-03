import {prisma} from "../lib/prisma";
import {Role} from "../../generated/prisma/enums";
import {auth} from "../lib/auth";
import {envVars} from "../config/env";

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })
        if (isSuperAdminExist) {
            console.log("Super Admin already exist")
            return;
        }


        const superAdminUser = await auth.api.signUpEmail({
            // @ts-ignore
            body: {
                email: envVars.SUPER_ADMIN_EMAIL,
                password: envVars.SUPER_ADMIN_PASSWORD,
                role: Role.SUPER_ADMIN,
                needPasswordChange: false,
                rememberMe: false,
                name: "Super Admin",
            }
        })
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: superAdminUser.user.id
                },
                data: {
                    emailVerified: true,
                }
            });


            await tx.admin.create({
                data: {
                    userId: superAdminUser.user.id,
                    name: "Super Admin",
                    email: envVars.SUPER_ADMIN_EMAIL,
                }
            })
        })
        const superAdmin = await prisma.admin.findFirst({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL
            },
            include: {
                user: true,
            }
        })

        console.log("Super Admin created successfully", superAdmin)


    } catch (error) {
        console.error("Error seeding super admin: ", error);

        // Only try to delete if we know the user exists
        try {
            await prisma.user.delete({
                where: {
                    email: envVars.SUPER_ADMIN_EMAIL,
                }
            });
            console.log("Rolled back partial user creation");
        } catch (deleteError) {
            // User might not exist, which is fine
            if ((deleteError as any).code !== 'P2025') {
                console.error("Error during cleanup:", deleteError);
            }
        }

        throw error; // Re-throw so the server fails to start as intended
    }
}
