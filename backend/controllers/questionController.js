const { generateQuestions } = require('../services/aiService');

// POST /api/questions/generate
const generate = async (req, res, next) => {
  try {
    const { role, level = 'mid', count = 5, topics = [] } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' });
    }

    if (count < 1 || count > 15) {
      return res.status(400).json({ success: false, message: 'Count must be between 1 and 15' });
    }

    const questions = await generateQuestions({
      role,
      level,
      count: Number(count),
      topics: Array.isArray(topics) ? topics : [],
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generate };