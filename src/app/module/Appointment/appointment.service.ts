import {IRequestUser} from "../../interfaces/requestUser.Interfaces";
import {IBookAppointmentPayload} from "./appointment.interface";
import {prisma} from "../../lib/prisma";
import {uuidv7} from "zod";
import {envVars} from "../../config/env";
import {stripe} from "../../config/stripe.config";
import AppError from "../../errorHelper/AppError";
import {AppointmentStatus, PaymentStatus, Role} from "../../../generated/prisma/enums";
import status from "http-status";
import {QueryBuilder} from "../../utils/queryBuilder";
import {IQueryParams} from "../../interfaces/query.interface";


const bookAppointment = async (payload: IBookAppointmentPayload, user: IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });

    const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });

        //TODO : Payment Integration will be here


        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 120,
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id,
            },

            success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,

            // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
            cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
        })

        return {
            appointmentData,
            paymentData,
            paymentUrl: session.url,
        };
    });

    return {
        appointment: result.appointmentData,
        payment: result.paymentData,
        paymentUrl: result.paymentUrl,
    };
}

const getMyAppointments = async (user: IRequestUser) => {
    //user can be patient or doctor, so we need to check both
    const patientData = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    const doctorData = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    let appointments = [];

    if (patientData) {
        appointments = await prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    } else if (doctorData) {
        appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    } else {
        throw new Error("User not found");
    }

    return appointments;

}

// Main function to change appointment status with role-based permissions
const changeAppointmentStatus = async (
    appointmentId: string,          // Unique ID of the appointment to update
    appointmentStatus: AppointmentStatus,  // New status we want to set (SCHEDULED, INPROGRESS, COMPLETED, CANCELED)
    user: IRequestUser              // Current user trying to make the change (contains email, role, etc.)
) => {
    // Fetch the appointment from database, throw error if not found
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {id: appointmentId},  // Find by appointment ID
        include: {
            doctor: true,   // Include doctor details to check ownership and get email
            patient: true   // Include patient details to check ownership and get email
        }
    });

    // Store current status in variable for easy reference
    const currentStatus = appointmentData.status;

    // ============================================================================
    // RULE 1: Completed or Canceled appointments cannot be updated (terminal states)
    // ============================================================================
    if (currentStatus === AppointmentStatus.COMPLETED ||   // Check if already completed
        currentStatus === AppointmentStatus.CANCELED) {    // Check if already canceled
        throw new AppError(
            status.BAD_REQUEST,                              // 400 status code
            `Cannot update appointment. Already ${currentStatus.toLowerCase()}`  // Error message
        );
    }

    // ============================================================================
    // RULE 2: Doctor permissions - limited status transitions
    // ============================================================================
    if (user?.role === Role.DOCTOR) {  // Check if current user is a doctor

        // Verify this doctor owns the appointment (security check)
        if (user.email !== appointmentData.doctor.email) {
            throw new AppError(
                status.FORBIDDEN,      // 403 status - not authorized
                "Unauthorized"         // Generic message for security
            );
        }

        // Define allowed status transitions for doctors
        const validTransitions = [
            // Format: [currentStatus, newStatus]
            [AppointmentStatus.SCHEDULED, AppointmentStatus.INPROGRESS],   // Start appointment
            [AppointmentStatus.INPROGRESS, AppointmentStatus.COMPLETED],     // Finish appointment
            [AppointmentStatus.SCHEDULED, AppointmentStatus.CANCELED],     // Cancel appointment
        ];

        // Check if requested transition is in the allowed list
        const isValid = validTransitions.some(
            ([from, to]) => from === currentStatus && to === appointmentStatus  // Compare each allowed pair
        );

        // If transition is not allowed, throw error
        if (!isValid) {
            throw new AppError(
                status.BAD_REQUEST,    // 400 status - business logic error
                `Invalid transition: ${currentStatus} → ${appointmentStatus}`  // Show what was attempted
            );
        }
    }

        // ============================================================================
        // RULE 3: Patient permissions - can only cancel their own scheduled appointments
    // ============================================================================
    else if (user?.role === Role.PATIENT) {  // Check if current user is a patient

        // Verify this patient owns the appointment (security check)
        if (user.email !== appointmentData.patient.email) {
            throw new AppError(
                status.FORBIDDEN,      // 403 status - not authorized
                "Unauthorized"         // Generic message for security
            );
        }

        // Patients can ONLY cancel, and ONLY if currently scheduled
        // Check two conditions: trying to cancel AND currently scheduled
        if (appointmentStatus !== AppointmentStatus.CANCELED ||   // Not trying to cancel
            currentStatus !== AppointmentStatus.SCHEDULED) {        // Not currently scheduled
            throw new AppError(
                status.BAD_REQUEST,    // 400 status - business logic error
                "Patients can only cancel scheduled appointments"   // Clear error message
            );
        }
    }

        // ============================================================================
        // RULE 4: Admin/SuperAdmin - unrestricted access to any status
    // ============================================================================
    else if (!(user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN)) {
        // If not doctor, not patient, not admin, and not superadmin = invalid role
        throw new AppError(
            status.FORBIDDEN,          // 403 status
            "Invalid role"             // Unknown role trying to access
        );
    }
    // If we reach here, user is Admin or SuperAdmin - no restrictions apply
    // They can change any status to any other status (including reverse transitions)

    // ============================================================================
    // All validation passed - perform the actual database update
    // ============================================================================
    return prisma.appointment.update({
        where: {id: appointmentId},    // Find the appointment by ID
        data: {status: appointmentStatus}  // Set the new status
    });
    // Returns the updated appointment object
};


