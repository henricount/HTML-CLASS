# 🔧 TROUBLESHOOTING GUIDE
## Registration Button Not Responding

### **Quick Diagnosis**

The registration button not responding is usually caused by one of these issues:

1. ❌ Server not running
2. ❌ Database not connected
3. ❌ Missing dependencies
4. ❌ Environment variables not set
5. ❌ JavaScript errors in browser

---

## 🎯 **STEP-BY-STEP FIX**

### **Step 1: Check If Server Is Running**

Open a terminal and run:

```bash
cd "/Users/henri-countevans/PycharmProjects/HTML Notes"
npm start
```

**Expected output:**
```
Server running on port 3000
Environment: development
Visit http://localhost:3000
Connected to PostgreSQL database
```

**If you see errors:**
- "Cannot find module" → Run `npm install`
- "Port 3000 already in use" → Kill the process or use a different port
- "Database connection error" → Continue to Step 2

---

### **Step 2: Test Server Connection**

Visit: **http://localhost:3000/test.html**

This test page will show you:
- ✅ Is server running?
- ✅ Is database connected?
- ✅ Can registration work?

**Click each test button** and look at the results.

---

### **Step 3: Check Browser Console**

1. Open http://localhost:3000 in your browser
2. Press **F12** (or right-click → Inspect)
3. Click the **Console** tab
4. Try to register again
5. **Look for error messages in red**

Common errors you might see:

#### Error: "Failed to fetch" or "Network Error"
**Problem:** Server isn't running

**Fix:**
```bash
npm start
```

#### Error: "500 Internal Server Error"
**Problem:** Database connection issue

**Fix:** Check `.env` file has correct DATABASE_URL

#### Error: "400 Bad Request - Email already registered"
**Problem:** Email already used

**Fix:** Use a different email address

#### No error but button doesn't respond
**Problem:** JavaScript not loading

**Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

### **Step 4: Verify Database Connection**

```bash
# Check if .env file exists
cat .env

# You should see DATABASE_URL
# If not, create it:
cp .env.example .env
# Then edit .env and add your DATABASE_URL
```

**Test database connection:**

```bash
# If using local PostgreSQL
psql html_journalism_course -c "SELECT 1;"

# If using Render, use the connection string
psql "YOUR_DATABASE_URL_HERE" -c "SELECT 1;"
```

**Expected:** Should return 1

**If it fails:**
- Check DATABASE_URL is correct
- Check PostgreSQL is running
- Check internet connection (if using Render)

---

### **Step 5: Verify Dependencies Are Installed**

```bash
# Check if node_modules exists
ls node_modules

# If empty or missing, install:
npm install

# Verify all packages installed:
npm list --depth=0
```

**You should see:**
- express
- pg
- bcryptjs
- jsonwebtoken
- express-session
- connect-pg-simple
- cheerio
- And others...

---

### **Step 6: Initialize Database**

If database tables don't exist, registration will fail.

```bash
npm run init-db
```

**Expected output:**
```
🔧 Initializing database...
✅ Schema created successfully
📊 Tables created:
   - users
   - lessons
   - exercises
   ... (more tables)
🎉 Database initialization complete!
```

**If you get errors:**
- "relation already exists" → **This is OK!** Tables already exist.
- "connection refused" → Database isn't running
- "authentication failed" → Wrong DATABASE_URL

---

### **Step 7: Check Environment Variables**

Your `.env` file MUST have these:

```env
# Required
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://...your-url-here...
JWT_SECRET=random-32-character-string
SESSION_SECRET=another-random-string

# Optional
ADMIN_EMAIL=teacher@example.com
ADMIN_PASSWORD=ChangeMe123!
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **Step 8: Test Registration Manually**

1. **Open test page:** http://localhost:3000/test.html

2. **Click "Test Registration"**

3. **Look at the result:**
   - ✅ Green = Success!
   - ❌ Red = Error (read the message)

4. **Check browser console (F12)** for detailed logs

---

## 🐛 **Common Specific Errors**

### **"Cannot POST /api/auth/register"**

**Problem:** Routes not loaded

**Fix:**
```bash
# Check routes/auth.js exists
ls routes/auth.js

# Restart server
npm start
```

---

### **"Email already registered"**

**Problem:** User already exists with that email

**Fix:** Use a different email or delete the user:

```bash
psql $DATABASE_URL

