# 🏥 PH-HealthCare Backend

A production-grade healthcare management system backend built with modern web technologies. This system enables secure interaction between patients, doctors, and administrators with full appointment lifecycle management, payment integration, medical record handling, and role-based access control.

---

## 📌 Project Overview

PH-HealthCare is a scalable RESTful API designed to support:

* Multi-role authentication & authorization
* Appointment scheduling & lifecycle management
* Payment processing
* Medical record & report storage
* Doctor availability management
* Role-based data ownership enforcement
* Secure session management
* Audit logging & soft delete strategy
* Performance optimization with caching

The system follows enterprise-grade architecture and security best practices.

---

# 🏗 System Architecture

### Architecture Pattern

Layered Architecture:

```
Controller → Service → Repository → Database
```

### API Design

* RESTful
* JSON-based payloads
* Token-based authentication (JWT)
* Stateless with session tracking

---

# 🛠 Technology Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Runtime        | Node.js                              |
| Framework      | Express.js                           |
| Language       | TypeScript                           |
| Database       | PostgreSQL                           |
| ORM            | Prisma                               |
| Cache          | Redis                                |
| Authentication | Better Auth / JWT                    |
| Validation     | Zod                                  |
| Logging        | Winston                              |
| Payment        | Stripe                               |
| File Storage   | AWS S3 (or compatible cloud storage) |

---

# 👥 User Roles

The system supports hierarchical role-based access control:

1. **SUPER_ADMIN**

   * Full system access
   * Manage admins, doctors, patients, specialties
   * View system logs

2. **ADMIN**

   * Manage doctors & patients
   * View reports
   * Limited system control

3. **DOCTOR**

   * Manage own schedule
   * View assigned patients
   * Write prescriptions
   * Access patient health data (authorized only)

4. **PATIENT**

   * Book appointments
   * Upload medical reports
   * View prescriptions
   * Manage personal health data

---

# 🔐 Authentication Module

## Features

* Email registration with verification
* Secure password hashing (bcrypt)
* Password reset with token expiration
* Change password with password history enforcement
* Session tracking (IP + user agent)
* Concurrent session limit
* Logout (single & all devices)
* Account status management (PENDING / ACTIVE / BLOCKED / DELETED)
* Rate limiting for login & reset attempts

---

# 🛡 Role-Based Access Control (RBAC)

* Role validation on every request
* Ownership-based access enforcement
* Admin override capability
* Service-layer ownership validation
* Middleware-based route protection

Example:

```ts
router.get(
  "/appointments",
  authenticate,
  authorize(["SUPER_ADMIN", "ADMIN"]),
  controller.getAll
);
```

---

# 👨‍⚕️ Doctor Management

## Capabilities

* Create doctor profile (admin only)
* Multiple specialty support
* License validation
* Fee management
* Experience tracking
* Rating & review system (read-only fields)
* Soft delete with audit trail
* Caching for doctor listing & profile

### Filtering & Sorting

* Specialty
* Gender
* Experience range
* Fee range
* Average rating
* Name search

---

# 👤 Patient Management

## Features

* Profile update
* Health data management (BMI auto-calculated)
* Medical report upload (PDF/JPG/PNG)
* Cloud storage integration
* Report access control
* Audit trail for health data

### Health Data Validation

* DOB age range enforcement
* Height/Weight validation
* Automatic BMI calculation
* Risk indicator support

---

# 🗓 Schedule Management

Doctors can:

* Create schedule slots
* Prevent overlapping schedules
* Bulk create availability
* Update schedule (if not booked)
* Soft delete schedule
* Cache availability

Constraints:

* No overlapping time slots
* Cannot modify booked schedules
* Minimum & maximum slot duration enforced

---

# 📅 Appointment Management

## Booking Flow

1. Patient selects schedule
2. System validates:

   * Slot availability
   * No double booking
   * Doctor active status
3. Appointment created
4. Schedule marked as booked
5. Payment record initiated

All operations are transactional to prevent race conditions.

---

# 💳 Payment Integration

* Appointment-based fee calculation
* Stripe payment integration
* Payment status tracking
* Pending → Completed → Failed flow
* Secure webhook handling

---

# 📂 Medical Report Management

* File size limit: 10MB
* Allowed formats: PDF, JPG, PNG
* Stored in cloud storage
* Signed URLs (1-hour expiration)
* Virus scan before storage
* Maximum 50 reports per patient
* 7-year retention policy

---

# 🗂 Specialty Management

* Create / update / soft delete
* Unique title validation
* Doctor assignment validation
* Doctor count per specialty
* Public listing endpoint
* Caching enabled

---

# ⚡ Performance & Optimization

* Redis caching
* Paginated endpoints
* Indexed database queries
* Soft-delete filtering
* TTL-based cache invalidation
* Transactional operations for critical flows

---

# 📊 Security Features

* Password hashing with salt
* Token expiration enforcement
* Session invalidation
* Rate limiting
* Role-based authorization
* Ownership validation
* Secure file access
* Audit logging
* Soft-delete strategy for compliance

---

# 🧾 Database Design

Relational data model with:

* One-to-one:

  * User → Profile (Admin/Doctor/Patient)
  * Patient → HealthData
* One-to-many:

  * Doctor → Schedule
  * Patient → Reports
* Many-to-many:

  * Doctor ↔ Specialty
* Transactional constraints for:

  * Appointment booking
  * Schedule booking
  * User creation

---

# 📦 Installation & Setup

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migration
npx prisma migrate dev

# Start development server
npm run dev
```

---

# 🔑 Environment Variables (Example)

```
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
EMAIL_SERVICE_API_KEY=
```

---

# 🧪 Testing

```bash
npm run test
```

* Unit tests for services
* Integration tests for API routes
* Validation testing
* Authentication flow testing

---

# 🚀 Deployment

* Docker container support
* Cloud-native deployment
* Environment-based configuration
* Production logging enabled
* Secure HTTPS configuration required

---

# 📈 Future Enhancements

* Real-time notifications (WebSocket)
* Telemedicine integration
* AI-based health risk analysis
* Advanced reporting dashboard
* Multi-language support

---

