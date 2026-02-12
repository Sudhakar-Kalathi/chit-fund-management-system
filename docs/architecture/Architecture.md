# Application Architecture — Chit Fund Management System

## Architecture Style

The system uses a **Modular Monolith** architecture:

- One Spring Boot backend
- One MySQL database
- Clear internal module boundaries
- No microservices

This choice prioritizes audit safety and simplicity.

---

## High-Level Architecture

[ React Frontend ]
|
v
[ Spring Boot Backend ]
|
v
[ MySQL Database ]


---

## Backend Modules

### 1. Authentication & Security
- JWT authentication
- Role enforcement (Admin / User)
- Time-based edit restrictions

### 2. Customer Module
- Customer identity management
- Participation tracking
- No financial logic

### 3. Chit Group Module
- Group summary
- Monthly overview
- Customer payment matrix
- Month lifecycle enforcement

### 4. Payments Module
- Date-based payment records
- Canonical cash truth
- Edit window enforcement

### 5. Debit & Credit Module
- Credit / Debit / Suspense entries
- Non-cash adjustments

### 6. Audit Module
- Cross-cutting
- Records who / when / why
- Preserves correction history

---

## Database Philosophy

- Database stores facts, not conclusions
- Financial data is never overwritten
- Corrections are additive
- History is preserved forever

---

## Security & Audit Design

- Backend enforces all rules
- Frontend is read-first
- No hard deletes
- Audit logs are treated as financial records

---

End of document.
