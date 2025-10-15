const express = require('express');
const db = require('../db/db');
const crypto = require('crypto');

const router = express.Router();

const requireTeacher = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.session.role !== 'teacher' && req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Create a new class
router.post('/classes', requireTeacher, async (req, res) => {
  try {
    const { name } = req.body;
    const teacherId = req.session.userId;

    // Generate unique join code
    const joinCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const result = await db.query(
      `INSERT INTO classes (name, teacher_id, join_code)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, teacherId, joinCode]
    );

    res.json({ class: result.rows[0] });

  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Get teacher's classes
router.get('/classes', requireTeacher, async (req, res) => {
  try {
    const teacherId = req.session.userId;

    const result = await db.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM class_enrollments WHERE class_id = c.id) as student_count
       FROM classes c
       WHERE c.teacher_id = $1 AND c.is_active = TRUE
       ORDER BY c.created_at DESC`,
      [teacherId]
    );

    res.json({ classes: result.rows });

  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Get students in a class
router.get('/classes/:classId/students', requireTeacher, async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.session.userId;

    // Verify teacher owns this class
    const classCheck = await db.query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2',
      [classId, teacherId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const students = await db.query(
      `SELECT u.id, u.full_name, u.email, ce.enrolled_at,
        (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND is_complete = TRUE) as lessons_completed,
        (SELECT COUNT(DISTINCT exercise_id) FROM submissions WHERE user_id = u.id AND is_complete = TRUE) as exercises_completed,
        (SELECT AVG(score::float / max_score * 100) FROM submissions WHERE user_id = u.id) as average_score,
        u.last_login
       FROM users u
       JOIN class_enrollments ce ON u.id = ce.user_id
       WHERE ce.class_id = $1
       ORDER BY u.full_name ASC`,
      [classId]
    );

    res.json({ students: students.rows });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get detailed student progress
router.get('/students/:studentId/progress', requireTeacher, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student info
    const student = await db.query(
      `SELECT id, full_name, email FROM users WHERE id = $1`,
      [studentId]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get lesson progress
    const lessons = await db.query(
      `SELECT l.id, l.title, l.lesson_number,
        up.is_complete, up.started_at, up.completed_at, up.time_spent_seconds,
        (SELECT COUNT(*) FROM exercises WHERE lesson_id = l.id) as total_exercises,
        (SELECT COUNT(DISTINCT exercise_id) FROM submissions
         WHERE user_id = $1 AND exercise_id IN
         (SELECT id FROM exercises WHERE lesson_id = l.id)
         AND is_complete = TRUE) as completed_exercises
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       ORDER BY l.order_index ASC`,
      [studentId]
    );

    // Get recent submissions
    const recentSubmissions = await db.query(
      `SELECT s.*, e.title as exercise_title, l.title as lesson_title
       FROM submissions s
       JOIN exercises e ON s.exercise_id = e.id
       JOIN lessons l ON e.lesson_id = l.id
       WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT 10`,
      [studentId]
    );

    res.json({
      student: student.rows[0],
      lessons: lessons.rows,
      recentSubmissions: recentSubmissions.rows
    });

  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({ error: 'Failed to get student progress' });
  }
});

// Add teacher feedback to submission
router.post('/submissions/:submissionId/feedback', requireTeacher, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { feedback } = req.body;
    const teacherId = req.session.userId;

    await db.query(
      `UPDATE submissions
       SET teacher_feedback = $1, teacher_id = $2, graded_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [feedback, teacherId, submissionId]
    );

    res.json({ success: true });

  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ error: 'Failed to add feedback' });
  }
});

// Get class statistics
router.get('/classes/:classId/stats', requireTeacher, async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.session.userId;

    // Verify ownership
    const classCheck = await db.query(
      'SELECT id FROM classes WHERE id = $1 AND teacher_id = $2',
      [classId, teacherId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await db.query(
      `SELECT
        COUNT(DISTINCT ce.user_id) as total_students,
        AVG((SELECT COUNT(*) FROM user_progress WHERE user_id = ce.user_id AND is_complete = TRUE)) as avg_lessons_completed,
        AVG((SELECT AVG(score::float / max_score * 100) FROM submissions WHERE user_id = ce.user_id)) as class_average
       FROM class_enrollments ce
       WHERE ce.class_id = $1`,
      [classId]
    );

    res.json({ stats: stats.rows[0] });

  } catch (error) {
    console.error('Get class stats error:', error);
    res.status(500).json({ error: 'Failed to get class statistics' });
  }
});

// Get all students' progress (admin only)
router.get('/all-students', requireTeacher, async (req, res) => {
  try {
    // Check if user is admin (specified emails)
    const currentUser = await db.query('SELECT email FROM users WHERE id = $1', [req.session.userId]);
    const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
    
    if (!adminEmails.includes(currentUser.rows[0]?.email.toLowerCase())) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const students = await db.query(
      `SELECT 
        u.id, u.full_name, u.email, u.created_at, u.last_login,
        COALESCE(completed_lessons.count, 0) as lessons_completed,
        COALESCE(completed_exercises.count, 0) as exercises_completed,
        COALESCE(avg_score.score, 0) as average_score,
        COALESCE(total_time.seconds, 0) as total_time_seconds,
        CASE 
          WHEN u.last_login > NOW() - INTERVAL '7 days' THEN 'active'
          WHEN u.last_login > NOW() - INTERVAL '30 days' THEN 'inactive'
          ELSE 'dormant'
        END as activity_status
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) 
        FROM user_progress 
        WHERE is_complete = TRUE 
        GROUP BY user_id
      ) completed_lessons ON u.id = completed_lessons.user_id
      LEFT JOIN (
        SELECT user_id, COUNT(DISTINCT exercise_id) 
        FROM submissions 
        WHERE is_complete = TRUE 
        GROUP BY user_id
      ) completed_exercises ON u.id = completed_exercises.user_id
      LEFT JOIN (
        SELECT user_id, AVG(score::float / max_score * 100) as score
        FROM submissions 
        WHERE score IS NOT NULL AND max_score > 0
        GROUP BY user_id
      ) avg_score ON u.id = avg_score.user_id
      LEFT JOIN (
        SELECT user_id, SUM(time_spent_seconds) as seconds
        FROM user_progress 
        GROUP BY user_id
      ) total_time ON u.id = total_time.user_id
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC`
    );

    res.json({ students: students.rows });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ error: 'Failed to get students data' });
  }
});

module.exports = router;
