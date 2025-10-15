const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

async function updateDatabase() {
  console.log('🔄 Updating PostgreSQL database...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');
    
    // Clear existing data
    console.log('🧹 Clearing existing exercise data...');
    await pool.query('DELETE FROM test_cases');
    await pool.query('DELETE FROM exercises');
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM code_saves');
    await pool.query('DELETE FROM user_progress');
    
    // Ensure we have lessons
    const lessonCount = await pool.query('SELECT COUNT(*) FROM lessons');
    console.log(`Found ${lessonCount.rows[0].count} lessons`);
    
    if (parseInt(lessonCount.rows[0].count) === 0) {
      console.log('📝 Creating lessons...');
      await pool.query(`
        INSERT INTO lessons (lesson_number, title, description, content_html, order_index) VALUES
        (1, 'HTML Basics & Structure', 'Learn the foundation of web pages', '', 1),
        (2, 'HTML Attributes & Elements', 'Master HTML attributes and semantic elements', '', 2),
        (3, 'Text Formatting & Links', 'Format text and create hyperlinks', '', 3),
        (4, 'Images & Multimedia', 'Add visual elements to web pages', '', 4),
        (5, 'Introduction to CSS', 'Style your HTML with CSS', '', 5),
        (6, 'CSS Layout & Design', 'Create professional layouts', '', 6),
        (7, 'Build a News Article Page', 'Final project - complete article', '', 7)
      `);
    }
    
    // Add exercises manually (simpler than parsing SQL file)
    console.log('📚 Adding exercises...');
    
    // Lesson 1 exercises
    const lesson1Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (1, 'Your First HTML Page', 'Create a basic HTML page structure', 'beginner', 
      '<!-- Write your HTML code here -->', 
      '<h3>Requirements:</h3><ul><li>Add DOCTYPE declaration</li><li>Create html, head, body tags</li><li>Add h1 heading with your name</li></ul>',
      20, 1) RETURNING id
    `);
    
    // Add test cases for lesson 1 exercise 1
    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "html"}', 5, 'Missing <html> tag'),
      ($1, 'html_tag_exists', '{"tag": "head"}', 5, 'Missing <head> tag'), 
      ($1, 'html_tag_exists', '{"tag": "title"}', 3, 'Missing <title> tag'),
      ($1, 'html_tag_exists', '{"tag": "body"}', 5, 'Missing <body> tag'),
      ($1, 'html_tag_exists', '{"tag": "h1"}', 2, 'Missing <h1> heading')
    `, [lesson1Ex1.rows[0].id]);
    
    // Lesson 1 exercise 2
    const lesson1Ex2 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (1, 'Understanding Headings', 'Practice using different heading levels', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
  <title>My Headings</title>
</head>
<body>
  <!-- Add your headings here -->
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Add h1: "My First Article"</li><li>Add h2: "Introduction"</li><li>Add h3: "What is HTML?"</li><li>Add h2: "Conclusion"</li></ul>',
      15, 2) RETURNING id
    `);
    
    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "h1"}', 4, 'Missing <h1> heading'),
      ($1, 'html_tag_count', '{"tag": "h2", "count": 2, "operator": "gte"}', 6, 'Need at least 2 <h2> headings'),
      ($1, 'html_tag_exists', '{"tag": "h3"}', 5, 'Missing <h3> heading')
    `, [lesson1Ex2.rows[0].id]);
    
    // Lesson 2 exercises  
    const lesson2Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (2, 'Creating Hyperlinks', 'Learn to create links with href attribute', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
  <title>News Links</title>
</head>
<body>
  <h1>Important News Sources</h1>
  <!-- Add your links here -->
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Create link to Google</li><li>Create link to a news website</li><li>Create link to university website</li><li>Add target="_blank" to links</li></ul>',
      20, 1) RETURNING id
    `);
    
    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_count', '{"tag": "a", "count": 3, "operator": "gte"}', 10, 'Create at least 3 links'),
      ($1, 'attribute_exists', '{"tag": "a", "attribute": "href"}', 10, 'Links must have href attribute')
    `, [lesson2Ex1.rows[0].id]);
    
    // Update lesson content
    console.log('📖 Updating lesson content...');
    
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 1
    `, [`<div class="lesson-content">
  <h2>Welcome to HTML Basics</h2>
  
  <h3>What is HTML?</h3>
  <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using markup tags.</p>
  
  <h3>HTML Document Structure</h3>
  <p>Every HTML document follows this basic structure:</p>
  
  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

  <h3>Key Components:</h3>
  <ul>
    <li><strong>&lt;!DOCTYPE html&gt;</strong> - Declares this is an HTML5 document</li>
    <li><strong>&lt;html&gt;</strong> - Root element of HTML page</li>
    <li><strong>&lt;head&gt;</strong> - Contains metadata about the document</li>
    <li><strong>&lt;title&gt;</strong> - Specifies the page title (shown in browser tab)</li>
    <li><strong>&lt;body&gt;</strong> - Contains the visible page content</li>
  </ul>

  <h3>HTML Tags</h3>
  <p>HTML uses tags to mark up content. Tags are enclosed in angle brackets and usually come in pairs:</p>
  <ul>
    <li><code>&lt;tagname&gt;content&lt;/tagname&gt;</code></li>
    <li>Opening tag: <code>&lt;p&gt;</code></li>
    <li>Closing tag: <code>&lt;/p&gt;</code></li>
  </ul>

  <h3>Common HTML Elements</h3>
  <ul>
    <li><strong>Headings:</strong> &lt;h1&gt; to &lt;h6&gt; (largest to smallest)</li>
    <li><strong>Paragraphs:</strong> &lt;p&gt;</li>
    <li><strong>Line breaks:</strong> &lt;br&gt; (self-closing)</li>
    <li><strong>Horizontal rule:</strong> &lt;hr&gt; (self-closing)</li>
  </ul>
