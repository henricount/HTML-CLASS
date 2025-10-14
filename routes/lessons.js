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

// Get single lesson
router.get('/:lessonId', requireAuth, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.session.userId;

    const result = await db.query(
      `SELECT l.*, up.is_complete, up.started_at, up.completed_at
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.id = $2 AND l.is_published = TRUE`,
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

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

    res.json({ lesson: result.rows[0] });

  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

module.exports = router;