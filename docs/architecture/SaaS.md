# SaaS / System Context — Chit Fund Management System

## Purpose
This document explains the SaaS-level system context, actors, and trust boundaries
of the Chit Fund Management System.

This is a financial, audit-sensitive internal system.

---

## System Overview

The Chit Fund Management System is used internally by a chit fund company to:

- Manage customers
- Manage chit groups
- Record monthly chit activity
- Record daily payments (cash truth)
- Maintain debit, credit, and suspense records
- Preserve audit history

The system is manual-first and audit-safe by design.

---

## Actors

| Actor | Description |
|------|------------|
| Admin | Internal staff with create/edit/correct authority |
| User | Internal member with strictly read-only access |
| Customer | Real-world participant (no system login) |

---

## SaaS System Context Diagram (ASCII)

[ Admin / User ]
|
| HTTPS + JWT
v
[ React Frontend ]
|
| REST APIs
v
[ Spring Boot Backend ]
|
| JDBC / ORM
v
[ MySQL Database ]

---

## Trust Boundaries

- Frontend is never trusted
- Backend is the single source of truth
- Database stores immutable financial facts
- Customers do not authenticate

---

## Key SaaS Principles

- No auto calculations
- No derived financial columns
- No silent updates
- All writes are explicit and auditable
- Backend enforces roles and time rules

---

End of document.
