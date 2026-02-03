# Chit Fund Management System (Demo Version)

This repository contains the **demo version** of a Chit Fund / Micro-Finance
Management System designed with **audit safety, financial discipline, and
security-first principles**.

> ⚠️ This is a **DEMO repository** intended for learning, architecture
> demonstration, and portfolio review.
>  
> A separate production version will be maintained with stricter controls.

---

## Key Characteristics

- Financial-system design (not a CRUD demo)
- Manual-first data entry (no auto calculations)
- Audit-safe architecture
- Role-based access (Admin / User)
- Backend as single source of truth
- No customer login (customers are data subjects)

---

## Architecture & Design

This project follows a **design-first approach**.

Before any code was written, the following documents were finalized and committed:

📁 **Architecture Documentation**  
`docs/architecture/`

- `SaaS.md` — System context, actors, and trust boundaries
- `Architecture.md` — Application and backend architecture

These documents form the **design baseline** of the system.

---

## Technology Stack (Planned)

- Backend: Spring Boot
- Frontend: React
- Database: MySQL
- Authentication: JWT
- Architecture: Modular Monolith

---

## Development Strategy

This repository uses two logical versions:

- **Demo Version** (this repo)
  - Clean architecture
  - Limited data
  - Safe for public GitHub

- **Production Version**
  - Full audit enforcement
  - Month lifecycle locks
  - Strict correction workflows

---

## Status

🟢 Architecture finalized  
🟡 Backend development starting  
⚪ Frontend pending  

---

## Disclaimer

This software is **not production-ready** and is **not intended for real financial use**
in its demo form.

---

**Author:** Sudhakar Kalathi  

# Backend – Chit Fund Management System (Demo)

This backend is part of the **demo version** of a Chit Fund / Micro-Finance
Management System.

## Purpose
- Demonstrate clean architecture
- Enforce audit-first design
- Separate roles (Admin / User)
- Avoid early coupling to database

## Current State
- Spring Boot project scaffolded
- No database integration yet
- No business logic implemented
- Runtime startup not enforced at this stage

## Design Principles
- Backend is the single source of truth
- Financial data is append-only
- No silent updates
- Security enforced server-side
- Database introduced intentionally later

## Next Steps
- Security baseline
- API contract definitions
- Audit model
- Database integration (MySQL)
