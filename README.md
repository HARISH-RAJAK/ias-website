# UPSC Education Portal (Sankalp IAS)

A full-stack web application designed for civil service aspirants preparing for the **UPSC Civil Services Examination (CSE)**. The portal integrates daily editorial analysis, a high-yield Prelims MCQ test engine with negative marking simulation, a secure Mains answer writing platform with faculty synopsis, structured courses, and an aspirant dashboard.

---

## 1. Technology Stack

- **Frontend:**
  - React.js 18
  - Vite (High-speed build tool and dev server)
  - JavaScript (ES6+)
  - Tailwind CSS (Utility-first styling)
  - React Router DOM v6 (Client-side routing)
  - Axios (Centralized API client with interceptors)
  - Lucide Icons

- **Backend:**
  - Core PHP (RESTful API architecture without monolithic frameworks)
  - MySQL Database with PDO (PHP Data Objects) & prepared statements
  - Token-based authentication with HMAC-SHA256 signatures & bcrypt password hashing
  - Apache `.htaccess` rewrite rules and security filters

- **Development Environment:**
  - VS Code
  - XAMPP (Apache web server & MySQL / MariaDB)
  - Node.js & npm

---

## 2. Project Folder Structure

```text
UPSC-Education-Portal/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Top notification bar & date display
│   │   │   ├── Footer.jsx           # UPSC syllabus & portal footer
│   │   │   ├── Sidebar.jsx          # Dashboard navigation menu
│   │   │   ├── Navbar.jsx           # Brand header with mobile menu
│   │   │   └── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # [STITCH DESIGN 1] Sankalp IAS Homepage
│   │   │   ├── CurrentAffairs.jsx       # [STITCH DESIGN 2] Daily Editorials & News
│   │   │   ├── MainsAnswerWriting.jsx   # [STITCH DESIGN 3] Secure Mains Writing
│   │   │   ├── PrelimsQuiz.jsx          # [STITCH DESIGN 4] Test Engine & Timer
│   │   │   ├── Login.jsx                # Aspirant & Faculty login
│   │   │   ├── Register.jsx             # Free account creation
│   │   │   ├── Dashboard.jsx            # Performance metrics & streak tracker
│   │   │   ├── Courses.jsx              # Mentorship & GS foundation batches
│   │   │   ├── StudyMaterials.jsx       # NCERT notes, PYQs & syllabus
│   │   │   └── NotFound.jsx             # 404 handler
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                   # Central Axios client instance
│   │   │   └── authService.js           # Auth operations & token storage
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Global authentication state
│   │   │
│   │   ├── App.jsx                      # App router configuration
│   │   ├── main.jsx                     # Root React mounting entry
│   │   └── index.css                    # Tailwind CSS definitions
│   │
│   ├── .env                             # Frontend environment variables
│   ├── .env.example                     # Environment template
│   ├── .htaccess                        # Apache SPA routing & security
│   ├── index.html                       # HTML5 template
│   ├── package.json                     # NPM packages & scripts
│   ├── tailwind.config.js               # Tailwind design system configuration
│   ├── postcss.config.js                # PostCSS plugins
│   └── vite.config.js                   # Vite dev server configuration
│
├── backend/
│   ├── config/
│   │   └── database.php                 # Secure PDO singleton & .env parser
│   │
│   ├── controllers/
│   │   ├── AuthController.php           # Registration, login, JWT issuance
│   │   ├── UserController.php           # User profile management
│   │   ├── CurrentAffairsController.php # News CRUD & syllabus filtering
│   │   ├── QuizController.php           # Prelims quizzes & scoring
│   │   ├── MainsController.php          # Question prompts & answer submissions
│   │   └── CourseController.php         # Course catalog & enrollment
│   │
│   ├── models/
│   │   ├── User.php                     # User queries & password verification
│   │   ├── CurrentAffair.php            # Current affairs database operations
│   │   ├── Quiz.php                     # Quiz definitions & attempt records
│   │   ├── Question.php                 # MCQ options & explanations
│   │   └── Course.php                   # Course records
│   │
│   ├── routes/
│   │   └── api.php                      # REST API routing table & health check
│   │
│   ├── middleware/
│   │   ├── AuthMiddleware.php           # Bearer token verification & RBAC
│   │   └── CorsMiddleware.php           # Dynamic CORS origin handling
│   │
│   ├── helpers/
│   │   └── response.php                 # Standard JSON & sanitization helpers
│   │
│   ├── database/
│   │   └── schema.sql                   # MySQL tables & initial seed data
│   │
│   ├── public/
│   │   ├── index.php                    # Front controller entry point
│   │   └── .htaccess                    # URL rewrite rules & directory protection
│   │
│   ├── .env                             # Backend database & port credentials
│   ├── .env.example                     # Environment template
│   ├── .htaccess                        # Root directory access lockdown
│   └── composer.json                    # Composer packages
│
├── .gitignore                           # Git exclusion rules
└── README.md                            # Comprehensive setup guide
```

---

## 3. Stitch Design Code Integration (Exact File Paths)

When you receive the code from **Google Stitch**, paste each generated design into its designated file:

