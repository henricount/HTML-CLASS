# 🚀 QUICK START GUIDE
## Get Your Platform Running in 10 Minutes

This guide will get you from zero to a fully functional platform in minutes!

---

## ✅ **Prerequisites Checklist**

Before you begin, make sure you have:
- [ ] Node.js 18+ installed ([Download here](https://nodejs.org/))
- [ ] A GitHub account ([Sign up](https://github.com/signup))
- [ ] A Render account ([Sign up](https://dashboard.render.com/register))

Test Node.js installation:
```bash
node --version  # Should show v18 or higher
npm --version   # Should show 9 or higher
```

---

## 📦 **Step 1: Install Dependencies** (2 minutes)

Open terminal in your project folder:

```bash
cd "/Users/henri-countevans/PycharmProjects/HTML Notes"

# Install all dependencies
npm install

# This installs:
# - express (web server)
# - pg (PostgreSQL database)
# - bcryptjs (password hashing)
# - jsonwebtoken (authentication)
# - express-session + connect-pg-simple (session management)
# - cheerio (HTML parsing for auto-grading)
# - and more...
```

**Expected output:** "added XX packages" with no errors

---

## 🗄️ **Step 2: Set Up Database** (Choose One)

### **Option A: Use Render PostgreSQL (Recommended for Production)**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Name it: `html-course-db`
4. Select **Free** plan
5. Click "Create Database"
6. **Copy the "Internal Database URL"** (looks like `postgresql://...`)

### **Option B: Use Local PostgreSQL (For Testing)**

```bash
# Install PostgreSQL locally
# Mac: brew install postgresql
# Ubuntu: sudo apt install postgresql
# Windows: Download from postgresql.org

# Start PostgreSQL
# Mac: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb html_journalism_course

# Your DATABASE_URL will be:
# postgresql://localhost/html_journalism_course
```

---

## 🔐 **Step 3: Configure Environment** (1 minute)

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` with your favorite text editor:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (paste your URL from Step 2)
DATABASE_URL=postgresql://your-database-url-here

# Security (generate random strings)
JWT_SECRET=your-random-32-character-string-here
SESSION_SECRET=another-random-32-character-string

# Admin account
ADMIN_EMAIL=teacher@example.com
ADMIN_PASSWORD=ChangeMe123!

# Optional
FRONTEND_URL=http://localhost:3000
```

**Generate secure secrets:**
```bash
# Run this twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎬 **Step 4: Initialize Database** (1 minute)

```bash
npm run init-db
```

**Expected output:**
```
🔧 Initializing database...
📝 Executing schema...
✅ Schema created successfully
📊 Tables created:
   - users
   - lessons
   - exercises
   - test_cases
   - submissions
   - user_progress
   ... (and more)
🎉 Database initialization complete!
```

**If you get an error:**
- Check your DATABASE_URL is correct
- Make sure PostgreSQL is running
- Check your internet connection (if using Render)

---

## 🎯 **Step 5: Start the Server** (10 seconds)

```bash
npm start
```

**Expected output:**
```
Server running on port 3000
Environment: development
Visit http://localhost:3000
Connected to PostgreSQL database
```

**Keep this terminal window open!**

---

## 🌐 **Step 6: Test Your Platform** (2 minutes)

1. **Open your browser:** http://localhost:3000

2. **You should see:** Login/Register page

3. **Register a teacher account:**
   - Click "Register" tab
   - Fill in:
     - Full Name: Your Name
     - Email: teacher@test.com
     - Password: Test123!
     - Role: Teacher
   - Click "Create Account"

4. **You should be redirected to:** Dashboard

**Congratulations! Your platform is running!** 🎉

---

## 📚 **Step 7: Add Course Content** (3 minutes)

Now you need to add lessons and exercises. Here's a quick example:

### Add Sample Exercise

Run this SQL in your database (use pgAdmin, psql, or Render's SQL console):

```sql
-- Add an exercise to Lesson 1
INSERT INTO exercises (
  lesson_id,
  title,
  description,
  difficulty,
  starter_code,
  instructions,
  max_points,
  order_index
) VALUES (
  1,  -- Lesson 1: HTML Basics
  'Your First HTML Page',
  'Create a basic HTML page structure',
  'beginner',
  '<!-- Write your HTML here -->',
  '<h3>Requirements:</h3><ul><li>Add DOCTYPE declaration</li><li>Create html, head, and body tags</li><li>Add a title in the head</li><li>Add an h1 heading in the body</li></ul>',
  20,
  1
);

-- Add auto-grading tests
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
-- Test 1: Check for html tag
((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists',
 '{"tag": "html"}',
 5,
 'You need an <html> tag'),

-- Test 2: Check for head tag
((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists',
 '{"tag": "head"}',
 5,
 'You need a <head> tag'),

-- Test 3: Check for body tag
((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists',
 '{"tag": "body"}',
 5,
 'You need a <body> tag'),

-- Test 4: Check for h1 tag
((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists',
 '{"tag": "h1"}',
 5,
 'You need an <h1> heading');
```

**To run SQL:**

**If using Render:**
1. Go to your database in Render dashboard
2. Click "Connect" → "External Connection"
3. Copy the PSQL command
4. Paste it in terminal
5. Paste the SQL above
6. Type `\q` to exit

**If using local PostgreSQL:**
```bash
psql html_journalism_course < your-sql-file.sql
```

---

## 🧪 **Step 8: Test As Student** (2 minutes)

1. **Logout** from teacher account
2. **Register as student:**
   - Click "Register"
   - Role: Student
   - Leave class code empty (for now)
3. **Go to Dashboard**
4. **Click "Start Lesson" on Lesson 1**
5. **Click on the exercise** you just created
6. **Try the code editor!**

---

## 🎨 **What You Can Do Now**

### As Teacher:
- ✅ Create classes
- ✅ Get join codes
- ✅ View student progress
- ✅ Add more exercises
- ✅ Review submissions

### As Student:
- ✅ Code in browser
- ✅ See live preview
- ✅ Get instant feedback
- ✅ Track progress
- ✅ Earn achievements

---

## 🌍 **Deploy to Internet** (Optional - 10 minutes)

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Render and make it accessible worldwide!

Quick version:
1. Push code to GitHub
2. Connect GitHub to Render
3. Add environment variables
4. Deploy!

Your students can access it from anywhere! 🌐

---

## 🆘 **Troubleshooting**

### "Cannot connect to database"
```bash
# Check your DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"
```bash
# Use a different port
PORT=3001 npm start

# Or kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### "Session expired immediately"
- Make sure SESSION_SECRET is set in .env
- Check that PostgreSQL session table was created
- Clear your browser cookies

### "Auto-grading returns 0"
- Check test cases exist in database
- Verify test_config JSON is valid
- Check exercise_id matches

---

## 📖 **Next Steps**

1. **Read the full docs:** [README_DEPLOYMENT.md](./README_DEPLOYMENT.md)
2. **Add more exercises:** See examples in DEPLOYMENT.md
3. **Customize styling:** Edit CSS in public/*.html files
4. **Deploy to production:** Follow DEPLOYMENT.md
5. **Share with students!**

---

## 💡 **Quick Tips**

### Adding Exercises Faster

Create a SQL file `add-exercises.sql`:

```sql
-- Exercise 2
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (1, 'Add a Paragraph', 'Practice using paragraph tags', 'beginner',
'<!DOCTYPE html>\n<html>\n<body>\n  <!-- Add paragraph here -->\n</body>\n</html>',
'<p>Add at least 2 paragraphs about yourself</p>', 10, 2);

INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Add a Paragraph'),
 'html_tag_count', '{"tag": "p", "count": 2, "operator": "gte"}', 10, 'Add at least 2 paragraphs');
```

Then run:
```bash
psql $DATABASE_URL < add-exercises.sql
```

### Check What's in Database

```bash
psql $DATABASE_URL

# List all tables
\dt

# See all lessons
SELECT * FROM lessons;

# See all exercises
SELECT id, title, lesson_id FROM exercises;

# See all test cases
SELECT * FROM test_cases;

# Exit
\q
```

### View Logs

```bash
# If running with npm start, logs show in terminal

# For production (Render), view in dashboard under "Logs" tab
```

---

## ✅ **Success Checklist**

You're ready when you can:
- [ ] Access http://localhost:3000
- [ ] Register teacher and student accounts
- [ ] See dashboard with lessons
- [ ] Open code editor
- [ ] Submit code and see grading results
- [ ] View progress stats

---

## 🎓 **You're All Set!**

Your platform is now ready for students!

**Need help?** Check:
1. This guide again
2. [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
3. [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) for features
4. Error messages in terminal

**Happy teaching!** 🚀📚

---

*Last updated: 2025-01-15*