# URLShawtie 🚀

> Short links. Simple tracking.

URLShawtie is a full-stack URL shortener that allows users to convert long URLs into short, shareable links, manage their links, and track click counts through a clean and modern dashboard.

The project is built using React and JavaScript on the frontend, FastAPI and Python on the backend, and PostgreSQL through Supabase for data storage.

---

## ✨ Features

### 🔗 URL Shortening
- Create short URLs from long URLs
- Automatically generate unique short codes
- Create custom aliases
- Validate URLs before creating them
- Redirect users from short URLs to the original URLs

### 👤 Authentication
- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- Retrieve the currently authenticated user

### 📋 Link Management
- View all links created by the user
- View individual URL details
- Copy shortened URLs
- Track click counts
- View URL creation dates
- Delete shortened URLs
- User ownership protection

### 📊 URL Statistics
- View total click count
- View original URL
- View short code
- View URL creation date

### 🎨 Frontend
- Modern and minimal user interface
- Responsive design
- Dashboard for managing shortened URLs
- Login and signup pages
- URL creation interface
- URL statistics page
- Loading states
- Error states
- 404 page

### ⚡ REST API
The backend provides a RESTful API built with FastAPI and includes interactive API documentation.

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- HTML5
- CSS3

### Backend

- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- Passlib
- bcrypt

### Database

- PostgreSQL
- Supabase

### Tools

- Git
- GitHub
- Postman
- Vercel

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   JavaScript + Vite  │
                    └──────────┬───────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │       Python         │
                    └──────────┬───────────┘
                               │
                         SQLAlchemy
                               │
                               ▼
                    ┌──────────────────────┐
                    │ PostgreSQL Database  │
                    │      Supabase        │
                    └──────────────────────┘
```

---

## 📁 Project Structure

```text
URLShawtie/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── ...
│
├── stitch/
│   └── ...
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run URLShawtie locally.

## 1. Clone the Repository

```bash
git clone https://github.com/pal-debarpan/url-shortener.git
```

Navigate into the project:

```bash
cd url-shortener
```

---

# ⚙️ Backend Setup

## 2. Navigate to the Backend

```bash
cd backend
```

---

## 3. Create a Virtual Environment

### Windows

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET_KEY=your_secret_key
```

> Never commit your `.env` file or database credentials to GitHub.

---

## 6. Start the FastAPI Server

From the `backend` directory:

```bash
python -m uvicorn app.main:app --reload
```

The backend will normally run at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🔄 Running the Full Application

Both the frontend and backend need to be running during local development.

### Terminal 1 — Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

The application works using the following architecture:

```text
React
localhost:5173
      │
      │ HTTP Requests
      ▼
FastAPI
localhost:8000
      │
      ▼
PostgreSQL / Supabase
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/auth/me` | Get authenticated user |

---

## URL Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/urls` | Create a shortened URL |
| GET | `/api/v1/urls` | Get user's URLs |
| GET | `/api/v1/urls/{short_code}` | Get a shortened URL |
| GET | `/api/v1/urls/{short_code}/stats` | Get URL statistics |
| DELETE | `/api/v1/urls/{short_code}` | Delete a shortened URL |

---

## Public Redirect

```text
GET /{short_code}
```

Example:

```text
https://your-domain.com/abc123
```

The request redirects the user to the original URL.

---

# 🔐 Authentication Flow

URLShawtie uses JWT-based authentication.

```text
User
 │
 │ Register
 ▼
FastAPI
 │
 ▼
Password Hash
 │
 ▼
PostgreSQL
```

After login:

```text
User
 │
 │ Login
 ▼
FastAPI
 │
 ▼
JWT Access Token
 │
 ▼
Frontend
 │
 │ Authorization: Bearer <token>
 ▼
Protected API Endpoints
```

Protected operations include:

- Getting the current user
- Creating URLs
- Viewing personal URLs
- Viewing URL statistics
- Deleting URLs

---

# 🔗 Custom Short URLs

Users can optionally choose their own short code.

For example:

```text
Original URL:
https://example.com/some/very/long/url
```

Custom alias:

```text
github
```

Result:

```text
https://your-domain.com/github
```

Custom aliases support:

- Letters
- Numbers
- `_`
- `-`

Aliases must be between **3 and 30 characters**.

Duplicate aliases are rejected by the API.

---

# 📊 URL Statistics

URLShawtie tracks:

- Total clicks
- Original URL
- Short code
- Creation date

Example:

```text
Short Code: abc123
Clicks: 42
Created: 2026-08-29
```

---

# 🗄️ Database

URLShawtie uses PostgreSQL through Supabase.

## Users Table

```text
users
├── id
├── email
├── password_hash
└── created_at
```

## URLs Table

```text
urls
├── id
├── original_url
├── short_code
├── click_count
├── created_at
└── user_id
```

The `user_id` column associates shortened URLs with their creator.

---

# 🔒 Security

URLShawtie implements several security measures:

- Password hashing
- JWT authentication
- Protected API routes
- User ownership validation
- Environment variables for secrets
- Database credentials kept outside source code
- Input validation
- Duplicate short-code protection

---

# 🧪 API Testing

The backend was tested using Postman.

The following functionality has been tested:

- User registration
- User login
- JWT authentication
- Current-user endpoint
- URL creation
- Automatic short-code generation
- Custom aliases
- Duplicate alias handling
- URL redirection
- Click counting
- URL statistics
- User URL listing
- URL deletion
- Authorization and ownership checks

---

# 🌐 Deployment

URLShawtie is designed to be deployed using Vercel with the frontend and backend served through a single production application.

The production architecture is:

```text
                  Vercel
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
    React Frontend        FastAPI API
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
              Supabase
             PostgreSQL
```

The deployed application can be accessed through a single domain:

```text
https://urlshawtie.vercel.app
```

---


# 🧑‍💻 Development

### Start Frontend

```bash
cd frontend
npm run dev
```

### Start Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

# 📄 License

This project is available for educational and personal development purposes.

---

# 👨‍💻 Author

**Debarpan Pal**

Computer Science Engineering Student  
VIT Vellore

---

<p align="center">
  Built with ❤️ using React, FastAPI, and PostgreSQL.
</p>