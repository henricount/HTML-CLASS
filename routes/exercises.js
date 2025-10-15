const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/db');
const AutoGrader = require('../utils/autoGrader');

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get all exercises for a lesson
router.get('/lesson/:lessonId', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;

    const result = await db.query(
      `SELECT e.*,
        (SELECT COUNT(*) FROM submissions s
         WHERE s.exercise_id = e.id AND s.user_id = $1 AND s.is_complete = TRUE) as completed
       FROM exercises e
       WHERE e.lesson_id = $2
       ORDER BY e.order_index ASC`,
      [req.session.userId, lessonId]
    );

    res.json({ exercises: result.rows });

  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to get exercises' });
  }
});

// Get single exercise with user's last submission
router.get('/:exerciseId', requireAuth, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const userId = req.session.userId;

    // Get exercise details
    const exerciseResult = await db.query(
      `SELECT * FROM exercises WHERE id = $1`,
      [exerciseId]
    );

    if (exerciseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const exercise = exerciseResult.rows[0];

    // Get user's latest submission
    const submissionResult = await db.query(
      `SELECT * FROM submissions
       WHERE exercise_id = $1 AND user_id = $2
       ORDER BY submitted_at DESC LIMIT 1`,
      [exerciseId, userId]
    );

    // Get user's last saved code
    const savedCodeResult = await db.query(
      `SELECT code FROM code_saves
       WHERE exercise_id = $1 AND user_id = $2
       ORDER BY saved_at DESC LIMIT 1`,
      [exerciseId, userId]
    );

    res.json({
      exercise,
      submission: submissionResult.rows[0] || null,
      savedCode: savedCodeResult.rows[0]?.code || exercise.starter_code || ''
    });

  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Failed to get exercise' });
  }
});

// Auto-save code (no grading)
router.post('/:exerciseId/save',
  requireAuth,
  [body('code').isString()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { exerciseId } = req.params;
      const { code } = req.body;
      const userId = req.session.userId;

      await db.query(
        `INSERT INTO code_saves (user_id, exercise_id, code, is_auto_save)
         VALUES ($1, $2, $3, TRUE)`,
        [userId, exerciseId, code]
      );

      res.json({ success: true, message: 'Code saved' });

    } catch (error) {
      console.error('Save code error:', error);
      res.status(500).json({ error: 'Failed to save code' });
    }
  }
);

// Submit and grade exercise
router.post('/:exerciseId/submit',
  requireAuth,
  [body('code').isString().isLength({ max: 50000 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { exerciseId } = req.params;
      const { code } = req.body;
      const userId = req.session.userId;

      // Get exercise and test cases
      const exerciseResult = await db.query(
        `SELECT * FROM exercises WHERE id = $1`,
        [exerciseId]
      );

      if (exerciseResult.rows.length === 0) {
        return res.status(404).json({ error: 'Exercise not found' });
      }

      const exercise = exerciseResult.rows[0];

      // Get test cases
      const testCasesResult = await db.query(
        `SELECT * FROM test_cases WHERE exercise_id = $1 ORDER BY id ASC`,
        [exerciseId]
      );

      const testCases = testCasesResult.rows;

      // Run auto-grader
      const grader = new AutoGrader(code, testCases);
      const gradingResults = await grader.grade();

      // Save submission
      const submissionResult = await db.query(
        `INSERT INTO submissions
         (user_id, exercise_id, code, score, max_score, is_complete, feedback)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          userId,
          exerciseId,
          code,
          gradingResults.score,
          gradingResults.maxScore,
          gradingResults.passed,
          JSON.stringify(gradingResults)
        ]
      );

      // Update user progress if passed
      if (gradingResults.passed) {
        await checkAndUpdateProgress(userId, exercise.lesson_id);
      }

      res.json({
        success: true,
        submission: submissionResult.rows[0],
        grading: gradingResults
      });

    } catch (error) {
      console.error('Submit exercise error:', error);
      res.status(500).json({ error: 'Failed to submit exercise' });
    }
  }
);

// Helper function to update lesson progress
async function checkAndUpdateProgress(userId, lessonId) {
  // Check if all exercises in lesson are complete
  const result = await db.query(
    `SELECT COUNT(*) as total,
      (SELECT COUNT(DISTINCT exercise_id) FROM submissions
       WHERE user_id = $1 AND exercise_id IN
       (SELECT id FROM exercises WHERE lesson_id = $2)
       AND is_complete = TRUE) as completed
     FROM exercises WHERE lesson_id = $2`,
    [userId, lessonId]
  );

  const { total, completed } = result.rows[0];

  if (parseInt(total) === parseInt(completed)) {
    // Mark lesson as complete
    await db.query(
      `INSERT INTO user_progress (user_id, lesson_id, completed_at, is_complete)
       VALUES ($1, $2, CURRENT_TIMESTAMP, TRUE)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET completed_at = CURRENT_TIMESTAMP, is_complete = TRUE`,
      [userId, lessonId]
    );
  }
}

// Get exercise statistics (for teachers)
router.get('/:exerciseId/stats', requireAuth, async (req, res) => {
  try {
    // Check if user is teacher
    if (req.session.role !== 'teacher' && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { exerciseId } = req.params;

    const stats = await db.query(
      `SELECT
        COUNT(DISTINCT user_id) as total_attempts,
        COUNT(DISTINCT CASE WHEN is_complete = TRUE THEN user_id END) as completed_count,
        AVG(score) as avg_score,
        MAX(score) as max_score,
        MIN(score) as min_score
       FROM submissions
       WHERE exercise_id = $1`,
      [exerciseId]
    );

    res.json({ stats: stats.rows[0] });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// General submit route (for lesson page compatibility)
router.post('/submit',
  requireAuth,
  [
    body('exerciseId').isInt(),
    body('code').isString().isLength({ max: 50000 }),
    body('score').optional().isInt(),
    body('maxScore').optional().isInt(),
    body('isComplete').optional().isBoolean(),
    body('feedback').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { exerciseId, code, score, maxScore, isComplete, feedback } = req.body;
      const userId = req.session.userId;

      // Save submission
      const submissionResult = await db.query(
        `INSERT INTO submissions
         (user_id, exercise_id, code, score, max_score, is_complete, feedback)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          userId,
          exerciseId,
          code,
          score || 0,
          maxScore || 0,
          isComplete || false,
          JSON.stringify(feedback || {})
        ]
      );

      // Get exercise to find lesson_id
      const exerciseResult = await db.query(
        'SELECT lesson_id FROM exercises WHERE id = $1',
        [exerciseId]
      );

      if (exerciseResult.rows.length > 0 && isComplete) {
        await checkAndUpdateProgress(userId, exerciseResult.rows[0].lesson_id);
      }

      res.json({
        success: true,
        submission: submissionResult.rows[0]
      });

    } catch (error) {
      console.error('Submit exercise error:', error);
      res.status(500).json({ error: 'Failed to submit exercise' });
    }
  }
);

module.exports = router;
