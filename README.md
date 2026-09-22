# Smart Interview Prep (Mini Hyrise)

**Full-stack AI-Powered Interview Preparation Platform** built with the MEAN stack.

> Angular (Frontend) + Node.js/Express (Backend) + MongoDB + OpenAI/Groq

## Live Features

- User Authentication (JWT Register / Login)
- AI Question Generator based on Role + Level
- AI Answer Evaluation (Score + Strengths + Improvements + Sample Answer)
- Dashboard with stats
- Full Attempt History with CRUD
- Modern dark UI

## Project Structure

```
smart-interview-prep/
├── frontend/                 # Angular 18 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Services, Guards, Interceptors
│   │   │   ├── pages/        # Login, Register, Dashboard, Practice, History
│   │   │   └── shared/       # Navbar
│   │   └── environments/
│   └── package.json
│
├── src/                      # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/             # AI Service (OpenAI / Groq)
│   ├── app.js
│   └── server.js
│
├── package.json              # Backend dependencies
├── .env.example
└── README.md
```

## Quick Start

### 1. Backend Setup

```bash
# Install backend dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env → add MONGODB_URI, JWT_SECRET, and OPENAI_API_KEY or GROQ_API_KEY

# Start backend
npm run dev
# → http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
# → http://localhost:4200
```

### 3. Open the App

Go to **http://localhost:4200**

1. Register a new account
2. Go to **Practice**
3. Enter a role (e.g. "Data Engineer")
4. Generate questions → Answer → Get AI feedback
5. Check Dashboard & History

## API Endpoints

| Method | Endpoint                  | Description                     | Auth |
|--------|---------------------------|---------------------------------|------|
| POST   | `/api/auth/register`      | Register                        | No   |
| POST   | `/api/auth/login`         | Login                           | No   |
| GET    | `/api/auth/me`            | Current user                    | Yes  |
| POST   | `/api/questions/generate` | Generate questions              | Yes  |
| POST   | `/api/attempts`           | Submit answer + AI evaluation   | Yes  |
| GET    | `/api/attempts`           | Get attempt history             | Yes  |
| GET    | `/api/attempts/stats`     | Dashboard statistics            | Yes  |
| GET    | `/api/attempts/:id`       | Single attempt                  | Yes  |
| PUT    | `/api/attempts/:id`       | Update answer + re-evaluate     | Yes  |
| DELETE | `/api/attempts/:id`       | Delete attempt                  | Yes  |

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-interview-prep
JWT_SECRET=your_secret_key
AI_PROVIDER=openai          # or "groq"
OPENAI_API_KEY=sk-...
# GROQ_API_KEY=gsk_...
```

## Interview Talking Points

- Full MEAN stack implementation
- JWT authentication with protected routes
- AI integration (prompt engineering + structured JSON output)
- Clean separation of concerns (services, controllers, models)
- Angular standalone components + signals + functional interceptors/guards
- MongoDB indexing strategy
- Error handling & rate limiting

## Author

**Santhoshkumar K**  
GitHub: [SanthoshKumar020](https://github.com/SanthoshKumar020)

## License

MIT