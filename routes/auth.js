const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db/db');

const router = express.Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().notEmpty(),
    body('role').isIn(['student', 'teacher'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let { email, password, fullName, role, classCode } = req.body;
      
      // Force student role for everyone except specified admin emails
      const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
      if (!adminEmails.includes(email.toLowerCase())) {
        role = 'student';
      }

      // Check if user already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await db.query(
        `INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, full_name, role`,
        [email, passwordHash, fullName, role]
      );

      const user = result.rows[0];

      // If student and has class code, enroll them
      if (role === 'student' && classCode) {
        const classResult = await db.query(
          'SELECT id FROM classes WHERE join_code = $1 AND is_active = TRUE',
          [classCode]
        );

        if (classResult.rows.length > 0) {
          await db.query(
            'INSERT INTO class_enrollments (class_id, user_id) VALUES ($1, $2)',
            [classResult.rows[0].id, user.id]
          );
        }
      }

      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Ensure session is saved before responding
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          },
          token
        });
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const result = await db.query(
        `SELECT id, email, password_hash, full_name, role, is_active
         FROM users WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Create session
      req.session.userId = user.id;
      req.session.role = user.role;

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Ensure session is saved before responding
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          },
          token
        });
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Forgot password request
router.post('/forgot-password',
  [
    body('email').isEmail().normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      // Check if user exists
      const result = await db.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email]
      );

      // Always return success to prevent email enumeration
      res.json({ 
        success: true, 
        message: 'If an account with that email exists, a reset link has been sent.' 
      });

      // Only actually process if user exists
      if (result.rows.length > 0) {
        // In a real app, you would:
        // 1. Generate a secure reset token
        // 2. Store it in database with expiration
        // 3. Send email with reset link
        console.log(`Password reset requested for: ${email}`);
        
        // For demo purposes, we'll just log it
        // TODO: Implement actual email sending with reset token
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Password reset failed' });
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await db.query(
      `SELECT id, email, full_name, role, created_at, last_login
       FROM users WHERE id = $1`,
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Check if user is admin
router.get('/admin-check', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ isAdmin: false, authenticated: false });
    }

    const result = await db.query(
      'SELECT email FROM users WHERE id = $1',
      [req.session.userId]
    );

    if (result.rows.length === 0) {
      return res.json({ isAdmin: false, authenticated: false });
    }

    const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
    const isAdmin = adminEmails.includes(result.rows[0].email.toLowerCase());

    res.json({ 
      isAdmin, 
      authenticated: true, 
      email: result.rows[0].email 
    });

  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Failed to check admin status' });
  }
});

module.exports = router;
