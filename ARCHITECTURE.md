# System Architecture: Chit Fund Management System

## High-Level Architecture
This application follows a classic **3-Tier Architecture** separating concerns into distinct presentation, business logic, and data storage layers.

### 1. Presentation Layer (Frontend)
- **Framework:** React 18, Vite.
- **Styling:** Tailwind CSS for responsive, utility-first styling.
- **Components & Routing:** Component-driven architecture using React Router DOM v7.
- **State Management:** React Context API for Global Auth State, Local Component State for isolated module views.
- **HTTP Client:** Axios with Interceptor setup to automatically inject JWT Bearer tokens into API headers.

### 2. Application Layer (Backend API)
- **Framework:** Java 17, Spring Boot 3.x.
- **Security:** Spring Security tailored with custom JWT Filters for Stateless Authentication.
- **Controllers (REST):** Maps HTTP routes (`/api/*`) to Service functions.
- **Services (Business Logic):** Houses complex transactional logic (`@Transactional`), calculating daily daybook balances, chit cycle generation, and soft-delete business rules.
- **Mappers & DTOs:** Strict isolation of Entity (Database) models from DTO (Payload) models, manually mapped or logic-injected to ensure no excessive data leakage.

### 3. Data Access Layer (Database)
- **Database:** MySQL 8.x.
- **ORM:** Spring Data JPA / Hibernate.
- **Design:** Relational database normalized with soft-delete flags (`active = true/false`) instead of hard deletions, ensuring referential integrity over historical financial data. Data precision modeled primarily via `BigDecimal` to prevent float rounding errors.

## Security Architecture
- **Stateless Sessions:** The server maintains no session state. All user context is decoded from the JWT per request.
- **Role-Based Access Control (RBAC):** Endpoints specifically check for `ROLE_ADMIN` vs `ROLE_STAFF`. Staff users have read-only or restricted insertion rights, while Admins hold full mutational access.
- **Password Hashes:** Passwords never stored in plain text. utilizing `BCryptPasswordEncoder` (Strength 10+).

## Transactional Integrity
All financial write-operations (generating payouts, recording daybook credits, updating payment balances) occur within `@Transactional` boundaries. If a complex flow fails mid-execution, the entire database transaction is seamlessly rolled back, guaranteeing absolute data consistency (ACID compliance).