// Refactored: Single query approach using query builder pattern
// No need to fetch patient/doctor separately - we query appointment directly with user email
const getMySingleAppointment = async (appointmentId: string, user: IRequestUser) => {

    // Build where clause dynamically based on user role
    // This avoids 2 extra database calls (no patientData/doctorData lookups needed)
    const whereClause: any = {
        id: appointmentId,  // Must match this appointment ID
    };

    // Add role-based ownership filter directly to query
    if (user?.role === Role.PATIENT) {
        // Patients: filter by patient email through relation
        // Prisma allows filtering on related fields using nested syntax
        whereClause.patient = {
            email: user.email  // Appointment's patient must have this email
        };
    } else if (user?.role === Role.DOCTOR) {
        // Doctors: filter by doctor email through relation
        whereClause.doctor = {
            email: user.email  // Appointment's doctor must have this email
        };
    } else if (user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) {
        // Admins: no ownership filter, they can view any appointment
        // whereClause remains just { id: appointmentId }
    } else {
        // Unknown role: reject immediately
        throw new AppError(status.FORBIDDEN, "Invalid user role");
    }

    // Single database query with dynamic where clause
    // Includes both doctor and patient data regardless of who is viewing
    const appointment = await prisma.appointment.findFirst({
        where: whereClause,           // Combined filter: ID + ownership (if applicable)
        include: {
            doctor: true,             // Always include doctor details
            patient: true,            // Always include patient details
            schedule: true,           // Always include schedule details
            payment: true,            // Bonus: include payment if needed
        }
    });

    // If no result: either appointment doesn't exist OR user doesn't own it
    // We don't reveal which one (security best practice - don't leak existence)
    if (!appointment) {
        throw new AppError(
            status.NOT_FOUND,
            "Appointment not found or unauthorized"  // Generic message
        );
    }

    return appointment;
};