</div>`]);
    
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 2
    `, [`<div class="lesson-content">
  <h2>HTML Attributes & Elements</h2>
  
  <h3>What are HTML Attributes?</h3>
  <p>Attributes provide additional information about HTML elements. They are always specified in the opening tag and come in name/value pairs.</p>
  
  <h3>Syntax:</h3>
  <pre><code>&lt;tagname attribute="value"&gt;content&lt;/tagname&gt;</code></pre>

  <h3>Creating Links</h3>
  <p>The &lt;a&gt; tag creates hyperlinks. The href attribute specifies the destination:</p>
  
  <pre><code>&lt;a href="https://www.google.com"&gt;Visit Google&lt;/a&gt;</code></pre>

  <h4>Link Attributes:</h4>
  <ul>
    <li><code>href</code> - Specifies the URL of the page to link to</li>
    <li><code>target="_blank"</code> - Opens link in new tab/window</li>
    <li><code>title</code> - Tooltip text when hovering over link</li>
  </ul>

  <h3>Adding Images</h3>
  <p>The &lt;img&gt; tag embeds images. It is self-closing and requires the src attribute:</p>
  
  <pre><code>&lt;img src="image.jpg" alt="Description" width="400" height="300"&gt;</code></pre>

  <h4>Image Attributes:</h4>
  <ul>
    <li><code>src</code> - Path to the image file</li>
    <li><code>alt</code> - Alternative text (for screen readers and when image fails)</li>
    <li><code>width</code> and <code>height</code> - Dimensions in pixels</li>
  </ul>

  <h3>Creating Lists</h3>
  
  <h4>Unordered Lists (Bullet Points):</h4>
  <pre><code>&lt;ul&gt;
  &lt;li&gt;First item&lt;/li&gt;
  &lt;li&gt;Second item&lt;/li&gt;
  &lt;li&gt;Third item&lt;/li&gt;
&lt;/ul&gt;</code></pre>

  <h4>Ordered Lists (Numbered):</h4>
  <pre><code>&lt;ol&gt;
  &lt;li&gt;First step&lt;/li&gt;
  &lt;li&gt;Second step&lt;/li&gt;
  &lt;li&gt;Third step&lt;/li&gt;
&lt;/ol&gt;</code></pre>

  <h3>Best Practices:</h3>
  <ul>
    <li>Always include alt text for images</li>
    <li>Use descriptive link text (avoid "click here")</li>
    <li>Organize content with appropriate list types</li>
    <li>Test all links to ensure they work</li>
  </ul>
</div>`]);
    
    // Add basic content for remaining lessons
    for (let i = 3; i <= 7; i++) {
      await pool.query(`
        UPDATE lessons SET content_html = $1 WHERE lesson_number = $2
      `, [`<div class="lesson-content">
  <h2>Lesson ${i} Content</h2>
  <p>This lesson will teach you important web development concepts.</p>
  <p>Complete the exercises below to practice what you've learned.</p>
</div>`, i]);
    }
    
    console.log('✅ Lesson content updated');
    
    // Check final state
    const finalLessonCount = await pool.query('SELECT COUNT(*) FROM lessons');
    const exerciseCount = await pool.query('SELECT COUNT(*) FROM exercises');  
    const testCaseCount = await pool.query('SELECT COUNT(*) FROM test_cases');
    
    console.log(`📊 Database updated with:
    - ${finalLessonCount.rows[0].count} lessons
    - ${exerciseCount.rows[0].count} exercises  
    - ${testCaseCount.rows[0].count} test cases`);
    
    console.log('🎉 Database update complete!');
    
  } catch (error) {
    console.error('❌ Database update failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the update
if (require.main === module) {
  updateDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { updateDatabase };