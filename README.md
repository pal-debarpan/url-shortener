# URLShawtie 🚀

URLShawtie is a URL shortening application with a FastAPI backend, PostgreSQL (Supabase) database, and React + Vite frontend styled according to the Stitch design specifications.

---

## 📁 Project Structure

```
URLShawtie/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MobileHeader.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── CreateLinkModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Stitch 7
│   │   │   ├── LoginPage.jsx         # Stitch 4
│   │   │   ├── SignupPage.jsx        # Stitch 6
│   │   │   ├── DashboardPage.jsx     # Stitch 5
│   │   │   ├── MyLinksPage.jsx       # Stitch 3
│   │   │   ├── LinkDetailsPage.jsx   # Stitch 2
│   │   │   ├── CreateLinkPage.jsx    # Dedicated route (/links/create)
│   │   │   ├── AccountPage.jsx       # Stitch 1
│   │   │   └── NotFoundPage.jsx      # 404 Route
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── security.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   └── urls.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── url.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   └── url_service.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models.py
│   │   ├── utils.py
│   │   └── main.py
│   ├── .env
│   ├── requirements.txt
│   └── test_e2e.py
│
├── stitch/
│   ├── stitch_1_account.html
│   ├── stitch_2_details.html
│   ├── stitch_3_links.html
│   ├── stitch_4_login.html
│   ├── stitch_5_dashboard.html
│   ├── stitch_6_signup.html
│   └── stitch_7_landing.html
│
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

- **Frontend**: React (JavaScript), Vite, React Router, Tailwind CSS, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, JWT (python-jose), Passlib (bcrypt)
- **Database**: PostgreSQL / Supabase PostgreSQL

---

## ⚡ Quick Start

### 1. Run Backend (FastAPI)

```bash
cd backend
# Using virtual environment:
venv\Scripts\python -m uvicorn app.main:app --port 8000 --reload
```

Backend will run at: `http://localhost:8000`

### 2. Run Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🧪 Testing

Run full-stack integration tests:

```bash
cd backend
venv\Scripts\python test_e2e.py
```
