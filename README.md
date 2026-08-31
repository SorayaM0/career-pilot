# CareerPilot ✦

CareerPilot is a full-stack job application tracking platform designed to help users organize their job search, monitor application progress, and understand their recruiting pipeline.

The application combines a React and TypeScript frontend with a Java Spring Boot REST API and PostgreSQL database. CareerPilot includes secure user authentication, user-specific application data, application lifecycle tracking, status history, search and filtering, and job search analytics.

---

## ✨ Features

### Application Management

- Create, view, update, and delete job applications
- Track company, position, location, application date, job posting URL, and job description
- Manage application status across:
  - Applied
  - Interview
  - Offer
  - Rejected
- View detailed information for individual applications
- Search applications by company, position, and location
- Filter applications by status

### Application Progress

CareerPilot tracks application status changes over time.

Each application includes:

- Application progress timeline
- Persistent status history
- Timestamped status changes
- Current application status

Status history is stored in PostgreSQL rather than existing only in the frontend.

### Analytics Dashboard

The analytics page provides an overview of the user's job search, including:

- Total applications
- Interview rate
- Offer rate
- Rejection rate
- Application pipeline breakdown
- Status distribution
- Quick job-search insights

### Authentication & Authorization

CareerPilot includes a complete authentication flow using Spring Security and JWT authentication.

Users can:

- Create an account
- Log in securely
- Maintain an authenticated session
- Log out
- Access protected application endpoints

Passwords are hashed using BCrypt before being stored.

Application data is associated with the authenticated user, preventing users from accessing another user's applications or status history.

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT authentication
- BCrypt password hashing

### Database

- PostgreSQL

### Development Tools

- Git
- GitHub
- Maven
- VS Code
- Postman / cURL

---

## 🏗 Architecture

CareerPilot follows a layered full-stack architecture:

```text
React + TypeScript
        │
        │ HTTP / JSON
        ▼
Spring Boot REST API
        │
        ▼
Controller Layer
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
Spring Data JPA / Hibernate
        │
        ▼
PostgreSQL
```

Authentication requests are handled through Spring Security and JWT-based authorization.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Spring Security
 │
 ▼
JWT Authentication
 │
 ▼
Protected REST Endpoints
 │
 ▼
User-Owned Application Data
```

---

## 🔐 Security

CareerPilot implements authentication and resource-level authorization.

Protected application requests include a JWT:

```text
Authorization: Bearer <token>
```

The backend extracts the authenticated user's identity from the token and scopes database operations to that user.

For example, application retrieval is performed using ownership-aware repository queries rather than retrieving arbitrary applications by ID.

This prevents one authenticated user from accessing another user's application data.

Security features include:

- Spring Security
- JWT authentication
- BCrypt password hashing
- Stateless backend authentication
- Protected REST endpoints
- User-owned database records
- Resource-level authorization

> CareerPilot currently stores the JWT in browser local storage as a straightforward bearer-token approach for the portfolio implementation. A production deployment could further harden session handling using secure HttpOnly cookies and additional CSRF/XSS protections.

---

## 📡 REST API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Applications

```text
GET    /api/applications
POST   /api/applications
GET    /api/applications/{id}
PUT    /api/applications/{id}
DELETE /api/applications/{id}
```

### Application History

```text
GET /api/applications/{id}/history
```

Application endpoints require authentication.

---

## 🗄 Data Model

CareerPilot currently uses three primary domain models:

### User

Stores account information and authentication credentials.

```text
User
├── id
├── name
├── email
└── password
```

### Job Application

Stores job application information and belongs to a specific user.

```text
JobApplication
├── id
├── company
├── position
├── location
├── status
├── jobUrl
├── dateApplied
├── jobDescription
└── user
```

### Application Status History

Stores application lifecycle changes.

```text
ApplicationStatusHistory
├── id
├── status
├── changedAt
└── jobApplication
```

This allows CareerPilot to maintain a persistent history of how each application moves through the recruiting process.

---

## 🎨 Interface

CareerPilot uses a responsive custom interface built with React and CSS.

The design includes:

- Dashboard overview
- Application cards
- Search and filtering
- Application details
- Application progress timeline
- Analytics dashboard
- Login and registration
- Add and edit application workflows
- Responsive layouts

The visual system uses a warm cream background, sage navigation, muted lavender accents, soft status colors, rounded cards, and subtle interaction states.

---

## 🚀 Running the Project Locally

### Prerequisites

Make sure you have installed:

- Java
- Maven
- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/SorayaM0/career-pilot.git
cd career-pilot
```

### 2. Create the PostgreSQL database

Create a local PostgreSQL database:

```sql
CREATE DATABASE career_pilot;
```

Configure the backend database connection for your local PostgreSQL environment.

Do not commit database passwords or other credentials to Git.

### 3. Configure the JWT secret

CareerPilot expects the JWT signing secret through an environment variable.

```bash
export JWT_SECRET="your-secret-here"
```

Use a sufficiently strong secret appropriate for the JWT configuration.

### 4. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Open the frontend URL in your browser and create an account.

---

## 🧠 Engineering Highlights

CareerPilot was built to explore several important full-stack software engineering concepts:

- Designing RESTful APIs with Spring Boot
- Separating controller, service, and repository responsibilities
- Mapping relational entities using JPA and Hibernate
- Persisting application lifecycle history
- Building authenticated React clients
- Implementing JWT-based authentication
- Hashing credentials with BCrypt
- Protecting backend resources with Spring Security
- Implementing user-level data ownership
- Managing asynchronous frontend API state
- Building reusable React components
- Designing responsive application interfaces

---

## 🗺 Roadmap

CareerPilot is actively being developed.

Planned improvements include:

- [ ] Stronger backend request validation
- [ ] Improved API error handling
- [ ] Additional analytics and pipeline metrics
- [ ] Applications-over-time visualization
- [ ] Backend integration and security tests
- [ ] Frontend tests
- [ ] Docker containerization
- [ ] Production deployment
- [ ] API documentation
- [ ] AI-assisted job description analysis
- [ ] AI-generated interview preparation insights
- [ ] Resume and job-description skill comparison

---

## 🤖 Planned AI Career Assistant

A future CareerPilot feature will integrate AI directly with stored application data.

Rather than functioning as a generic chatbot, the assistant is planned to analyze job descriptions associated with applications and provide information such as:

- Important skills and technologies
- Job description keywords
- Potential skill gaps
- Resume improvement suggestions
- Interview preparation topics
- Role-specific interview questions

This feature is currently part of the project roadmap and is **not yet included as a completed feature**.

---

## 📌 Project Status

CareerPilot currently includes:

- Full-stack React + Spring Boot architecture
- PostgreSQL persistence
- Application CRUD operations
- Search and filtering
- Application details
- Application status history
- Job search analytics
- Registration and login
- JWT authentication
- BCrypt password hashing
- Protected REST APIs
- User-specific application ownership
- Responsive custom UI

Testing, containerization, production deployment, and AI integration are planned next.

---

## 👩‍💻 Author

**Soraya**

Software engineering portfolio project focused on full-stack development, backend architecture, authentication, relational data modeling, and API design.
