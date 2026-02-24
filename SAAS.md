# SaaS Transformation Roadmap

Converting this single-tenant application into a **Multi-Tenant SaaS (Software as a Service)** product is a natural next step for scaling to multiple Chit Fund agencies. Below is a structured guide on how to architect this transformation.

## 1. Multi-Tenancy Data Architecture
To serve multiple isolated companies, you must adopt a multi-tenant strategy.
- **Recommendation:** Shared Database, Shared Schema with `Tenant ID`.
- **Implementation:** Add a `tenant_id` column to every domain entity (`Customer`, `ChitGroup`, `Payment`, `User`, etc.). 
- **Hibernate Integration:** Use Hibernate's `@Filter` or Hibernate 6's `@TenantId` annotation to automatically append `WHERE tenant_id = ?` to all database queries transparently.

## 2. Authentication & Tenant Resolution
- During Login, identify the user's Tenant via their subdomain (e.g., `company1.chitfund.com`) or via a Tenant Code in the login form.
- Embed the `tenant_id` inside the JWT Token payload.
- Every API request subsequently extracts the `tenant_id` from the JWT and injects it into the Spring Security Context / Hibernate Tenant Context.

## 3. Subscription & Billing Integration
- **Stripe / Razorpay:** Integrate a billing provider.
- **Plans:** Define Tiers (e.g., *Basic*: 5 Groups, *Pro*: Unlimited Groups).
- **Enforcement:** Introduce a `SubscriptionFilter` or aspect (`@CheckQuota`) to block `POST` requests if a tenant exceeds their plan limits or their subscription lapses.

## 4. Super Admin Dashboard
- Create a distinct `ROLE_SUPER_ADMIN` overarching the entire system.
- Build a separate React interface (or hidden routes) where you (the SaaS owner) can:
    - View all registered Tenants/Agencies.
    - Manually adjust subscription states.
    - View gross overarching platform analytics.

## 5. Whitelabeling (Custom Branding)
- Add a `TenantProfile` entity tracking Agency Name, Logo URL, and Primary Theme Color.
- On the Frontend, fetch the `TenantProfile` on App load, dynamically injecting the logo into the Navbar and updating CSS CSS Variables (e.g., replacing standard Indigo with the Tenant's brand color).

## 6. Migration Steps Summary
1. Refactor DB: Add `tenant_id` to all tables.
2. Refactor Security: Pass `tenantId` in JWT.
3. Hibernate: Implement robust Tenant filtering.
4. Gateway/Routing: Update frontend to handle subdomain-based tenant resolution.
5. Launch billing and self-serve onboarding portal.
