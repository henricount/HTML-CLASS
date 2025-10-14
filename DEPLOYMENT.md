# Deployment Guide
## HTML Journalism Course Platform

This guide will walk you through deploying the course platform to Render with PostgreSQL database, GitHub integration, and complete setup.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Database Setup on Render](#database-setup)
4. [Web Service Deployment](#web-service-deployment)
5. [Database Initialization](#database-initialization)
6. [Environment Variables](#environment-variables)
7. [First-Time Setup](#first-time-setup)
8. [Adding Course Content](#adding-course-content)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- A GitHub account
- A Render account (free tier works)
- Git installed on your computer
- Node.js 18+ installed locally (for testing)

---

## GitHub Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+ " icon → "New repository"
3. Name it: `html-journalism-course`
4. Set to Public or Private
5. DO NOT initialize with README (we have files already)
6. Click "Create repository"

### Step 2: Push Code to GitHub

Open your terminal in the project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HTML Journalism Course Platform"

# Add GitHub remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/html-journalism-course.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Your code is now on GitHub! 🎉

---

## Database Setup on Render

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `html-course-db`
   - **Database**: `html_journalism_course`
   - **User**: `html_course_admin`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click "Create Database"
5. Wait for database to provision (1-2 minutes)

### Step 2: Note Database Connection Info

Once created, you'll see:
- **Internal Database URL** (use this for your app)
- **External Database URL** (use for local testing)
- **Connection Parameters** (host, port, database name, etc.)

**IMPORTANT**: Save the Internal Database URL - you'll need it!

---

## Web Service Deployment

### Step 1: Create Web Service on Render

1. In Render Dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository:
   - Click "Connect account" if first time
   - Find and select `html-journalism-course`
3. Configure the service:
   - **Name**: `html-journalism-course`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 2: Add Environment Variables

Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | [Your Internal Database URL from Step 2] |
| `JWT_SECRET` | [Generate random 32-char string] |
| `SESSION_SECRET` | [Generate random 32-char string] |
| `ADMIN_EMAIL` | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | `ChangeThisPassword123!` |

**To generate secrets**, run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Click "Create Web Service"

The service will now build and deploy (takes 3-5 minutes).

---

## Database Initialization

Once your web service is running, initialize the database:

### Option 1: Using Render Shell

1. Go to your web service dashboard
2. Click "Shell" tab
3. Run:
```bash
node scripts/init-database.js
```

### Option 2: Using PostgreSQL Client

1. Click on your database service
2. Click "Connect" → "External Connection"
3. Use `psql` command shown or use a GUI tool like pgAdmin
4. Copy and paste contents of `db/schema.sql`
5. Execute the SQL

### Verify Database Setup

Check that tables were created:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see: users, lessons, exercises, test_cases, submissions, etc.

---

## Environment Variables Reference

### Required Variables

- **NODE_ENV**: Set to `production`
- **PORT**: Port number (Render sets this automatically)
- **DATABASE_URL**: PostgreSQL connection string from Render
- **JWT_SECRET**: Secret for JSON Web Tokens (32+ characters)
- **SESSION_SECRET**: Secret for sessions (32+ characters)

### Optional Variables

- **ADMIN_EMAIL**: Default admin account email
- **ADMIN_PASSWORD**: Default admin account password (change after first login!)
- **FRONTEND_URL**: Your app URL (for CORS)
- **GRADING_TIMEOUT**: Timeout for auto-grading (default: 5000ms)
- **MAX_CODE_SIZE**: Max code submission size (default: 50000)

---

## First-Time Setup

### Step 1: Access Your Application

Your app will be at: `https://html-journalism-course.onrender.com`

(Or whatever name you chose)

### Step 2: Create Admin Account

1. Go to your app URL
2. Click "Register" (first user becomes admin if using default setup)
3. Or login with credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD`

### Step 3: Change Admin Password

1. Login as admin
2. Go to Settings/Profile
3. Change password immediately!

---

## Adding Course Content

### Method 1: Using Admin Dashboard

1. Login as admin/teacher
2. Go to "Manage Lessons"
3. Click "Add Lesson"
4. Fill in lesson details
5. Add exercises for each lesson
6. Configure auto-grading test cases

### Method 2: Using SQL Scripts

Create a file `scripts/add-lesson-content.sql`:

```sql
-- Example: Add Lesson 2 with exercises

-- Update lesson content
UPDATE lessons
SET content_html = 'Your HTML lesson content here'
WHERE lesson_number = 2;

-- Add exercise
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  2,
  'HTML Attributes Practice',
  'Learn to use HTML attributes correctly',
  'beginner',
  '<!DOCTYPE html>\n<html>\n<head>\n  <title>Practice</title>\n</head>\n<body>\n  <!-- Add your code here -->\n</body>\n</html>',
  '<h3>Create an image with proper attributes</h3><ul><li>Add an image tag</li><li>Include src attribute</li><li>Include alt attribute</li></ul>',
  10,
  1
);

-- Add test cases for auto-grading
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
(
  (SELECT id FROM exercises WHERE title = 'HTML Attributes Practice'),
  'html_tag_exists',
  '{"tag": "img", "minCount": 1}',
  3,
  'You need to add an <img> tag'
),
(
  (SELECT id FROM exercises WHERE title = 'HTML Attributes Practice'),
  'attribute_exists',
  '{"tag": "img", "attribute": "src"}',
  3,
  'Your <img> tag needs a src attribute'
),
(
  (SELECT id FROM exercises WHERE title = 'HTML Attributes Practice'),
  'attribute_exists',
  '{"tag": "img", "attribute": "alt"}',
  4,
  'Your <img> tag needs an alt attribute for accessibility'
);
```

Run in Render Shell:
```bash
psql $DATABASE_URL < scripts/add-lesson-content.sql
```

---

## Auto-Grading Test Cases

### Available Test Types

1. **html_tag_exists**
```json
{
  "tag": "p",
  "minCount": 1
}
```

2. **html_tag_count**
```json
{
  "tag": "h1",
  "count": 1,
  "operator": "eq"
}
```

3. **attribute_exists**
```json
{
  "tag": "img",
  "attribute": "alt"
}
```

4. **attribute_value**
```json
{
  "tag": "a",
  "attribute": "href",
  "value": "https://",
  "matchType": "starts"
}
```

5. **css_property**
```json
{
  "selector": "body",
  "property": "background-color"
}
```

6. **text_content**
```json
{
  "tag": "h1",
  "text": "Welcome",
  "matchType": "contains"
}
```

7. **class_exists**
```json
{
  "className": "intro"
}
```

8. **id_exists**
```json
{
  "id": "main-content"
}
```

9. **nested_structure**
```json
{
  "parent": "figure",
  "child": "figcaption"
}
```

10. **semantic_html**
```json
{
  "requiredTags": ["header", "nav", "main", "footer"]
}
```

### Example: Complete Exercise with Tests

```sql
-- Exercise: Create a news article header
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  1,
  'News Article Header',
  'Create a proper header for a news article',
  'beginner',
  '<!DOCTYPE html>\n<html>\n<head>\n  <title>News Article</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>',
  '<h3>Requirements:</h3><ul><li>Add a main <code>&lt;header&gt;</code> tag</li><li>Include an <code>&lt;h1&gt;</code> headline</li><li>Add a byline with author name</li><li>Include publication date</li></ul>',
  20,
  1
);

-- Test cases
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
((SELECT id FROM exercises WHERE title = 'News Article Header' LIMIT 1),
 'semantic_html', '{"requiredTags": ["header"]}', 5, 'Use a <header> tag for semantic HTML'),

((SELECT id FROM exercises WHERE title = 'News Article Header' LIMIT 1),
 'html_tag_count', '{"tag": "h1", "count": 1, "operator": "eq"}', 5, 'Include exactly one <h1> headline'),

((SELECT id FROM exercises WHERE title = 'News Article Header' LIMIT 1),
 'nested_structure', '{"parent": "header", "child": "h1"}', 5, 'The <h1> should be inside the <header>'),

((SELECT id FROM exercises WHERE title = 'News Article Header' LIMIT 1),
 'text_content', '{"tag": "h1", "text": ".+", "matchType": "regex"}', 5, 'Your headline needs text content');
```

---

## Troubleshooting

### Application won't start

**Check logs**:
1. Go to Render dashboard
2. Click on your web service
3. Click "Logs" tab
4. Look for error messages

**Common issues**:
- Missing environment variables
- Database connection failed
- Port already in use

**Solutions**:
- Verify all environment variables are set
- Check DATABASE_URL is correct (use Internal URL)
- Render handles PORT automatically

### Database connection errors

**Error**: "Connection refused" or "timeout"

**Solution**:
- Use **Internal Database URL** not External
- Check database is in same region as web service
- Verify database is running (green status in Render)

### Auto-grading not working

**Check**:
- Test cases exist in database
- Exercise ID matches test_cases.exercise_id
- test_config JSON is valid

**Debug**:
```sql
SELECT * FROM test_cases WHERE exercise_id = [YOUR_EXERCISE_ID];
```

### Students can't register

**Check**:
- CORS settings in server.js
- Session secret is set
- Database users table exists

### Monaco Editor not loading

**Check**:
- Internet connection (Monaco loads from CDN)
- Content Security Policy in server.js
- Browser console for errors

---

## Updating the Application

### Push updates to GitHub:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Render will automatically rebuild and deploy! 🚀

### Manual deploy:

1. Go to Render dashboard
2. Click on your web service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## Backup and Restore

### Backup Database

```bash
# From Render Shell or local terminal with DATABASE_URL
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database

```bash
psql $DATABASE_URL < backup.sql
```

---

## Scaling Considerations

### Free Tier Limitations:
- Database: 90 days retention
- Web service: Spins down after 15 min inactivity
- 750 hours/month

### Upgrading:
- Paid tiers: ~$7/month for database
- ~$7/month for web service
- No spin-down, better performance

---

## Security Best Practices

1. **Change default passwords** immediately after deployment
2. **Use strong secrets** for JWT and session
3. **Enable HTTPS** (Render does this automatically)
4. **Regular backups** of database
5. **Keep dependencies updated**: `npm update`
6. **Monitor logs** for suspicious activity
7. **Limit admin accounts** to trusted teachers only

---

## Support

### Need help?

- Check Render docs: https://render.com/docs
- Node.js docs: https://nodejs.org/docs
- PostgreSQL docs: https://www.postgresql.org/docs/

### Common commands:

```bash
# View logs
render logs

# Open shell
render shell

# Restart service
render restart
```

---

## Next Steps

After successful deployment:

1. ✅ Test login/registration
2. ✅ Create a class as teacher
3. ✅ Add first lesson and exercise
4. ✅ Test student registration with class code
5. ✅ Complete an exercise as student
6. ✅ Verify auto-grading works
7. ✅ Check teacher dashboard shows progress

**Your platform is ready for students!** 🎓

---

*Last updated: 2025*