// Get all appointments with full query builder support
// Supports: filtering, searching, sorting, pagination, field selection, dynamic includes
const getAllAppointments = async (queryParams: IQueryParams) => {

    // Define which fields can be searched with text search
    // These support partial text matching (contains, case-insensitive)
    const searchableFields = [
        'patient.name',           // Search by patient name
        'patient.email',          // Search by patient email
        'doctor.name',            // Search by doctor name
        'doctor.email',           // Search by doctor email
        'schedule.startDateTime', // Search by schedule date/time
    ];

    // Define which fields can be used for exact/range filtering
    // These support operators like [lt], [gt], [equals], etc.
    const filterableFields = [
        'status',                 // Filter by appointment status
        'paymentStatus',          // Filter by payment status
        'doctorId',               // Filter by specific doctor
        'patientId',              // Filter by specific patient
        'scheduleId',             // Filter by specific schedule
        'createdAt',              // Filter by date range [lt], [gt]
        'updatedAt',              // Filter by update date range
        'patient.name',           // Filter by exact patient name
        'doctor.specialty',       // Filter by doctor specialty
    ];

    // Create QueryBuilder instance for Appointment model
    // Pass queryParams from request and configuration object
    const queryBuilder = new QueryBuilder(
        prisma.appointment,       // Prisma model delegate
        queryParams,              // Query parameters from request (searchTerm, filters, etc.)
        {                         // Configuration object
            searchableFields,     // Fields that support text search
            filterableFields,     // Fields that support filtering
        }
    );

    // Build and execute the query with method chaining
    // Each method returns 'this' allowing fluent interface
    const result = await queryBuilder
        .search()                 // Apply text search if searchTerm provided (searches searchableFields)
        .filter()                 // Apply filters from query params (excludes pagination/sort fields)
        .sort()                   // Apply sorting (default: createdAt desc, or from sortBy/sortOrder params)
        .paginate()               // Apply pagination (default: page 1, limit 10)
        .fields()                 // Apply field selection if 'fields' param provided (e.g., fields=id,status)
        .dynamicInclude(          // Configure which relations to include based on 'include' param
            {                     // Available relations configuration
                doctor: {         // Doctor relation include config
                    include: {
                        user: true,      // Include doctor's user details
                        specialties: {   // Include doctor's specialties
                            include: {
                                specialty: true  // Include specialty details
                            }
                        }
                    }
                },
                patient: {        // Patient relation include config
                    include: {
                        user: true       // Include patient's user details
                    }
                },
                schedule: true,    // Simple include for schedule
                payment: true,     // Simple include for payment
                prescription: {  // Include prescriptions if requested
                    include: {
                        medicines: true  // Include prescribed medicines
                    }
                },
                review: true,      // Include reviews if requested
            },
            ['doctor', 'patient', 'schedule']  // Default includes (always included unless fields() used)
        )
        .execute();               // Execute both count() and findMany() in parallel, return paginated result

    // Result structure:
    // {
    //   data: [appointments],     // Array of appointment objects
    //   meta: {
    //     page: 1,                  // Current page number
    //     limit: 10,                // Items per page
    //     total: 100,               // Total matching records
    //     totalPages: 10            // Calculated total pages
    //   }
    // }

    return result;
};

const bookAppointmentWithPayLater = async (payload: IBookAppointmentPayload, user: IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });

    const scheduleData = await prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });

    const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });

    const videoCallingId = String(uuidv7());

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });

        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            }
        });

        return {
            appointment: appointmentData,
            payment: paymentData
        };

    });

    return result;
}

const initiatePayment = async (appointmentId: string, user: IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            patientId: patientData.id,
        },
        include: {
            doctor: true,
            payment: true,
        }
    });

    if (!appointmentData) {
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    if (!appointmentData.payment) {
        throw new AppError(status.NOT_FOUND, "Payment data not found for this appointment");
    }

    if (appointmentData.payment?.status === PaymentStatus.PAID) {
        throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment");
    }
    ;

    if (appointmentData.status === AppointmentStatus.CANCELED) {
        throw new AppError(status.BAD_REQUEST, "Appointment is canceled");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Appointment with Dr. ${appointmentData.doctor.name}`,
                    },
                    unit_amount: appointmentData.doctor.appointmentFee * 100,
                },
                quantity: 1,
            }
        ],
        metadata: {
            appointmentId: appointmentData.id,
            paymentId: appointmentData.payment.id,
        },

        success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,

        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    })

    return {
        paymentUrl: session.url,
    }
}


const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unpaidAppointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinutesAgo,
            },
            paymentStatus: PaymentStatus.UNPAID,
        }
    });

    const appointmentToCancel = unpaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {
        // @ts-ignore
        await tx.appointment.updateMany({
            where: {
                id: {
                    in: appointmentToCancel
                },
                // @ts-ignore
                data: {
                    status: AppointmentStatus.CANCELED,
                },
            },

        })
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentToCancel
                }
            }
        })


        for (const unpaidAppointment of unpaidAppointments) {
            await tx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unpaidAppointment.doctorId,
                        scheduleId: unpaidAppointment.scheduleId,
                    }
                },
                data: {
                    isBooked: false,
                }
            })
        }
    })
}


export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments
}