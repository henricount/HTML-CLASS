const express = require('express');
const db = require('../db/db');

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get all lessons with progress
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await db.query(
      `SELECT l.*,
        up.is_complete,
        up.started_at,
        up.completed_at,
        up.time_spent_seconds,
        (SELECT COUNT(*) FROM exercises WHERE lesson_id = l.id) as exercise_count,
        (SELECT COUNT(DISTINCT exercise_id) FROM submissions
         WHERE user_id = $1 AND exercise_id IN
         (SELECT id FROM exercises WHERE lesson_id = l.id)
         AND is_complete = TRUE) as completed_exercises
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.is_published = TRUE
       ORDER BY l.order_index ASC`,
      [userId]
    );

    res.json({ lessons: result.rows });

  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

// Get single lesson with exercises and test cases
router.get('/:lessonId', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.session.userId;

    // Get lesson data
    const lessonResult = await db.query(
      `SELECT l.*, up.is_complete, up.started_at, up.completed_at, up.time_spent_seconds
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.id = $2 AND l.is_published = TRUE`,
      [userId, lessonId]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = lessonResult.rows[0];

    // Get exercises for this lesson
    const exercisesResult = await db.query(
      `SELECT e.*, 
        COALESCE(s.score, 0) as user_score,
        s.is_complete as exercise_complete,
        cs.code as saved_code
       FROM exercises e
       LEFT JOIN submissions s ON e.id = s.exercise_id AND s.user_id = $1 AND s.is_complete = TRUE
       LEFT JOIN code_saves cs ON e.id = cs.exercise_id AND cs.user_id = $1
       WHERE e.lesson_id = $2
       ORDER BY e.order_index ASC`,
      [userId, lessonId]
    );

    // Get test cases for exercises
    const testCasesResult = await db.query(
      `SELECT tc.*, e.id as exercise_id
       FROM test_cases tc
       JOIN exercises e ON tc.exercise_id = e.id
       WHERE e.lesson_id = $1
       ORDER BY tc.exercise_id, tc.id`,
      [lessonId]
    );

    // Group test cases by exercise
    const testCasesByExercise = {};
    testCasesResult.rows.forEach(tc => {
      if (!testCasesByExercise[tc.exercise_id]) {
        testCasesByExercise[tc.exercise_id] = [];
      }
      testCasesByExercise[tc.exercise_id].push(tc);
    });

    // Add test cases to exercises
    const exercises = exercisesResult.rows.map(exercise => ({
      ...exercise,
      test_cases: testCasesByExercise[exercise.id] || []
    }));

    // Mark lesson as started if not already
    await db.query(
      `INSERT INTO user_progress (user_id, lesson_id, started_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) DO NOTHING`,
      [userId, lessonId]
    );

    // Update last accessed
    await db.query(
      `UPDATE user_progress SET last_accessed = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId]
    );

    res.json({ 
      lesson: lesson,
      exercises: exercises
    });

  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// Save user's code for a lesson
router.post('/:lessonId/save', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { code } = req.body;
    const userId = req.session.userId;

    // Save or update the code
    await db.query(
      `INSERT INTO code_saves (user_id, exercise_id, code, is_auto_save) 
       VALUES ($1, (SELECT id FROM exercises WHERE lesson_id = $2 LIMIT 1), $3, true)
       ON CONFLICT DO NOTHING`,
      [userId, lessonId, code]
    );

    // Also insert/update in a simpler way
    await db.query(
      `INSERT INTO code_saves (user_id, exercise_id, code, is_auto_save) 
       VALUES ($1, $2, $3, true)`,
      [userId, lessonId, code] // Using lessonId as exercise_id for simplicity
    );

    // Update user progress
    await db.query(
      `INSERT INTO user_progress (user_id, lesson_id, last_accessed)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id) 
       DO UPDATE SET last_accessed = CURRENT_TIMESTAMP`,
      [userId, lessonId]
    );

    res.json({ success: true });

  } catch (error) {
    console.error('Save code error:', error);
    res.json({ success: false, error: 'Failed to save code' });
  }
});

module.exports = router;
