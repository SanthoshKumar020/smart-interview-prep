# Smart Interview Prep (Mini Hyrise)

**Full-stack AI-Powered Interview Preparation Platform**

Angular + Node.js + Express + MongoDB + OpenAI/Groq

---

## Project Structure

```
smart-interview-prep/
├── frontend/                  # Angular 18 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Auth service, API service, guards, interceptors
│   │   │   ├── pages/         # Login, Register, Dashboard, Practice, History
│   │   │   └── shared/        # Navbar
│   │   └── environments/
│   └── package.json
│
├── backend/                   # Node.js + Express API
│   ├── config/                # Database connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth + Error handling
│   ├── models/                # User + Attempt (MongoDB)
│   ├── routes/                # API routes
│   ├── services/              # AI service (OpenAI / Groq)
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Features

- JWT Authentication (Register / Login)
- AI Question Generator (by role + level)
- AI Answer Evaluation (score + strengths + improvements + sample answer)
- Dashboard with statistics
- Full Attempt History (CRUD)
- Clean modern UI

---

## How to Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add:
- `MONGODB_URI` (local MongoDB or MongoDB Atlas)
- `JWT_SECRET`
- `OPENAI_API_KEY` **or** `GROQ_API_KEY`

```bash
npm run dev
```

Backend runs at → **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at → **http://localhost:4200**

### 3. Use the App

1. Open http://localhost:4200
2. Register a new account
3. Go to **Practice**
4. Enter a role (e.g. `Data Engineer`)
5. Generate questions → Answer → Get AI feedback
6. Check **Dashboard** and **History**

---

## API Endpoints

| Method | Endpoint                  | Description                    | Auth |
|--------|---------------------------|--------------------------------|------|
| POST   | `/api/auth/register`      | Register new user              | No   |
| POST   | `/api/auth/login`         | Login                          | No   |
| GET    | `/api/auth/me`            | Get current user               | Yes  |
| POST   | `/api/questions/generate` | Generate interview questions   | Yes  |
| POST   | `/api/attempts`           | Submit answer + AI evaluation  | Yes  |
| GET    | `/api/attempts`           | Get attempt history            | Yes  |
| GET    | `/api/attempts/stats`     | Dashboard statistics           | Yes  |
| GET    | `/api/attempts/:id`       | Get single attempt             | Yes  |
| PUT    | `/api/attempts/:id`       | Update answer + re-evaluate    | Yes  |
| DELETE | `/api/attempts/:id`       | Delete attempt                 | Yes  |

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Angular 18 (Standalone) |
| Backend    | Node.js + Express       |
| Database   | MongoDB + Mongoose      |
| Auth       | JWT + bcrypt            |
| AI         | OpenAI / Groq           |

---

## Interview Explanation

> "I built a full-stack interview preparation system using Angular, Node.js, and MongoDB.  
> The frontend allows users to select a role and answer questions.  
> The backend provides REST APIs to generate questions, evaluate answers using AI, and store user attempts.  
> I structured the backend using routes, controllers, and models for scalability."

---

## Author

**Santhoshkumar K**  
GitHub: [SanthoshKumar020](https://github.com/SanthoshKumar020)

## License

MIT