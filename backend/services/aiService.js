const OpenAI = require('openai');

let client = null;

const getClient = () => {
  if (client) return client;

  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'groq') {
    client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  } else {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
};

const getModel = () => {
  const provider = process.env.AI_PROVIDER || 'openai';
  return provider === 'groq' ? 'llama-3.1-70b-versatile' : 'gpt-4o-mini';
};

const generateQuestions = async ({ role, level = 'mid', count = 5, topics = [] }) => {
  const openai = getClient();
  const model = getModel();

  const topicsText = topics.length > 0 ? `Focus on these topics: ${topics.join(', ')}.` : '';

  const prompt = `You are an expert technical interviewer.
Generate ${count} high-quality interview questions for the role of "${role}" at ${level} level.
${topicsText}

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    {
      "question": "the question text",
      "difficulty": "easy|medium|hard",
      "topic": "main topic",
      "expectedFocus": "what the interviewer is looking for"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You always return valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : parsed.questions || [];
};

const evaluateAnswer = async ({ role, question, userAnswer }) => {
  const openai = getClient();
  const model = getModel();

  const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Role: ${role}
Question: ${question}
Candidate's Answer: ${userAnswer}

Return ONLY a valid JSON object:
{
  "score": <number 0-10>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "improvedAnswer": "A concise high-quality sample answer",
  "followUpQuestions": ["follow-up 1", "follow-up 2"]
}

Be honest and constructive.`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You always return valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  return {
    score: Math.min(10, Math.max(0, Number(parsed.score) || 0)),
    feedback: {
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      improvedAnswer: parsed.improvedAnswer || '',
      followUpQuestions: parsed.followUpQuestions || [],
    },
    aiRawResponse: parsed,
  };
};

module.exports = { generateQuestions, evaluateAnswer };