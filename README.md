# Chit Fund Management System - README

## Overview
A comprehensive, production-ready Chit Fund Management System built with Spring Boot (backend) and React (frontend). Features JWT authentication, role-based access control, and complete financial tracking capabilities.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: MySQL
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v7
- **HTTP**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access (ADMIN, STAFF)
- Protected routes
- Automatic token management

### Customer Management
- Create, view, edit, and soft-delete customers
- Search by name, phone, or email
- Advanced duplicate name validation
- Detailed profiling (groups, active status, payment history)
- Pagination support
- Customer code generation

### Chit Group Management
- Create and manage chit groups (duration, total members validation)
- Track members and monthly cycles
- Monthly auction/payout details (Winner, Auction Amount, Commission, Dividend)
- **Company Payout Tracking**: Track disbursements to winning customers
- Group status tracking (ACTIVE/COMPLETED)

### Payment Tracking
- Record customer payments
- **Fraud Prevention**: 2-week edit lock on old payment entries (Admin bypass)
- View payments by date or aggregate monthly summarization
- Real-time balance calculations

### Financial Management (DayBook)
- Daily credit/debit entries
- Automatic balance calculation
- Category-wise tracking
- Date-wise summaries

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### Backend Setup

1. **Configure Database**
   ```bash
   cd backend/src/main/resources
   cp application.properties.example application.properties
   # Edit application.properties with your MySQL credentials
   ```

2. **Build and Run**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Default Credentials

- **Admin**: username: `admin`, password: `admin`
- **Staff**: username: `staff`, password: `staff`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Customers
- `GET /api/customers` - List customers (paginated)
- `GET /api/customers/search?query=...` - Search customers
- `GET /api/customers/{id}` - Get customer details
- `POST /api/admin/customers` - Create customer (ADMIN)
- `PUT /api/admin/customers/{id}` - Update customer (ADMIN)
- `DELETE /api/admin/customers/{id}` - Delete customer (ADMIN)

### Chit Groups
- `GET /api/chit-groups` - List groups (paginated)
- `GET /api/chit-groups/search?query=...` - Search groups
- `GET /api/chit-groups/{id}` - Get group details
- `POST /api/chit-groups` - Create group (ADMIN)
- `POST /api/chit-groups/{groupId}/members/{customerId}` - Add member (ADMIN)
- `PUT /api/chit-groups/cycles/{cycleId}` - Update cycle (ADMIN)

### Payments
- `POST /api/payments` - Record payment (ADMIN)
- `GET /api/payments/date/{date}` - Get payments by date
- `GET /api/payments/month?year=...&month=...` - Get monthly payments

### DayBook
- `POST /api/daybook` - Create entry (ADMIN)
- `GET /api/daybook/date/{date}` - Get daily summary

## Project Structure

```
chit-fund-management-system/
├── backend/
│   └── src/main/java/com/chitfund/backend/
│       ├── controller/      # REST API controllers
│       ├── service/         # Business logic
│       ├── repository/      # Data access layer
│       ├── domain/          # JPA entities
│       ├── dto/             # Data transfer objects
│       ├── mapper/          # Entity-DTO mappers
│       ├── exception/       # Custom exceptions
│       ├── config/          # Configuration classes
│       └── security/        # Security & JWT
│
└── frontend/
    └── src/
        ├── components/      # Reusable UI components
        ├── pages/           # Page components
        ├── services/        # API service layer
        ├── context/         # React context providers
        ├── utils/           # Utility functions
        └── index.css        # Global styles

```

## Key Features

✅ Clean Architecture with separation of concerns  
✅ Comprehensive error handling  
✅ Responsive design (mobile, tablet, desktop)  
✅ Beautiful UI with modern design patterns  
✅ Smooth animations and transitions  
✅ Role-based access control  
✅ Secure JWT authentication  
✅ RESTful API design  
✅ Production-ready codebase  

## Development

### Git Workflow
- `main` - Production branch
- `dev` - Development branch
- `feature/*` - Feature branches

### Commit Convention
- `feat(module): description` - New features
- `fix(module): description` - Bug fixes
- `refactor(module): description` - Code refactoring

## License
Proprietary - All rights reserved

## Support
For support and inquiries, contact your system administrator.
