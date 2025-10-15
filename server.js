const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const { pool } = require('./db/db');
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const exerciseRoutes = require('./routes/exercises');
const progressRoutes = require('./routes/progress');
const teacherRoutes = require('./routes/teacher');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - Relaxed for development
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for now to debug
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware with PostgreSQL store
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for localhost development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));
app.use('/lessons', express.static('lessons'));
// Serve lesson HTML files from root
app.use(express.static(__dirname, {
  index: false,
  extensions: ['html']
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/teacher', teacherRoutes);

// Serve main application
app.get('/', async (req, res) => {
  if (req.session.userId) {
    // Check if user is admin
    try {
      const userResult = await require('./db/db').query('SELECT email FROM users WHERE id = $1', [req.session.userId]);
      const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
      
      console.log('User check:', {
        userId: req.session.userId,
        userEmail: userResult.rows[0]?.email,
        isAdmin: userResult.rows.length > 0 && adminEmails.includes(userResult.rows[0]?.email.toLowerCase())
      });
      
      if (userResult.rows.length > 0 && adminEmails.includes(userResult.rows[0].email.toLowerCase())) {
        console.log('Serving teacher dashboard');
        res.sendFile(path.join(__dirname, 'public', 'teacher-dashboard.html'));
      } else {
        console.log('Serving student dashboard');
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
      }
    } catch (error) {
      console.error('Admin check error:', error);
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Add explicit route for dashboard
app.get('/dashboard.html', async (req, res) => {
  if (req.session.userId) {
    // Check if user is admin for dashboard selection
    try {
      const userResult = await require('./db/db').query('SELECT email FROM users WHERE id = $1', [req.session.userId]);
      const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
      
      if (userResult.rows.length > 0 && adminEmails.includes(userResult.rows[0].email.toLowerCase())) {
        res.sendFile(path.join(__dirname, 'public', 'teacher-dashboard.html'));
      } else {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
      }
    } catch (error) {
      console.error('Dashboard route error:', error);
      res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }
  } else {
    res.redirect('/');
  }
});

// Add explicit route for login for consistency
app.get('/login.html', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard.html');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

// Explicit teacher dashboard route
app.get('/teacher-dashboard.html', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  
  try {
    const userResult = await require('./db/db').query('SELECT email FROM users WHERE id = $1', [req.session.userId]);
    const adminEmails = ['henricount@digimethods.dev', 'henricount@gmail.com'];
    
    if (userResult.rows.length > 0 && adminEmails.includes(userResult.rows[0].email.toLowerCase())) {
      res.sendFile(path.join(__dirname, 'public', 'teacher-dashboard.html'));
    } else {
      res.redirect('/dashboard.html');
    }
  } catch (error) {
    console.error('Teacher dashboard access error:', error);
    res.redirect('/dashboard.html');
  }
});

// Routes for lesson HTML files
app.get('/lesson:lessonNumber.html', (req, res) => {
  const lessonNumber = req.params.lessonNumber;
  const filePath = path.join(__dirname, `lesson${lessonNumber}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Lesson not found' });
    }
  });
});

// Generic lesson route that redirects to specific lesson files
app.get('/lesson.html', (req, res) => {
  const lessonId = req.query.id;
  if (!lessonId) {
    return res.status(400).json({ error: 'Lesson ID required' });
  }
  // Redirect to the corresponding lesson HTML file
  res.redirect(`/lesson${lessonId}.html`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Visit http://localhost:${PORT}`);
});

module.exports = app;