-- Database Schema for HTML Journalism Course Platform

-- Users table (both students and teachers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    lesson_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_html TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    starter_code TEXT,
    instructions TEXT NOT NULL,
    max_points INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-grading test cases
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL, -- 'html_tag', 'css_property', 'element_count', 'attribute_check', etc.
    test_config JSONB NOT NULL, -- Configuration for the test
    points INTEGER NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student submissions
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_complete BOOLEAN DEFAULT FALSE,
    score INTEGER,
    max_score INTEGER,
    feedback JSONB, -- Auto-grading feedback
    teacher_feedback TEXT,
    teacher_id INTEGER REFERENCES users(id),
    graded_at TIMESTAMP
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    is_complete BOOLEAN DEFAULT FALSE,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Code saves (auto-save student work)
CREATE TABLE IF NOT EXISTS code_saves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_auto_save BOOLEAN DEFAULT TRUE
);

-- Achievement/Badge system (optional but motivating)
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    criteria JSONB NOT NULL, -- Conditions to earn the achievement
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Class/Group management
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    join_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS class_enrollments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_submissions_user_exercise ON submissions(user_id, exercise_id);
CREATE INDEX idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX idx_code_saves_user_exercise ON code_saves(user_id, exercise_id);
CREATE INDEX idx_class_enrollments_class ON class_enrollments(class_id);
CREATE INDEX idx_class_enrollments_user ON class_enrollments(user_id);

-- Insert default lessons
INSERT INTO lessons (lesson_number, title, description, content_html, order_index) VALUES
(1, 'HTML Basics & Structure', 'Learn the foundation of web pages', '', 1),
(2, 'HTML Attributes & Elements', 'Master HTML attributes and semantic elements', '', 2),
(3, 'Text Formatting & Links', 'Format text and create hyperlinks', '', 3),
(4, 'Images & Multimedia', 'Add visual elements to web pages', '', 4),
(5, 'Introduction to CSS', 'Style your HTML with CSS', '', 5),
(6, 'CSS Layout & Design', 'Create professional layouts', '', 6),
(7, 'Build a News Article Page', 'Final project - complete article', '', 7);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon_url, criteria) VALUES
('First Steps', 'Complete your first lesson', '/icons/first-steps.svg', '{"type": "lessons_complete", "count": 1}'),
('Quick Learner', 'Complete 3 lessons in one day', '/icons/quick-learner.svg', '{"type": "lessons_in_day", "count": 3}'),
('Perfect Score', 'Get 100% on any exercise', '/icons/perfect-score.svg', '{"type": "perfect_exercise", "count": 1}'),
('Code Master', 'Complete all exercises', '/icons/code-master.svg', '{"type": "all_exercises_complete"}'),
('HTML Expert', 'Complete all HTML lessons', '/icons/html-expert.svg', '{"type": "html_lessons_complete"}'),
('CSS Ninja', 'Complete all CSS lessons', '/icons/css-ninja.svg', '{"type": "css_lessons_complete"}'),
('Final Project', 'Complete the final news article project', '/icons/final-project.svg', '{"type": "lesson_complete", "lesson_id": 7}');

-- Create admin user (password: 'admin123' - CHANGE IN PRODUCTION!)
-- Note: This is a bcrypt hash of 'admin123'
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@example.com', '$2a$10$rXQFgGzKqK7JlP.4pVZ4K.8mGZ5G7Z3QY4bHU8nxYGTNyZvYXQ8EK', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;