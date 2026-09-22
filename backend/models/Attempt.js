const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    userAnswer: {
      type: String,
      required: [true, 'User answer is required'],
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    feedback: {
      strengths: [String],
      improvements: [String],
      improvedAnswer: String,
      followUpQuestions: [String],
    },
    aiRawResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

attemptSchema.index({ user: 1, createdAt: -1 });
attemptSchema.index({ user: 1, role: 1 });

module.exports = mongoose.model('Attempt', attemptSchema);