DELETE FROM users WHERE email = 'test@example.com';
\q
```

---

### **"Password validation failed"**

**Problem:** Password too short

**Fix:** Use password with at least 6 characters

---

### **"Role validation failed"**

**Problem:** Invalid role selected

**Fix:** Select either "student" or "teacher" from dropdown

---

### **Button spins forever (Loading...)**

**Problem:** Request hanging

**Possible causes:**
1. Server crashed
2. Database query taking too long
3. Network issue

**Fix:**
1. Check terminal where server is running
2. Look for error messages
3. Restart server: Ctrl+C then `npm start`

---

### **"TypeError: Cannot read property 'userId' of undefined"**

**Problem:** Session not initialized

**Fix:**
1. Check SESSION_SECRET in .env
2. Restart server
3. Clear browser cookies (F12 → Application → Cookies → Delete all)

---

## 🔍 **Advanced Debugging**

### **Enable Detailed Logging**

Edit `server.js` and add this after line 1:

```javascript
const express = require('express');
console.log('✓ Express loaded');

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
```

Now you'll see every request in the console.

---

### **Test API Directly with curl**

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "student"
  }'
```

**Expected:** Should return user object with success message

**If it fails:** Error message will show the problem

---

### **Check Database Tables Exist**

```bash
psql $DATABASE_URL

\dt

# You should see:
# users, lessons, exercises, test_cases, submissions, etc.

# Check users table structure:
\d users

# Exit:
\q
```

---

### **Test Database Connection in Node**

Create `test-db.js`:

```javascript
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database error:', err);
  } else {
    console.log('✅ Database connected!', res.rows[0]);
  }
  pool.end();
});
```

Run it:
```bash
node test-db.js
```

---

## ✅ **Verification Checklist**

Before asking for help, verify:

- [ ] Server is running (`npm start` shows no errors)
- [ ] Can access http://localhost:3000
- [ ] Browser console (F12) shows no errors
- [ ] `.env` file exists with DATABASE_URL
- [ ] Database is running and accessible
- [ ] `npm install` completed successfully
- [ ] Database tables exist (`npm run init-db` ran successfully)
- [ ] Test page (http://localhost:3000/test.html) shows ✅ for all tests

---

## 🆘 **Still Not Working?**

### **Nuclear Option: Fresh Start**

```bash
# 1. Stop server (Ctrl+C)

# 2. Remove everything
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install

# 4. Reset database
# WARNING: This deletes all data!
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 5. Reinitialize
npm run init-db

# 6. Restart server
npm start

# 7. Try registration again
```

---

## 📝 **Report an Issue**

If still broken, provide these details:

1. **Error message** from browser console (F12)
2. **Error message** from terminal (where server runs)
3. **Output** from test page (http://localhost:3000/test.html)
4. **Operating system** (Mac, Windows, Linux)
5. **Node version** (`node --version`)
6. **Database type** (local PostgreSQL or Render)

---

## 💡 **Quick Fixes Summary**

| Problem | Quick Fix |
|---------|-----------|
| Button doesn't respond | Check browser console (F12) |
| "Cannot POST" error | Restart server |
| "Email already registered" | Use different email |
| "Database error" | Check DATABASE_URL in .env |
| Spinning forever | Check server terminal for errors |
| 500 error | Check database connection |
| No error but doesn't work | Hard refresh (Ctrl+Shift+R) |

---

## 🎓 **Understanding the Flow**

When you click Register:

1. **JavaScript** in `login.html` runs
2. Sends **POST** request to `/api/auth/register`
3. **Express** routes it to `routes/auth.js`
4. **bcrypt** hashes the password
5. **PostgreSQL** stores the user
6. **Response** sent back to browser
7. **Redirect** to dashboard

**If any step fails, registration fails.**

Use test page to see where it breaks!

---

## 🚀 **After It Works**

Once registration works:

1. ✅ Register a teacher account
2. ✅ Register a student account
3. ✅ Test login with both
4. ✅ Create a class (as teacher)
5. ✅ Add sample exercises
6. ✅ Test code editor
7. ✅ Deploy to production!

---

*Updated: 2025-01-15*
*For more help: See QUICKSTART.md and DEPLOYMENT.md*