const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

async function fixAlignment() {
  console.log('🔧 Fixing lesson-exercise alignment and content...');
  
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');

    // First, let's fix the lesson titles and content alignment
    console.log('📚 Updating lesson structure...');
    
    // Lesson 6 should be the final project
    await pool.query(`
      UPDATE lessons SET 
        title = 'Final Project: Complete News Article',
        content_html = $1 
      WHERE lesson_number = 6
    `, [`<div class="lesson-content">
  <h2>Your Final Project</h2>
  <p>Congratulations! You've learned HTML and CSS fundamentals. Now it's time to build a complete, professional news article page that demonstrates everything you've learned.</p>

  <h3>Project Overview</h3>
  <p>You'll create a fully functional news article page that includes:</p>
  <ul>
    <li>Professional site header with navigation</li>
    <li>Properly structured article content</li>
    <li>Images with captions and credits</li>
    <li>CSS styling for typography and layout</li>
    <li>Responsive design considerations</li>
  </ul>

  <h3>Requirements Checklist</h3>
  <p>Your news article page <strong>must</strong> include:</p>
  <ol>
    <li><strong>Site Header</strong> - Logo/site name and navigation menu</li>
    <li><strong>Article Structure</strong>:
      <ul>
        <li>Compelling headline using <code>&lt;h1&gt;</code></li>
        <li>Byline with author name and date</li>
        <li>Lead paragraph (styled differently from body text)</li>
        <li>At least 4 paragraphs of article content</li>
        <li>At least one subheading using <code>&lt;h2&gt;</code></li>
      </ul>
    </li>
    <li><strong>Visual Elements</strong>:
      <ul>
        <li>At least one image with proper <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code></li>
        <li>Photo credit in caption</li>
        <li>Alternative text for accessibility</li>
      </ul>
    </li>
    <li><strong>Interactive Elements</strong>:
      <ul>
        <li>Styled pull quote using <code>&lt;blockquote&gt;</code></li>
        <li>Bulleted or numbered list</li>
        <li>Links to related content</li>
      </ul>
    </li>
    <li><strong>Layout & Design</strong>:
      <ul>
        <li>Related articles sidebar or section</li>
        <li>Footer with copyright information</li>
        <li>Professional CSS styling throughout</li>
        <li>Readable typography and proper spacing</li>
      </ul>
    </li>
  </ol>

  <h3>Professional Article Template</h3>
  <p>Use this structure as your foundation:</p>
  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Article Title - Your News Site&lt;/title&gt;
    &lt;style&gt;
        /* Your professional CSS here */
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header class="site-header"&gt;
        &lt;h1&gt;Your News Site&lt;/h1&gt;
        &lt;nav&gt;
            &lt;ul&gt;
                &lt;li&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;News&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;Sports&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;Contact&lt;/a&gt;&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/nav&gt;
    &lt;/header&gt;

    &lt;main&gt;
        &lt;article&gt;
            &lt;h1 class="headline"&gt;Your Article Title&lt;/h1&gt;
            &lt;div class="byline"&gt;By Your Name | October 15, 2025&lt;/div&gt;
            
            &lt;p class="lead"&gt;Your compelling lead paragraph...&lt;/p&gt;
            
            &lt;figure&gt;
                &lt;img src="https://picsum.photos/600/400" alt="Descriptive alt text"&gt;
                &lt;figcaption&gt;Caption describing the image. Photo by Photographer Name.&lt;/figcaption&gt;
            &lt;/figure&gt;
            
            &lt;p&gt;Article content paragraph...&lt;/p&gt;
            
            &lt;h2&gt;Section Subheading&lt;/h2&gt;
            
            &lt;blockquote class="pullquote"&gt;
                "This is an important quote from your article."
            &lt;/blockquote&gt;
            
            &lt;ul&gt;
                &lt;li&gt;Key point one&lt;/li&gt;
                &lt;li&gt;Key point two&lt;/li&gt;
                &lt;li&gt;Key point three&lt;/li&gt;
            &lt;/ul&gt;
            
            &lt;p&gt;More article content...&lt;/p&gt;
        &lt;/article&gt;
        
        &lt;aside class="related"&gt;
            &lt;h3&gt;Related Articles&lt;/h3&gt;
            &lt;ul&gt;
                &lt;li&gt;&lt;a href="#"&gt;Related Story One&lt;/a&gt;&lt;/li&gt;
                &lt;li&gt;&lt;a href="#"&gt;Related Story Two&lt;/a&gt;&lt;/li&gt;
            &lt;/ul&gt;
        &lt;/aside&gt;
    &lt;/main&gt;

    &lt;footer&gt;
        &lt;p&gt;&copy; 2025 Your News Site. All rights reserved.&lt;/p&gt;
    &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

  <h3>Story Ideas</h3>
  <p>Choose a topic that interests you:</p>
  <ul>
    <li><strong>Campus Events</strong> - Concert, festival, or speaker series</li>
    <li><strong>Student Life</strong> - New dining options, housing changes, study spaces</li>
    <li><strong>Academic Programs</strong> - New majors, research opportunities, study abroad</li>
    <li><strong>Local Community</strong> - Business openings, community initiatives, local issues</li>
    <li><strong>Sports Coverage</strong> - Game recap, season preview, athlete profile</li>
    <li><strong>Technology</strong> - Campus app launches, online learning, tech upgrades</li>
  </ul>

  <h3>Evaluation Criteria</h3>
  <p>Your project will be graded on:</p>
  <ul>
    <li><strong>Technical Implementation (50%)</strong> - Proper HTML structure, CSS styling, responsive design</li>
    <li><strong>Content Quality (30%)</strong> - Well-written article, proper journalism structure</li>
    <li><strong>Visual Design (20%)</strong> - Professional appearance, good use of typography and spacing</li>
  </ul>

  <h3>Tips for Success</h3>
  <ul>
    <li><strong>Plan your content first</strong> - Outline your article before coding</li>
    <li><strong>Use semantic HTML</strong> - Choose tags based on meaning, not appearance</li>
    <li><strong>Style progressively</strong> - Start with basic layout, then add visual enhancements</li>
    <li><strong>Test frequently</strong> - Check your preview often as you build</li>
    <li><strong>Focus on readability</strong> - Good journalism is easy to read and understand</li>
  </ul>
</div>`]);

    // Remove lesson 7 since we only need 6 lessons
    await pool.query('DELETE FROM lessons WHERE lesson_number = 7');
    console.log('🗑️ Removed redundant lesson 7');

    // Move the final project exercise to lesson 6
    await pool.query(`
      UPDATE exercises 
      SET lesson_id = 6 
      WHERE title = 'Complete News Article Page'
    `);
    console.log('🎯 Moved final project exercise to lesson 6');

    // Verify final structure
    const verification = await pool.query(`
      SELECT l.lesson_number, l.title, 
             COUNT(e.id) as exercise_count,
             STRING_AGG(e.title, ', ') as exercises
      FROM lessons l
      LEFT JOIN exercises e ON e.lesson_id = l.id
      GROUP BY l.id, l.lesson_number, l.title
      ORDER BY l.lesson_number
    `);

    console.log('\n📋 FINAL LESSON STRUCTURE:');
    verification.rows.forEach(row => {
      console.log(`  ${row.lesson_number}. ${row.title}`);
      console.log(`     Exercises (${row.exercise_count}): ${row.exercises || 'None'}`);
    });

    console.log('\n✅ Alignment fixed successfully!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  fixAlignment()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { fixAlignment };