| Stitch Design Screen | Destination File Path | Description |
| :--- | :--- | :--- |
| **1. Home – Sankalp IAS** | `frontend/src/pages/Home.jsx` | Main landing hero, preparation pillars, metrics, and syllabus highlights |
| **2. Daily Current Affairs** | `frontend/src/pages/CurrentAffairs.jsx` | Editorial list, GS paper badges, search bar, and article reader |
| **3. Secure Mains Answer Writing** | `frontend/src/pages/MainsAnswerWriting.jsx` | Daily GS questions, real-time word counter, answer editor, and synopsis |
| **4. Daily Prelims Quiz Engine** | `frontend/src/pages/PrelimsQuiz.jsx` | Interactive MCQ engine, countdown timer, question palette, and score card |

Each page file already contains an instructional comment block:
```jsx
/* =======================================================================
   STITCH CONTAINER: [Page Name]
   Paste your Stitch-generated JSX markup here
   ======================================================================= */
```

---

## 4. Prerequisites

Before running the application, ensure the following software is installed on your computer:
1. **Node.js** (v18.0 or higher) – [Download Node.js](https://nodejs.org/)
2. **XAMPP** (includes Apache and MySQL) – [Download XAMPP](https://www.apachefriends.org/)
3. **VS Code** – [Download VS Code](https://code.visualstudio.com/)
4. **Composer** (Optional, for PHP dependencies) – [Download Composer](https://getcomposer.org/)

---

## 5. XAMPP & MySQL Database Setup

1. **Launch XAMPP Control Panel**:
   - Start the **Apache** module.
   - Start the **MySQL** module.

2. **Open phpMyAdmin**:
   - Open your browser and navigate to: `http://localhost/phpmyadmin`

3. **Import Database Schema**:
   - Click on the **Databases** tab.
   - In "Create database", enter: `upsc_portal` and click **Create** (Collation: `utf8mb4_unicode_ci`).
   - Select the newly created database `upsc_portal` on the left sidebar.
   - Click on the **Import** tab at the top.
   - Click **Choose File** and select:
     ```text
     c:\Users\anush\OneDrive\insight-ias\backend\database\schema.sql
     ```
   - Click **Import** at the bottom of the page.
   - *Alternatively, run the SQL script via command line:*
     ```bash
     mysql -u root -p upsc_portal < backend/database/schema.sql
     ```

4. **Default Seed Accounts**:
   - **Faculty / Admin Account:**
     - Email: `admin@sankalpias.in`
     - Password: `Admin@123`
   - **Student Aspirant Account:**
     - Email: `aspirant@sankalpias.in`
     - Password: `Student@123`

---

## 6. Environment Variables Configuration

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```
- Reads directly into `src/services/api.js`.
- Never put database passwords or private API keys here.

### Backend (`backend/.env`)
```env
APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=upsc_portal

DB_CHARSET=utf8mb4
```

> **Note for XAMPP users:** By default, XAMPP MySQL user is `root` with an empty password (`DB_PASS=`). If you have configured a password in phpMyAdmin, update `DB_PASS` accordingly.

---

## 7. Running the Project (Two Separate Terminals in VS Code)

Open **two separate integrated terminals** in VS Code (Press `Ctrl + Shift + \`` to open a terminal, then click the `+` icon or split button to create a second terminal).

### Terminal 1: Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)

---

### Terminal 2: Backend (PHP Built-in Server / Apache)

```bash
cd backend
php -S localhost:8000 -t public
```

- **Backend URL:** [http://localhost:8000](http://localhost:8000)
- **Health-Check API:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

*(Optional: If Composer is installed, run `composer install` inside `backend` to install `vlucas/phpdotenv`. The backend includes a native fallback parser so it runs cleanly even without Composer).*

---

## 8. REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service status & database connection test | Public |
| `POST` | `/api/register` | Register new student aspirant account | Public |
| `POST` | `/api/login` | Authenticate user and issue signed Bearer token | Public |
| `POST` | `/api/logout` | End session | Authenticated |
| `GET` | `/api/me` | Fetch authenticated user profile | Bearer Token |
| `GET` | `/api/current-affairs` | List articles (query: `category`, `date`, `search`) | Public |
| `GET` | `/api/current-affairs/{id}` | Read individual current affairs article | Public |
| `POST` | `/api/current-affairs` | Publish new current affairs article | Admin Only |
| `GET` | `/api/quizzes` | List active Prelims quizzes | Public |
| `GET` | `/api/quizzes/{id}` | Fetch quiz with full MCQ question list | Public |
| `POST` | `/api/quizzes/{id}/submit` | Submit answers and calculate net score | Public / Student |
| `GET` | `/api/mains/questions` | List daily Mains practice questions | Public |
| `POST` | `/api/mains/submit` | Submit answer draft with word count | Public / Student |
| `PUT` | `/api/mains/questions/{id}/synopsis` | Publish faculty model answer | Admin Only |
| `GET` | `/api/courses` | List all available foundation & mentorship batches | Public |

---

## 9. Security Implementations

1. **Password Hashing:** `password_hash($password, PASSWORD_BCRYPT)` ensures credentials are never stored in plain text.
2. **SQL Injection Protection:** 100% of database interactions utilize PDO prepared statements with parameter binding.
3. **CORS Safeguard:** Backend dynamically reads `FRONTEND_URL` and permits only authorized origins with full preflight OPTIONS handling.
4. **Credential Isolation:** Database credentials reside exclusively in `backend/.env`. Apache rules deny web browser access to all `.env` files.
5. **Role-Based Access Control (RBAC):** Administrative actions require faculty/admin role verification.

