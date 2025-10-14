const express = require('express');
const db = require('../db/db');

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get user's overall progress
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const progressData = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM lessons WHERE is_published = TRUE) as total_lessons,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND is_complete = TRUE) as completed_lessons,
        (SELECT COUNT(*) FROM exercises) as total_exercises,
        (SELECT COUNT(DISTINCT exercise_id) FROM submissions WHERE user_id = $1 AND is_complete = TRUE) as completed_exercises,
        (SELECT AVG(score::float / max_score * 100) FROM submissions WHERE user_id = $1) as average_score,
        (SELECT SUM(time_spent_seconds) FROM user_progress WHERE user_id = $1) as total_time_seconds`,
      [userId]
    );

    const stats = progressData.rows[0];

    // Get achievements
    const achievements = await db.query(
      `SELECT a.*, ua.earned_at
       FROM achievements a
       LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
       ORDER BY ua.earned_at DESC NULLS LAST`,
      [userId]
    );

    res.json({
      stats: {
        totalLessons: parseInt(stats.total_lessons),
        completedLessons: parseInt(stats.completed_lessons),
        totalExercises: parseInt(stats.total_exercises),
        completedExercises: parseInt(stats.completed_exercises),
        averageScore: parseFloat(stats.average_score) || 0,
        totalTimeSeconds: parseInt(stats.total_time_seconds) || 0
      },
      achievements: achievements.rows
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Update time spent on lesson
router.post('/time', requireAuth, async (req, res) => {
  try {
    const { lessonId, seconds } = req.body;
    const userId = req.session.userId;

    await db.query(
      `UPDATE user_progress
       SET time_spent_seconds = time_spent_seconds + $1
       WHERE user_id = $2 AND lesson_id = $3`,
      [seconds, userId, lessonId]
    );

    res.json({ success: true });

  } catch (error) {
    console.error('Update time error:', error);
    res.status(500).json({ error: 'Failed to update time' });
  }
});

module.exports = router;