const express = require('express');
const router = express.Router();
const {
  createAttempt,
  getAttempts,
  getAttempt,
  updateAttempt,
  deleteAttempt,
  getStats,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes below are protected

router.route('/').post(createAttempt).get(getAttempts);
router.get('/stats', getStats);
router.route('/:id').get(getAttempt).put(updateAttempt).delete(deleteAttempt);

module.exports = router;