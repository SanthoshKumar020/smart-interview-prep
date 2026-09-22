const Attempt = require('../models/Attempt');
const { evaluateAnswer } = require('../services/aiService');

// @desc    Submit answer and get AI evaluation
// @route   POST /api/attempts
// @access  Private
const createAttempt = async (req, res, next) => {
  try {
    const { role, question, userAnswer } = req.body;

    if (!role || !question || !userAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Role, question and userAnswer are required',
      });
    }

    // Call AI for evaluation
    const evaluation = await evaluateAnswer({ role, question, userAnswer });

    const attempt = await Attempt.create({
      user: req.user._id,
      role,
      question,
      userAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      aiRawResponse: evaluation.aiRawResponse,
    });

    res.status(201).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attempts of logged-in user
// @route   GET /api/attempts
// @access  Private
const getAttempts = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (role) query.role = role;

    const attempts = await Attempt.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Attempt.countDocuments(query);

    res.status(200).json({
      success: true,
      count: attempts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single attempt
// @route   GET /api/attempts/:id
// @access  Private
const getAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Ensure user owns this attempt
    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update answer and re-evaluate
// @route   PUT /api/attempts/:id
// @access  Private
const updateAttempt = async (req, res, next) => {
  try {
    let attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { userAnswer } = req.body;

    if (!userAnswer) {
      return res.status(400).json({ success: false, message: 'userAnswer is required' });
    }

    // Re-evaluate with AI
    const evaluation = await evaluateAnswer({
      role: attempt.role,
      question: attempt.question,
      userAnswer,
    });

    attempt.userAnswer = userAnswer;
    attempt.score = evaluation.score;
    attempt.feedback = evaluation.feedback;
    attempt.aiRawResponse = evaluation.aiRawResponse;

    await attempt.save();

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attempt
// @route   DELETE /api/attempts/:id
// @access  Private
const deleteAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (attempt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await attempt.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attempt deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/attempts/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id });

    const totalAttempts = attempts.length;
    const averageScore =
      totalAttempts > 0
        ? Number(
            (attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts).toFixed(2)
          )
        : 0;

    // Group by role
    const byRole = {};
    attempts.forEach((a) => {
      if (!byRole[a.role]) {
        byRole[a.role] = { count: 0, totalScore: 0 };
      }
      byRole[a.role].count += 1;
      byRole[a.role].totalScore += a.score;
    });

    const roleStats = Object.entries(byRole).map(([role, data]) => ({
      role,
      attempts: data.count,
      averageScore: Number((data.totalScore / data.count).toFixed(2)),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore,
        roleStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
  updateAttempt,
  deleteAttempt,
  getStats,
};