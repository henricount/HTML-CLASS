# HTML Journalism Course Platform
## Full-Stack Web Application with Auto-Grading & Progress Tracking

A comprehensive, cloud-based platform for teaching HTML/CSS to journalism students with:
- ✅ **Student login/registration**
- ✅ **In-browser code editor** (Monaco Editor)
- ✅ **Live preview** of HTML/CSS
- ✅ **Automatic grading** system
- ✅ **Progress tracking** database
- ✅ **Teacher dashboard** to monitor students
- ✅ **Cloud-based** - runs on Render
- ✅ **GitHub integration**

---

## 🚀 Quick Start

### For Instructors/Admins

1. **Deploy to Render** (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. **Initialize database** with course content
3. **Create teacher account**
4. **Generate class code**
5. **Share with students**

### For Students

1. **Visit course URL** provided by instructor
2. **Register** with class code
3. **Start learning** - all coding in the browser!
4. **Get instant feedback** from auto-grading

---

## 📋 What's Included

### Backend (Node.js/Express)
```
routes/
├── auth.js          # Login, registration, session management
├── lessons.js       # Lesson delivery and progress tracking
├── exercises.js     # Exercise management and auto-grading
├── progress.js      # Student progress analytics
└── teacher.js       # Teacher dashboard and class management

utils/
└── autoGrader.js    # Auto-grading engine with 10+ test types

db/
├── db.js            # PostgreSQL connection pool
└── schema.sql       # Complete database schema
```

### Frontend
```
public/
├── login.html          # Login/registration page
├── dashboard.html      # Student dashboard
├── code-editor.html    # Monaco editor + live preview
└── teacher-dashboard.html  # Teacher analytics

Features:
- Monaco Editor (VS Code's editor)
- Real-time HTML/CSS preview
- Auto-save every 30 seconds
- Submit & grade with visual feedback
- Responsive design
```

### Database (PostgreSQL)
```
Tables:
- users              # Students and teachers
- lessons            # Course lessons
- exercises          # Practice exercises
- test_cases         # Auto-grading criteria
- submissions        # Student submissions with scores
- user_progress      # Lesson completion tracking
- code_saves         # Auto-saved student work
- achievements       # Gamification badges
- classes            # Teacher-managed classes
- class_enrollments  # Student-class relationships
```

---

## 🎯 Key Features

### 1. Auto-Grading System

The platform automatically grades student submissions using 10+ test types:

```javascript
// Example: Check for required HTML tags
{
  test_type: 'html_tag_exists',
  test_config: { tag: 'header', minCount: 1 },
  points: 5,
  error_message: 'Missing <header> tag'
}

// Example: Verify CSS properties
{
  test_type: 'css_property',
  test_config: { selector: 'body', property: 'background-color' },
  points: 3,
  error_message: 'Add a background color to body'
}
```

**Supported Test Types:**
1. `html_tag_exists` - Check if tag is present
2. `html_tag_count` - Count specific tags
3. `attribute_exists` - Verify attributes
4. `attribute_value` - Check attribute values
5. `css_property` - Validate CSS properties
6. `text_content` - Check text content
7. `class_exists` - Verify CSS classes
8. `id_exists` - Check for IDs
9. `nested_structure` - Validate HTML nesting
10. `semantic_html` - Ensure semantic tags used

### 2. In-Browser Code Editor

Students code entirely in the browser - no software to install!

- **Monaco Editor** - Same editor as VS Code
- **Syntax highlighting** for HTML/CSS
- **Auto-completion** and IntelliSense
- **Live preview** updates as you type
- **Auto-save** - work is never lost
- **Full-screen mode** for focus

### 3. Teacher Dashboard

Track every student's progress in real-time:

```
Class Overview:
- Total students enrolled
- Average completion rate
- Class average score
- Active students this week

Individual Student View:
- Lessons completed (7/7)
- Exercises passed (42/45)
- Average score (87%)
- Time spent (6.5 hours)
- Recent submissions
- Stuck on which exercise
```

### 4. Progress Tracking

Every action is recorded:

- When student started/completed each lesson
- All code submissions (with history)
- Time spent on each lesson
- Number of attempts per exercise
- Achievement badges earned

### 5. Achievement System

Gamification to motivate students:

- 🏆 First Steps - Complete first lesson
- ⚡ Quick Learner - 3 lessons in one day
- 💯 Perfect Score - 100% on any exercise
- 🎓 HTML Expert - Complete all HTML lessons
- 🎨 CSS Ninja - Complete all CSS lessons
- 📰 Final Project - Complete news article

---

## 💻 Technology Stack

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **express-session** - Session management
- **Cheerio** - HTML parsing for grading

### Frontend
- **Monaco Editor** - Code editor (from VS Code)
- **Vanilla JavaScript** - No framework bloat
- **Modern CSS** - Flexbox, Grid, Variables
- **Responsive Design** - Works on all devices

### Infrastructure
- **Render** - Cloud hosting (free tier available)
- **GitHub** - Version control
- **PostgreSQL on Render** - Managed database

---

## 📁 Project Structure

```
html-journalism-course/
├── server.js                 # Main application entry
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── render.yaml               # Render deployment config
│
├── db/
│   ├── db.js                 # Database connection
│   └── schema.sql            # Database schema
│
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── lessons.js            # Lesson routes
│   ├── exercises.js          # Exercise routes
│   ├── progress.js           # Progress routes
│   └── teacher.js            # Teacher dashboard routes
│
├── utils/
│   └── autoGrader.js         # Auto-grading engine
│
├── public/
│   ├── login.html            # Login page
│   ├── dashboard.html        # Student dashboard
│   ├── code-editor.html      # Code editor interface
│   ├── teacher-dashboard.html # Teacher interface
│   └── styles/               # CSS files
│
├── scripts/
│   └── init-database.js      # Database initialization
│
├── lessons/                  # Original static lessons (reference)
│   ├── lesson1.html
│   ├── lesson2.html
│   └── ...
│
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

---

## 🔧 Installation & Setup

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/html-journalism-course.git
cd html-journalism-course
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Set up PostgreSQL:**
```bash
# Install PostgreSQL locally or use a cloud instance
createdb html_journalism_course
```

5. **Initialize database:**
```bash
npm run init-db
```

6. **Start the server:**
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

7. **Visit:** http://localhost:3000

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Render deployment instructions.

---

## 🎓 Usage Guide

### For Teachers

1. **Create Account**
   - Register as "teacher" role
   - Verify email (if enabled)

2. **Create a Class**
   - Go to Teacher Dashboard
   - Click "New Class"
   - Get your unique join code (e.g., "A7F3D2")

3. **Share Join Code**
   - Give code to students
   - Students use it during registration

4. **Add Course Content**
   - Create lessons with HTML content
   - Add exercises with starter code
   - Configure auto-grading test cases

5. **Monitor Progress**
   - View class statistics
   - Check individual student progress
   - See which exercises are causing difficulties
   - Add manual feedback to submissions

### For Students

1. **Register**
   - Visit course URL
   - Use class code from teacher
   - Create account

2. **Start Learning**
   - Dashboard shows all lessons
   - Click lesson to start
   - Read instructions
   - Code in browser
   - See live preview

3. **Submit Work**
   - Click "Submit & Grade"
   - Get instant feedback
   - See which tests passed/failed
   - Revise and resubmit

4. **Track Progress**
   - View completion percentage
   - See achievements earned
   - Check average score

---

## 🧪 Auto-Grading Examples

### Example 1: Basic HTML Structure

```javascript
// Exercise: Create a basic webpage
{
  title: "Basic HTML Page",
  starter_code: "<!-- Write your code here -->",
  test_cases: [
    {
      test_type: "html_tag_exists",
      test_config: { tag: "html" },
      points: 2
    },
    {
      test_type: "html_tag_exists",
      test_config: { tag: "head" },
      points: 2
    },
    {
      test_type: "html_tag_exists",
      test_config: { tag: "body" },
      points: 2
    },
    {
      test_type: "html_tag_count",
      test_config: { tag: "h1", count: 1, operator: "eq" },
      points: 2
    },
    {
      test_type: "html_tag_count",
      test_config: { tag: "p", count: 2, operator: "gte" },
      points: 2
    }
  ]
}
```

### Example 2: Image with Attributes

```javascript
{
  title: "Add Image with Alt Text",
  test_cases: [
    {
      test_type: "html_tag_exists",
      test_config: { tag: "img" },
      points: 3,
      error_message: "Add an <img> tag"
    },
    {
      test_type: "attribute_exists",
      test_config: { tag: "img", attribute: "src" },
      points: 3,
      error_message: "Image needs a 'src' attribute"
    },
    {
      test_type: "attribute_exists",
      test_config: { tag: "img", attribute: "alt" },
      points: 4,
      error_message: "Image needs 'alt' text for accessibility"
    }
  ]
}
```

### Example 3: CSS Styling

```javascript
{
  title: "Style a Paragraph",
  test_cases: [
    {
      test_type: "css_property",
      test_config: { selector: "p", property: "color" },
      points: 5,
      error_message: "Add a color property to paragraphs"
    },
    {
      test_type: "css_property",
      test_config: { selector: "p", property: "font-size" },
      points: 5,
      error_message: "Set a font-size for paragraphs"
    }
  ]
}
```

### Example 4: Semantic HTML

```javascript
{
  title: "Create News Article Structure",
  test_cases: [
    {
      test_type: "semantic_html",
      test_config: { requiredTags: ["article", "header", "footer"] },
      points: 10,
      error_message: "Use semantic HTML tags: <article>, <header>, <footer>"
    },
    {
      test_type: "nested_structure",
      test_config: { parent: "article", child: "header" },
      points: 5,
      error_message: "Put <header> inside <article>"
    }
  ]
}
```

---

## 📊 Database Schema Highlights

### Key Relationships

```
users (1) → (many) submissions
users (1) → (many) user_progress
users (1) → (many) class_enrollments

lessons (1) → (many) exercises
lessons (1) → (many) user_progress

exercises (1) → (many) test_cases
exercises (1) → (many) submissions

classes (1) → (many) class_enrollments
classes (many) → (1) users (teacher)
```

### Important Queries

**Get student progress:**
```sql
SELECT
  l.title,
  up.is_complete,
  up.time_spent_seconds,
  COUNT(DISTINCT s.id) as submissions_count,
  AVG(s.score::float / s.max_score * 100) as avg_score
FROM lessons l
LEFT JOIN user_progress up ON l.id = up.lesson_id
LEFT JOIN exercises e ON l.id = e.lesson_id
LEFT JOIN submissions s ON e.id = s.exercise_id AND s.user_id = up.user_id
WHERE up.user_id = $1
GROUP BY l.id, up.id;
```

**Class statistics:**
```sql
SELECT
  AVG(completed_lessons) as avg_lessons,
  AVG(avg_score) as class_average
FROM (
  SELECT
    u.id,
    COUNT(DISTINCT CASE WHEN up.is_complete THEN up.lesson_id END) as completed_lessons,
    AVG(s.score::float / s.max_score * 100) as avg_score
  FROM users u
  JOIN class_enrollments ce ON u.id = ce.user_id
  LEFT JOIN user_progress up ON u.id = up.user_id
  LEFT JOIN submissions s ON u.id = s.user_id
  WHERE ce.class_id = $1
  GROUP BY u.id
) student_stats;
```

---

## 🔐 Security Features

- **bcrypt** password hashing (10 rounds)
- **JWT** for stateless authentication
- **Sessions** with secure cookies
- **SQL injection** prevention (parameterized queries)
- **XSS protection** (helmet middleware)
- **CORS** configuration
- **Input validation** (express-validator)
- **Rate limiting** (can be added)
- **HTTPS** enforced in production

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot connect to database"**
```bash
# Check DATABASE_URL is set correctly
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**2. "Monaco editor not loading"**
- Check internet connection (loads from CDN)
- Check browser console for errors
- Verify CSP settings in server.js

**3. "Auto-grading returns 0 points"**
- Check test_cases exist for exercise
- Verify test_config JSON is valid
- Review autograding logs in server

**4. "Session expired immediately"**
- Check SESSION_SECRET is set
- Verify cookie settings
- Check if using HTTPS in production

---

## 📈 Scaling & Performance

### Current Limits (Free Tier)
- **Database**: 1 GB storage, 1 GB RAM
- **Web service**: 512 MB RAM
- **Concurrent users**: ~50-100

### Optimization Tips
1. **Add database indexes** for frequently queried columns
2. **Cache lesson content** to reduce DB queries
3. **Paginate** student lists in teacher dashboard
4. **Limit** submission history shown
5. **Compress** responses with gzip

### Upgrading
- **Render Paid Tier**: $7/mo database + $7/mo web service
- **Dedicated database**: Better performance
- **Auto-scaling**: Handle more concurrent users

---

## 🤝 Contributing

Want to improve the platform? Great!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

MIT License - Feel free to use for educational purposes

---

## 🎉 What Students Will Learn

By completing this course, students will master:

### HTML
- Document structure
- Semantic elements
- Text formatting
- Links and navigation
- Images and multimedia
- Forms (if added)
- Accessibility basics

### CSS
- Selectors and specificity
- Colors and typography
- Box model
- Flexbox layout
- CSS Grid
- Responsive design
- Transitions and animations

### Web Development Skills
- File organization
- Code debugging
- Testing in browser
- Version control concepts
- Deployment basics

### Journalism-Specific
- Article structure online
- Photo captions and credits
- Bylines and datelines
- Multimedia integration
- Responsive news design

---

## 📧 Support

For issues or questions:

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Review troubleshooting section above
3. Check GitHub Issues
4. Contact your institution's IT support

---

## 🗺️ Roadmap

Future enhancements:

- [ ] JavaScript lessons
- [ ] Real-time collaboration
- [ ] Code review features
- [ ] Video tutorial integration
- [ ] Mobile app
- [ ] AI-powered hints
- [ ] Plagiarism detection
- [ ] Export certificates
- [ ] Analytics dashboard
- [ ] API for integrations

---

**Built with ❤️ for journalism education**

*Empowering the next generation of digital journalists*