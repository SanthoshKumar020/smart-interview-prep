# Smart Interview Prep (Mini Hyrise)

AI-Powered Interview Preparation Platform built with the **MEAN** stack + Generative AI.

## Features

- JWT Authentication (Register / Login)
- Role-based Question Generation using AI
- Answer Evaluation with Score + Detailed Feedback (AI)
- Attempt History with full CRUD
- Dashboard-ready endpoints (scores, history)
- Rate limiting, Helmet, CORS, input validation

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Backend     | Node.js + Express       |
| Database    | MongoDB + Mongoose      |
| Auth        | JWT + bcrypt            |
| AI          | OpenAI or Groq          |
| Validation  | Zod                     |

## Project Structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── questionController.js
│   └── attemptController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   └── Attempt.js
├── routes/
│   ├── auth.js
│   ├── questions.js
│   └── attempts.js
├── services/
│   └── aiService.js
├── app.js
└── server.js
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanthoshKumar020/smart-interview-prep.git
   cd smart-interview-prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret and AI API key
   ```

4. **Run the server**
   ```bash
   npm run dev     # development (nodemon)
   npm start       # production
   ```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint              | Description          | Auth |
|--------|-----------------------|----------------------|------|
| POST   | `/api/auth/register`  | Register new user    | No   |
| POST   | `/api/auth/login`     | Login                | No   |
| GET    | `/api/auth/me`        | Get current user     | Yes  |

### Questions
| Method | Endpoint                    | Description                | Auth |
|--------|-----------------------------|----------------------------|------|
| POST   | `/api/questions/generate`   | Generate interview questions | Yes |

### Attempts
| Method | Endpoint                | Description                     | Auth |
|--------|-------------------------|---------------------------------|------|
| POST   | `/api/attempts`         | Submit answer + get AI feedback | Yes  |
| GET    | `/api/attempts`         | Get all attempts of user        | Yes  |
| GET    | `/api/attempts/:id`     | Get single attempt              | Yes  |
| PUT    | `/api/attempts/:id`     | Update answer + re-evaluate     | Yes  |
| DELETE | `/api/attempts/:id`     | Delete attempt                  | Yes  |
| GET    | `/api/attempts/stats`   | Dashboard stats                 | Yes  |

## Example Requests

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Generate Questions
```http
POST /api/questions/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "Data Engineer",
  "level": "mid",
  "count": 5,
  "topics": ["SQL", "Spark", "Airflow"]
}
```

### Submit Answer
```http
POST /api/attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "Data Engineer",
  "question": "Explain the difference between batch and stream processing.",
  "userAnswer": "Batch processing handles large volumes of data at once..."
}
```

## AI Configuration

You can use either **OpenAI** or **Groq**:

```env
# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# OR Groq (faster + cheaper)
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

## Author

**Santhoshkumar K**  
GitHub: [SanthoshKumar020](https://github.com/SanthoshKumar020)

## License

MIT