const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

async function populateCompleteContent() {
  console.log('🚀 Populating complete lesson content from existing HTML files...');
  
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await pool.query('DELETE FROM test_cases');
    await pool.query('DELETE FROM exercises');
    await pool.query('DELETE FROM submissions');
    await pool.query('DELETE FROM code_saves');
    await pool.query('DELETE FROM user_progress');
    
    // Lesson 1 Content - HTML Basics & Structure
    console.log('📚 Adding Lesson 1: HTML Basics & Structure...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 1
    `, [`<div class="lesson-content">
  <h2>What is HTML?</h2>
  <p><strong>HTML</strong> stands for <strong>HyperText Markup Language</strong>. It's the standard language used to create web pages. Think of HTML as the skeleton of a webpage - it provides the structure and content.</p>

  <div class="info-box">
    <strong>For Journalists:</strong> Just like you structure a news article with a headline, byline, lead paragraph, and body text, HTML helps you structure web content with tags that define headings, paragraphs, images, and more.
  </div>

  <h3>How HTML Works</h3>
  <p>HTML uses <strong>tags</strong> to mark up content. Tags are like instructions that tell the web browser how to display content. Most tags come in pairs:</p>

  <ul>
    <li>An <strong>opening tag</strong>: <code>&lt;tagname&gt;</code></li>
    <li>The <strong>content</strong> between the tags</li>
    <li>A <strong>closing tag</strong>: <code>&lt;/tagname&gt;</code></li>
  </ul>

  <div class="code-example">
    <code>&lt;p&gt;This is a paragraph.&lt;/p&gt;</code>
  </div>

  <p>In this example:</p>
  <ul>
    <li><code>&lt;p&gt;</code> is the opening tag</li>
    <li>"This is a paragraph." is the content</li>
    <li><code>&lt;/p&gt;</code> is the closing tag (notice the forward slash)</li>
  </ul>

  <h3>Basic HTML Structure</h3>
  <p>Every HTML page follows the same basic structure:</p>

  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My First Webpage&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Welcome to My Webpage&lt;/h1&gt;
    &lt;p&gt;This is my first paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

  <h4>Understanding Each Part</h4>
  <ul>
    <li><code>&lt;!DOCTYPE html&gt;</code> - Tells the browser this is an HTML5 document</li>
    <li><code>&lt;html&gt;</code> - The root element that contains all other HTML elements</li>
    <li><code>&lt;head&gt;</code> - Contains information ABOUT the page (title, metadata)</li>
    <li><code>&lt;title&gt;</code> - Sets the page title that appears in the browser tab</li>
    <li><code>&lt;body&gt;</code> - Contains all the visible content of your webpage</li>
  </ul>

  <h3>Headings and Paragraphs</h3>
  <p>HTML has six levels of headings, from <code>&lt;h1&gt;</code> (most important) to <code>&lt;h6&gt;</code> (least important). Just like in journalism, your main headline is the most important!</p>

  <pre><code>&lt;h1&gt;Main Headline (Largest)&lt;/h1&gt;
&lt;h2&gt;Subheading&lt;/h2&gt;
&lt;h3&gt;Section Heading&lt;/h3&gt;
&lt;h4&gt;Smaller Heading&lt;/h4&gt;
&lt;h5&gt;Even Smaller&lt;/h5&gt;
&lt;h6&gt;Smallest Heading&lt;/h6&gt;</code></pre>

  <p><strong>Best Practice:</strong> Use only ONE <code>&lt;h1&gt;</code> per page (your main headline). Use <code>&lt;h2&gt;</code> for major sections, <code>&lt;h3&gt;</code> for subsections, and so on.</p>

  <p>The <code>&lt;p&gt;</code> tag defines a paragraph. Browsers automatically add space before and after paragraphs.</p>

  <pre><code>&lt;p&gt;This is the first paragraph of my news article.&lt;/p&gt;
&lt;p&gt;This is the second paragraph with more information.&lt;/p&gt;
&lt;p&gt;Each paragraph is separated automatically by the browser.&lt;/p&gt;</code></pre>
</div>`]);

    // Add Lesson 1 Exercises
    const lesson1Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (1, 'Your First HTML Page', 'Create a basic HTML page structure with DOCTYPE, html, head, and body tags', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
    <title>My First News Page</title>
</head>
<body>
    <h1>Student Newspaper Launches Online Edition</h1>
    <h2>New website aims to reach broader audience</h2>
    
    <p>The campus newspaper announced today that it will launch
    an online edition next month.</p>
    
    <p>Editor Sarah Johnson said the move will help the paper
    reach students who prefer digital news.</p>
    
    <h3>What This Means for Students</h3>
    <p>Students will be able to access news from their phones
    and tablets, making it easier to stay informed.</p>
</body>
</html>',
      '<h3>Assignment:</h3><p>Create a new HTML page about a campus event. Your page must include:</p><ul><li>A main headline using <code>&lt;h1&gt;</code></li><li>A subheading using <code>&lt;h2&gt;</code></li><li>At least 3 paragraphs using <code>&lt;p&gt;</code></li><li>At least one section heading using <code>&lt;h3&gt;</code></li><li>Proper HTML structure (DOCTYPE, html, head, title, body)</li></ul>',
      25, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "html"}', 5, 'Missing <html> tag - this is required for all HTML pages'),
      ($1, 'html_tag_exists', '{"tag": "head"}', 5, 'Missing <head> section - this contains page metadata'),
      ($1, 'html_tag_exists', '{"tag": "title"}', 3, 'Missing <title> tag - this appears in the browser tab'),
      ($1, 'html_tag_exists', '{"tag": "body"}', 5, 'Missing <body> tag - this contains visible content'),
      ($1, 'html_tag_exists', '{"tag": "h1"}', 2, 'Missing main headline <h1> - every article needs a headline'),
      ($1, 'html_tag_count', '{"tag": "p", "count": 3, "operator": "gte"}', 5, 'Need at least 3 paragraphs - write more content!')
    `, [lesson1Ex1.rows[0].id]);

    // Lesson 2 Content - Text Formatting & Links
    console.log('📚 Adding Lesson 2: Text Formatting & Links...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 2
    `, [`<div class="lesson-content">
  <h2>Text Formatting Tags</h2>
  <p>Just like formatting text in Microsoft Word, HTML allows you to make text <strong>bold</strong>, <em>italic</em>, and more. These tags help emphasize important information in your articles.</p>

  <h3>Bold and Strong</h3>
  <p>There are two ways to make text bold:</p>
  <ul>
    <li><code>&lt;strong&gt;</code> - For important text (search engines pay attention to this)</li>
    <li><code>&lt;b&gt;</code> - For bold styling without extra importance</li>
  </ul>

  <p><strong>For Journalists:</strong> Use <code>&lt;strong&gt;</code> for key facts, names, or quotes you want to emphasize. Use <code>&lt;b&gt;</code> just for visual styling.</p>

  <h3>Italic and Emphasis</h3>
  <p>Similarly, there are two ways to make text italic:</p>
  <ul>
    <li><code>&lt;em&gt;</code> - For emphasis (like vocal stress when reading aloud)</li>
    <li><code>&lt;i&gt;</code> - For technical terms, foreign words, book titles</li>
  </ul>

  <h3>Other Useful Formatting Tags</h3>
  <ul>
    <li><code>&lt;u&gt;</code> - Underline text</li>
    <li><code>&lt;mark&gt;</code> - Highlight text (like a yellow marker)</li>
    <li><code>&lt;small&gt;</code> - Smaller text (for fine print)</li>
    <li><code>&lt;del&gt;</code> - Deleted text (strikethrough)</li>
    <li><code>&lt;ins&gt;</code> - Inserted text (underlined)</li>
  </ul>

  <h3>Lists: Organizing Information</h3>
  <p>Lists are essential for journalism - perfect for bullet points, numbered steps, or quick facts.</p>

  <h4>Unordered Lists (Bullet Points)</h4>
  <p>Use <code>&lt;ul&gt;</code> (unordered list) for items where order doesn't matter:</p>
  <pre><code>&lt;h3&gt;Key Points&lt;/h3&gt;
&lt;ul&gt;
    &lt;li&gt;First point&lt;/li&gt;
    &lt;li&gt;Second point&lt;/li&gt;
    &lt;li&gt;Third point&lt;/li&gt;
&lt;/ul&gt;</code></pre>

  <h4>Ordered Lists (Numbered Lists)</h4>
  <p>Use <code>&lt;ol&gt;</code> (ordered list) when sequence matters:</p>
  <pre><code>&lt;h3&gt;Steps to Follow&lt;/h3&gt;
&lt;ol&gt;
    &lt;li&gt;First step&lt;/li&gt;
    &lt;li&gt;Second step&lt;/li&gt;
    &lt;li&gt;Third step&lt;/li&gt;
&lt;/ol&gt;</code></pre>

  <p><strong>Remember:</strong> <code>&lt;li&gt;</code> stands for "list item" and must always be inside either <code>&lt;ul&gt;</code> or <code>&lt;ol&gt;</code> tags.</p>

  <h3>Creating Links</h3>
  <p>Links are what make the web "web-like" - they connect pages together. The <code>&lt;a&gt;</code> tag (anchor) creates hyperlinks.</p>

  <h4>Basic Link Structure</h4>
  <pre><code>&lt;a href="destination.html"&gt;Click here&lt;/a&gt;</code></pre>

  <p>Breaking it down:</p>
  <ul>
    <li><code>&lt;a&gt;</code> - the anchor tag</li>
    <li><code>href</code> - "hypertext reference" - where the link goes</li>
    <li><code>"destination.html"</code> - the file or URL to link to</li>
    <li><code>Click here</code> - the clickable text (what users see)</li>
    <li><code>&lt;/a&gt;</code> - closing tag</li>
  </ul>

  <h4>Types of Links</h4>
  <ul>
    <li><strong>External Link</strong>: <code>&lt;a href="https://www.bbc.com"&gt;BBC News&lt;/a&gt;</code></li>
    <li><strong>Internal Link</strong>: <code>&lt;a href="about.html"&gt;About Us&lt;/a&gt;</code></li>
    <li><strong>Email Link</strong>: <code>&lt;a href="mailto:tips@news.com"&gt;Email Us&lt;/a&gt;</code></li>
  </ul>

  <h4>Opening Links in New Tabs</h4>
  <p>Use the <code>target="_blank"</code> attribute to open links in a new tab:</p>
  <pre><code>&lt;a href="https://www.nytimes.com" target="_blank"&gt;New York Times&lt;/a&gt;</code></pre>

  <p><strong>Best Practice:</strong> Use <code>target="_blank"</code> for external links (keeps users on your site). Let internal links open in the same tab.</p>

  <h3>Line Breaks and Special Characters</h3>
  <p>Sometimes you need a line break without starting a new paragraph. Use <code>&lt;br&gt;</code>:</p>
  <pre><code>&lt;p&gt;
John Smith&lt;br&gt;
Senior Reporter&lt;br&gt;
Campus News Daily
&lt;/p&gt;</code></pre>

  <p>Create a horizontal line to separate content with <code>&lt;hr&gt;</code>:</p>
  <pre><code>&lt;hr&gt;</code></pre>

  <p><strong>Note:</strong> <code>&lt;br&gt;</code> and <code>&lt;hr&gt;</code> are self-closing tags - they don't need closing tags.</p>
</div>`]);

    // Add Lesson 2 Exercises
    const lesson2Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (2, 'Text Formatting Practice', 'Practice using bold, italic, and other text formatting tags', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
    <title>Formatting Practice</title>
</head>
<body>
    <h1>Breaking News</h1>
    
    <p>Add formatting to make this text more engaging...</p>
    
    <p>The mayor announced a new initiative today.</p>
    
    <p>This information is crucial for understanding the story.</p>
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Use <code>&lt;strong&gt;</code> to make at least one phrase important</li><li>Use <code>&lt;em&gt;</code> to emphasize at least one phrase</li><li>Use <code>&lt;mark&gt;</code> to highlight important information</li><li>Add line breaks using <code>&lt;br&gt;</code></li><li>Add a horizontal rule using <code>&lt;hr&gt;</code></li></ul>',
      20, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "strong"}', 5, 'Use <strong> for important text - try making "mayor" or "new initiative" important'),
      ($1, 'html_tag_exists', '{"tag": "em"}', 5, 'Use <em> for emphasized text - try emphasizing "announced" or "today"'),
      ($1, 'html_tag_exists', '{"tag": "mark"}', 4, 'Use <mark> to highlight text - try highlighting "crucial information"'),
      ($1, 'html_tag_exists', '{"tag": "br"}', 3, 'Add line breaks with <br> - useful for addresses or poetry'),
      ($1, 'html_tag_exists', '{"tag": "hr"}', 3, 'Add a horizontal rule <hr> to separate content sections')
    `, [lesson2Ex1.rows[0].id]);

    const lesson2Ex2 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (2, 'Links and Lists', 'Create hyperlinks and organize information with lists', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
    <title>Campus News Today</title>
</head>
<body>
    <h1>Campus News Today</h1>
    
    <h2>Top Stories</h2>
    <p>Add links to other pages here...</p>
    
    <h3>Headlines</h3>
    <p>Create a bulleted list of headlines here...</p>
    
    <h3>How to Contact Us</h3>
    <p>Add contact information here...</p>
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Create at least 3 hyperlinks using <code>&lt;a&gt;</code> tags</li><li>Create an unordered list with at least 4 headlines</li><li>Create an ordered list with contact steps</li><li>Add an email link using <code>mailto:</code></li><li>Use <code>target="_blank"</code> on external links</li></ul>',
      25, 2) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_count', '{"tag": "a", "count": 3, "operator": "gte"}', 8, 'Create at least 3 links - news sites need lots of navigation!'),
      ($1, 'attribute_exists', '{"tag": "a", "attribute": "href"}', 5, 'Links must have href attributes to actually go somewhere'),
      ($1, 'html_tag_exists', '{"tag": "ul"}', 4, 'Create an unordered (bulleted) list using <ul>'),
      ($1, 'html_tag_exists', '{"tag": "ol"}', 4, 'Create an ordered (numbered) list using <ol>'),
      ($1, 'html_tag_count', '{"tag": "li", "count": 6, "operator": "gte"}', 4, 'Add at least 6 total list items across your lists')
    `, [lesson2Ex2.rows[0].id]);

    // Continue with remaining lessons...
    // Lesson 3 Content - Images & Multimedia
    console.log('📚 Adding Lesson 3: Images & Multimedia...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 3
    `, [`<div class="lesson-content">
  <h2>Adding Images to Your Webpage</h2>
  <p>Images are crucial for online journalism. They grab attention, illustrate stories, and break up text. In HTML, we use the <code>&lt;img&gt;</code> tag.</p>

  <h3>Basic Image Syntax</h3>
  <pre><code>&lt;img src="photo.jpg" alt="Description of image"&gt;</code></pre>

  <p><strong>Important parts:</strong></p>
  <ul>
    <li><code>&lt;img&gt;</code> - the image tag (self-closing, no <code>&lt;/img&gt;</code> needed)</li>
    <li><code>src</code> - "source" - the path to your image file</li>
    <li><code>alt</code> - "alternative text" - describes the image (essential!)</li>
  </ul>

  <h4>Why ALT text matters:</h4>
  <ul>
    <li>Screen readers use it for visually impaired users (accessibility)</li>
    <li>Shows if the image fails to load</li>
    <li>Helps search engines understand your content</li>
    <li>Legal requirement in many countries</li>
  </ul>

  <h3>Image Attributes</h3>
  <ul>
    <li><code>src</code> - Image file location (required)</li>
    <li><code>alt</code> - Description of image (required)</li>
    <li><code>width</code> - Width in pixels</li>
    <li><code>height</code> - Height in pixels</li>
    <li><code>title</code> - Tooltip on hover</li>
  </ul>

  <p><strong>Tip:</strong> Set only width OR height, not both. The browser will automatically scale the other dimension to keep the image proportions correct.</p>

  <h3>Where to Put Your Images</h3>
  <h4>1. Same Folder (Recommended for Beginners)</h4>
  <pre><code>&lt;img src="photo.jpg" alt="Campus building"&gt;</code></pre>

  <h4>2. Subfolder (Better Organization)</h4>
  <pre><code>&lt;img src="images/photo.jpg" alt="Campus building"&gt;</code></pre>

  <h4>3. Online Image (External URL)</h4>
  <pre><code>&lt;img src="https://picsum.photos/400/300" alt="Sample image"&gt;</code></pre>

  <h3>Image Captions and Credits</h3>
  <p>In journalism, you should always credit photos and add captions. HTML5 has special tags for this:</p>

  <pre><code>&lt;figure&gt;
    &lt;img src="protest.jpg" alt="Students marching with signs" width="600"&gt;
    &lt;figcaption&gt;Students march across campus demanding climate action. Photo by Sarah Johnson.&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>

  <p><strong>Breaking it down:</strong></p>
  <ul>
    <li><code>&lt;figure&gt;</code> - groups an image with its caption</li>
    <li><code>&lt;img&gt;</code> - the actual image</li>
    <li><code>&lt;figcaption&gt;</code> - the caption and credit</li>
  </ul>

  <h4>Best Practice - Always include:</h4>
  <ul>
    <li>What's happening in the image</li>
    <li>When it was taken (if relevant)</li>
    <li>Photo credit (who took it)</li>
  </ul>

  <h3>Free Image Resources for Students</h3>
  <ul>
    <li><strong>Unsplash</strong> - Free high-quality photos</li>
    <li><strong>Pexels</strong> - Free stock photos and videos</li>
    <li><strong>Pixabay</strong> - Free images and videos</li>
    <li><strong>Wikimedia Commons</strong> - Free media files</li>
  </ul>

  <h3>Embedding Videos</h3>
  <p>Videos are powerful storytelling tools. Most journalists embed videos from YouTube, Vimeo, or other platforms.</p>

  <h4>Embedding YouTube Videos</h4>
  <ol>
    <li>Find the video on YouTube</li>
    <li>Click "Share" below the video</li>
    <li>Click "Embed"</li>
    <li>Copy the code</li>
  </ol>

  <pre><code>&lt;iframe width="560" height="315"
src="https://www.youtube.com/embed/VIDEO_ID"
title="YouTube video player"
frameborder="0" allowfullscreen&gt;&lt;/iframe&gt;</code></pre>

  <h3>Best Practices for Journalism</h3>
  <ul>
    <li><strong>Always write descriptive ALT text</strong> - "Student protesters" not "image1"</li>
    <li><strong>Credit every photo</strong> - photographer name and date</li>
    <li><strong>Optimize image size</strong> - large files slow down pages</li>
    <li><strong>Use relevant images</strong> - directly related to your story</li>
    <li><strong>Caption everything</strong> - explain what readers are seeing</li>
  </ul>
</div>`]);

    // Add Lesson 3 Exercise
    const lesson3Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (3, 'Image Gallery', 'Create a photo gallery with proper captions and credits', 'intermediate',
      '<!DOCTYPE html>
<html>
<head>
    <title>Campus Photo Gallery</title>
</head>
<body>
    <h1>Campus Life Photo Gallery</h1>
    
    <p>Welcome to our photo gallery showcasing campus life.</p>
    
    <!-- Add your images here -->
    
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Add at least 3 images using <code>&lt;img&gt;</code> tags</li><li>Use images from https://picsum.photos/400/300?random=1 (change the number)</li><li>Each image must have meaningful alt text</li><li>Use <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code> for each image</li><li>Include photo credits in captions</li><li>Set width="400" on all images</li></ul>',
      30, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_count', '{"tag": "img", "count": 3, "operator": "gte"}', 10, 'Add at least 3 images - galleries need multiple photos'),
      ($1, 'attribute_exists', '{"tag": "img", "attribute": "alt"}', 8, 'All images must have alt text for accessibility'),
      ($1, 'html_tag_count', '{"tag": "figure", "count": 3, "operator": "gte"}', 6, 'Use <figure> tags to group images with captions'),
      ($1, 'html_tag_count', '{"tag": "figcaption", "count": 3, "operator": "gte"}', 6, 'Add captions with <figcaption> for each image')
    `, [lesson3Ex1.rows[0].id]);

    // Lesson 4 Content - Introduction to CSS
    console.log('📚 Adding Lesson 4: Introduction to CSS...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 4
    `, [`<div class="lesson-content">
  <h2>What is CSS?</h2>
  <p><strong>CSS</strong> stands for <strong>Cascading Style Sheets</strong>. While HTML provides the structure and content of your webpage, CSS controls how it looks - colors, fonts, spacing, layout, and more.</p>

  <p><strong>Think of it this way:</strong></p>
  <ul>
    <li><strong>HTML</strong> = the skeleton and organs (structure and content)</li>
    <li><strong>CSS</strong> = the skin, clothes, and makeup (appearance and style)</li>
  </ul>

  <h3>Why CSS Matters for Journalism</h3>
  <ul>
    <li><strong>Readability</strong> - Make articles easier to read</li>
    <li><strong>Branding</strong> - Match your publication's style</li>
    <li><strong>Professionalism</strong> - Well-designed pages build trust</li>
    <li><strong>Engagement</strong> - Good design keeps readers on your site</li>
    <li><strong>Accessibility</strong> - Proper styling helps all readers</li>
  </ul>

  <h3>Three Ways to Add CSS</h3>

  <h4>1. Inline CSS (Not Recommended)</h4>
  <p>CSS written directly in an HTML tag using the <code>style</code> attribute:</p>
  <pre><code>&lt;p style="color: blue; font-size: 18px;"&gt;This text is blue.&lt;/p&gt;</code></pre>
  <p><strong>Why avoid this?</strong> If you want to change the style later, you have to edit every single tag. Very inefficient!</p>

  <h4>2. Internal CSS (Good for Learning)</h4>
  <p>CSS written in the <code>&lt;head&gt;</code> section using <code>&lt;style&gt;</code> tags:</p>
  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page&lt;/title&gt;
    &lt;style&gt;
        p {
            color: blue;
            font-size: 18px;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;p&gt;This text is blue.&lt;/p&gt;
    &lt;p&gt;This text is also blue.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

  <p><strong>Benefits:</strong> All paragraphs get styled at once! Change the CSS once, update everything.</p>

  <h4>3. External CSS (Best Practice)</h4>
  <p>CSS written in a separate .css file and linked to your HTML.</p>

  <h3>CSS Syntax</h3>
  <p>Every CSS rule follows this pattern:</p>
  <pre><code>selector {
    property: value;
    property: value;
}</code></pre>

  <p><strong>Breaking it down:</strong></p>
  <ul>
    <li><strong>Selector</strong> - what you want to style (e.g., <code>p</code>, <code>h1</code>)</li>
    <li><strong>Property</strong> - what aspect to change (e.g., <code>color</code>, <code>font-size</code>)</li>
    <li><strong>Value</strong> - what to change it to (e.g., <code>blue</code>, <code>18px</code>)</li>
    <li><strong>Curly braces { }</strong> - contain all the style rules</li>
    <li><strong>Semicolon ;</strong> - ends each property-value pair</li>
  </ul>

  <h3>CSS Selectors</h3>
  <p>Selectors determine which HTML elements get styled.</p>

  <h4>1. Element Selector</h4>
  <p>Styles ALL elements of that type:</p>
  <pre><code>p {
    color: navy;
}
/* This styles ALL paragraphs */</code></pre>

  <h4>2. Class Selector</h4>
  <p>Styles elements with a specific class attribute (use a period <code>.</code>):</p>
  <pre><code>&lt;p class="intro"&gt;Introduction paragraph&lt;/p&gt;
&lt;p&gt;Regular paragraph&lt;/p&gt;</code></pre>

  <pre><code>.intro {
    font-size: 20px;
    font-weight: bold;
}
/* Only paragraphs with class="intro" get styled */</code></pre>

  <h4>3. ID Selector</h4>
  <p>Styles ONE unique element (use a hash <code>#</code>):</p>
  <pre><code>&lt;h1 id="main-headline"&gt;Breaking News&lt;/h1&gt;</code></pre>

  <pre><code>#main-headline {
    color: red;
    font-size: 48px;
}</code></pre>

  <h3>Colors in CSS</h3>
  <ul>
    <li><strong>Color Names:</strong> <code>color: red;</code></li>
    <li><strong>Hexadecimal:</strong> <code>color: #FF0000;</code></li>
    <li><strong>RGB:</strong> <code>color: rgb(255, 0, 0);</code></li>
    <li><strong>RGBA (with transparency):</strong> <code>color: rgba(255, 0, 0, 0.5);</code></li>
  </ul>

  <h3>Common Text Properties</h3>
  <ul>
    <li><code>color</code> - Text color</li>
    <li><code>font-size</code> - Size of text</li>
    <li><code>font-family</code> - Font typeface</li>
    <li><code>font-weight</code> - Boldness (normal, bold, 600)</li>
    <li><code>text-align</code> - Alignment (left, center, right)</li>
    <li><code>line-height</code> - Space between lines</li>
  </ul>

  <h3>The Box Model</h3>
  <p>Every HTML element is a rectangular box with:</p>
  <ol>
    <li><strong>Content</strong> - The actual text/images</li>
    <li><strong>Padding</strong> - Space between content and border (inside)</li>
    <li><strong>Border</strong> - Line around the padding</li>
    <li><strong>Margin</strong> - Space outside the border (between elements)</li>
  </ol>

  <pre><code>.article {
    width: 600px;
    padding: 20px;
    border: 1px solid black;
    margin: 20px;
}</code></pre>

  <h3>Background Properties</h3>
  <pre><code>.header {
    background-color: #f0f0f0;
}

.hero {
    background-image: url('banner.jpg');
    background-size: cover;
    background-position: center;
}</code></pre>
</div>`]);

    // Add Lesson 4 Exercise
    const lesson4Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (4, 'Style a News Article', 'Apply CSS styling to transform a plain HTML article', 'beginner',
      '<!DOCTYPE html>
<html>
<head>
    <title>Student Government Elections</title>
    <style>
        /* Add your CSS styles here */
        
    </style>
</head>
<body>
    <h1>Record Turnout Expected in Student Elections</h1>
    
    <p class="byline">By Maria Garcia | October 15, 2025</p>
    
    <p class="lead">Student leaders predict the highest voter turnout in a decade as three candidates compete for student body president.</p>
    
    <p>More than 2,000 students have already cast early ballots, according to the Elections Commission.</p>
    
    <h2>The Candidates</h2>
    
    <p>Three candidates are vying for the presidency: junior Alex Chen, sophomore Jordan Williams, and senior Taylor Martinez.</p>
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Style the <code>h1</code> with a large font-size and center alignment</li><li>Make the <code>.byline</code> class italic and gray</li><li>Style the <code>.lead</code> class with larger font-size and bold weight</li><li>Add padding and margin to create better spacing</li><li>Set a background color for the body</li><li>Style the <code>h2</code> elements with a different color</li></ul>',
      25, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "style"}', 8, 'Add CSS using <style> tags in the <head> section'),
      ($1, 'attribute_exists', '{"tag": "p", "attribute": "class"}', 6, 'Keep the class attributes on paragraphs - they are needed for styling'),
      ($1, 'html_tag_exists', '{"tag": "h1"}', 3, 'Keep the h1 headline'),
      ($1, 'html_tag_exists', '{"tag": "h2"}', 3, 'Keep the h2 subheadings'),
      ($1, 'html_tag_count', '{"tag": "p", "count": 4, "operator": "gte"}', 5, 'Keep all the paragraph content')
    `, [lesson4Ex1.rows[0].id]);

    // Lesson 5 Content - CSS Layout & Design
    console.log('📚 Adding Lesson 5: CSS Layout & Design...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 5
    `, [`<div class="lesson-content">
  <h2>Understanding Layout</h2>
  <p>Layout controls how elements are arranged on your page. Good layout makes content easy to read and navigate.</p>

  <h3>Display Property</h3>
  <p>The <code>display</code> property determines how an element behaves:</p>
  <ul>
    <li><code>block</code> - Takes full width, starts new line (h1, p, div)</li>
    <li><code>inline</code> - Only takes needed width, stays in line (a, strong, em)</li>
    <li><code>inline-block</code> - Inline but accepts width/height</li>
    <li><code>none</code> - Hidden completely</li>
  </ul>

  <h3>Flexbox - Modern Layout Tool</h3>
  <p>Flexbox makes it easy to create rows and columns. Perfect for navigation menus, article grids, and more.</p>

  <h4>Basic Flexbox</h4>
  <pre><code>.container {
    display: flex;
    gap: 20px;  /* Space between items */
}

.item {
    flex: 1;  /* Items grow equally */
}</code></pre>

  <h4>Key Flexbox Properties</h4>
  <pre><code>.flex-container {
    display: flex;
    
    /* Direction */
    flex-direction: row;  /* row, column */
    
    /* Horizontal alignment */
    justify-content: space-between;
    /* flex-start, center, space-around */
    
    /* Vertical alignment */
    align-items: center;
    /* flex-start, flex-end, stretch */
    
    /* Wrapping */
    flex-wrap: wrap;  /* nowrap, wrap */
}</code></pre>

  <h3>CSS Grid - Advanced Layouts</h3>
  <p>Grid creates complex two-dimensional layouts. Great for news homepages with multiple article cards.</p>

  <pre><code>.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
    gap: 20px;
}

/* Or with different sizes */
.grid-container {
    display: grid;
    grid-template-columns: 2fr 1fr;  /* 2/3 and 1/3 */
    gap: 20px;
}</code></pre>

  <h3>Responsive Design Basics</h3>
  <p>Responsive design makes your site work on all screen sizes - phones, tablets, and desktops.</p>

  <h4>Media Queries</h4>
  <pre><code>/* Mobile styles (default) */
.container {
    width: 100%;
    padding: 10px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        width: 750px;
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 960px;
        padding: 40px;
    }
}</code></pre>

  <p><strong>Mobile-First:</strong> Start with mobile styles, then add complexity for larger screens. Most news readers are on phones!</p>

  <h3>Navigation Menu</h3>
  <p>Every news site needs navigation. Here's a horizontal menu:</p>

  <pre><code>nav {
    background: #333;
}

nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
}

nav a {
    display: block;
    color: white;
    text-decoration: none;
    padding: 15px 20px;
}

nav a:hover {
    background: #555;
}</code></pre>

  <h3>Common News Site Patterns</h3>

  <h4>Article Card</h4>
  <pre><code>.article-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    transition: box-shadow 0.3s;
}

.article-card:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.article-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}</code></pre>

  <h4>Pull Quote</h4>
  <pre><code>.pullquote {
    font-size: 24px;
    font-style: italic;
    color: #e74c3c;
    border-left: 5px solid #e74c3c;
    padding-left: 20px;
    margin: 30px 0;
    max-width: 600px;
}</code></pre>

  <h3>Key Layout Concepts</h3>
  <ul>
    <li>Use Flexbox for one-dimensional layouts (rows or columns)</li>
    <li>Use Grid for two-dimensional layouts (rows AND columns)</li>
    <li>Media queries make sites responsive</li>
    <li>Start with mobile design, then scale up</li>
    <li>max-width and margin auto create centered containers</li>
  </ul>
</div>`]);

    // Add Lesson 5 Exercise
    const lesson5Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (5, 'Create a News Homepage Layout', 'Build a responsive news homepage with navigation and article grid', 'intermediate',
      '<!DOCTYPE html>
<html>
<head>
    <title>Campus News Network</title>
    <style>
        /* Add your CSS here */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
        }
        
    </style>
</head>
<body>
    <header>
        <h1>Campus News Network</h1>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">News</a></li>
                <li><a href="#">Sports</a></li>
                <li><a href="#">Opinion</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <div class="article-grid">
            <article class="article-card">
                <h2>Student Government Elections Begin</h2>
                <p>Three candidates compete for student body president...</p>
            </article>
            
            <article class="article-card">
                <h2>New Library Opens Next Month</h2>
                <p>The $50 million facility will feature 24/7 study spaces...</p>
            </article>
            
            <article class="article-card">
                <h2>Basketball Team Wins Championship</h2>
                <p>The Tigers defeated their rivals 78-65 in the final game...</p>
            </article>
        </div>
    </main>
</body>
</html>',
      '<h3>Requirements:</h3><ul><li>Style the navigation menu using Flexbox</li><li>Create a 3-column article grid using CSS Grid or Flexbox</li><li>Add hover effects to article cards</li><li>Style the header with background color and padding</li><li>Add responsive design with a mobile breakpoint</li><li>Ensure proper spacing throughout</li></ul>',
      30, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "nav"}', 5, 'Keep the navigation menu - it is essential for any news site'),
      ($1, 'html_tag_count', '{"tag": "article", "count": 3, "operator": "gte"}', 10, 'Keep all three article cards for the grid layout'),
      ($1, 'attribute_exists', '{"tag": "article", "attribute": "class"}', 5, 'Keep the article-card classes - they are needed for styling'),
      ($1, 'html_tag_exists', '{"tag": "header"}', 5, 'Keep the header element for the site header'),
      ($1, 'html_tag_exists', '{"tag": "main"}', 5, 'Keep the main element for the main content area')
    `, [lesson5Ex1.rows[0].id]);

    // Lesson 6 Content - Final Project
    console.log('📚 Adding Lesson 6: Final Project...');
    await pool.query(`
      UPDATE lessons SET content_html = $1 WHERE lesson_number = 6
    `, [`<div class="lesson-content">
  <h2>Your Final Project</h2>
  <p>Congratulations! You've learned HTML and CSS fundamentals. Now it's time to build a complete, professional news article page that includes everything you've learned.</p>

  <h3>Project Requirements</h3>
  <p>Your news article page must include:</p>
  <ol>
    <li><strong>Site Header</strong> with navigation menu</li>
    <li><strong>Article headline, byline, and date</strong></li>
    <li><strong>Lead/lede paragraph</strong> (styled differently)</li>
    <li><strong>At least 4 paragraphs</strong> of article content</li>
    <li><strong>At least one image</strong> with proper caption and credit</li>
    <li><strong>A subheading</strong> (h2 or h3)</li>
    <li><strong>A pull quote</strong></li>
    <li><strong>A bulleted or numbered list</strong></li>
    <li><strong>Related articles sidebar or section</strong></li>
    <li><strong>Footer with copyright</strong></li>
  </ol>

  <h3>Professional Article Template Structure</h3>
  <p>Your article should follow this professional structure:</p>

  <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Article Title - Your News Site&lt;/title&gt;
    &lt;style&gt;
        /* Your CSS styles here */
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
            &lt;/ul&gt;
        &lt;/nav&gt;
    &lt;/header&gt;

    &lt;article class="main-article"&gt;
        &lt;h1 class="headline"&gt;Your Article Title&lt;/h1&gt;
        &lt;div class="byline"&gt;By Your Name | Date&lt;/div&gt;
        
        &lt;p class="lead"&gt;Your lead paragraph here...&lt;/p&gt;
        
        &lt;figure&gt;
            &lt;img src="image.jpg" alt="Description"&gt;
            &lt;figcaption&gt;Caption and credit&lt;/figcaption&gt;
        &lt;/figure&gt;
        
        &lt;p&gt;Article content...&lt;/p&gt;
        
        &lt;h2&gt;Subheading&lt;/h2&gt;
        
        &lt;blockquote class="pullquote"&gt;
            "Your pull quote here"
        &lt;/blockquote&gt;
        
        &lt;ul&gt;
            &lt;li&gt;List item 1&lt;/li&gt;
            &lt;li&gt;List item 2&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/article&gt;

    &lt;aside class="related"&gt;
        &lt;h3&gt;Related Articles&lt;/h3&gt;
        &lt;ul&gt;
            &lt;li&gt;&lt;a href="#"&gt;Related Article 1&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href="#"&gt;Related Article 2&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/aside&gt;

    &lt;footer&gt;
        &lt;p&gt;&copy; 2025 Your News Site&lt;/p&gt;
    &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

  <h3>CSS Styling Guidelines</h3>
  <p>Your CSS should include:</p>
  <ul>
    <li><strong>Typography:</strong> Professional fonts (Georgia for body, Arial for headings)</li>
    <li><strong>Color Scheme:</strong> Consistent colors throughout</li>
    <li><strong>Spacing:</strong> Proper margins and padding</li>
    <li><strong>Layout:</strong> Centered content with max-width</li>
    <li><strong>Navigation:</strong> Horizontal menu with hover effects</li>
    <li><strong>Responsive:</strong> Mobile-friendly design</li>
  </ul>

  <h3>Sample CSS Structure</h3>
  <pre><code>/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Georgia, serif;
    line-height: 1.6;
    color: #333;
}

/* Header Styles */
.site-header {
    background: #1a1a1a;
    color: white;
    padding: 20px 0;
}

/* Navigation */
nav ul {
    list-style: none;
    display: flex;
}

nav a {
    color: white;
    text-decoration: none;
    padding: 10px 20px;
}

/* Article Styles */
.main-article {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

.headline {
    font-size: 42px;
    margin-bottom: 20px;
}

.lead {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 25px;
}

.pullquote {
    font-size: 24px;
    font-style: italic;
    border-left: 5px solid #e74c3c;
    padding-left: 20px;
    margin: 30px 0;
}</code></pre>

  <h3>Article Topic Suggestions</h3>
  <ul>
    <li>Campus event coverage</li>
    <li>Student organization profile</li>
    <li>Local business feature</li>
    <li>Academic program spotlight</li>
    <li>Community issue investigation</li>
    <li>Sports team season preview</li>
  </ul>

  <h3>Grading Criteria</h3>
  <p>Your final project will be evaluated on:</p>
  <ul>
    <li><strong>HTML Structure (40%):</strong> Proper tags, semantic HTML, accessibility</li>
    <li><strong>CSS Design (40%):</strong> Professional styling, layout, colors</li>
    <li><strong>Content Quality (20%):</strong> Well-written article content</li>
  </ul>

  <h3>Tips for Success</h3>
  <ul>
    <li>Write about something you know and care about</li>
    <li>Use real quotes and specific details</li>
    <li>Include a compelling lead paragraph</li>
    <li>Choose high-quality images with proper credits</li>
    <li>Test your page on different screen sizes</li>
    <li>Validate your HTML and CSS</li>
  </ul>
</div>`]);

    // Add Final Project Exercise
    const lesson6Ex1 = await pool.query(`
      INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
      VALUES (6, 'Complete News Article Page', 'Create a professional, complete news article page using all learned skills', 'advanced',
      '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Article Title - News Site</title>
    <style>
        /* Add your comprehensive CSS styling here */
        
    </style>
</head>
<body>
    <!-- Add your complete news article page here -->
    
</body>
</html>',
      '<h3>FINAL PROJECT REQUIREMENTS:</h3><ul><li>Complete HTML5 document structure</li><li>Site header with navigation menu (at least 4 links)</li><li>Article headline, byline, and date</li><li>Lead paragraph styled differently from body text</li><li>At least 4 paragraphs of article content</li><li>At least one image with figure/figcaption</li><li>At least one subheading (h2)</li><li>A styled pull quote</li><li>A bulleted or numbered list</li><li>Related articles section</li><li>Footer with copyright</li><li>Professional CSS styling throughout</li><li>Responsive design considerations</li></ul><p><strong>This is your showcase piece - make it professional!</strong></p>',
      50, 1) RETURNING id
    `);

    await pool.query(`
      INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message) VALUES
      ($1, 'html_tag_exists', '{"tag": "nav"}', 5, 'Include a navigation menu for site usability'),
      ($1, 'html_tag_exists', '{"tag": "article"}', 5, 'Use semantic <article> element for main content'),
      ($1, 'html_tag_exists', '{"tag": "h1"}', 5, 'Include a main headline using <h1>'),
      ($1, 'html_tag_count', '{"tag": "p", "count": 4, "operator": "gte"}', 10, 'Write at least 4 paragraphs of substantial content'),
      ($1, 'html_tag_exists', '{"tag": "figure"}', 5, 'Include at least one image with proper figure/figcaption'),
      ($1, 'html_tag_exists', '{"tag": "h2"}', 3, 'Add subheadings to organize your content'),
      ($1, 'html_tag_exists', '{"tag": "blockquote"}', 4, 'Include a pull quote using blockquote'),
      ($1, 'html_tag_exists', '{"tag": "ul"}', 3, 'Add a list to organize information'),
      ($1, 'html_tag_exists', '{"tag": "footer"}', 3, 'Include a footer with copyright information'),
      ($1, 'html_tag_exists', '{"tag": "style"}', 7, 'Add comprehensive CSS styling in style tags')
    `, [lesson6Ex1.rows[0].id]);

    // Check final state
    const lessonCount = await pool.query('SELECT COUNT(*) FROM lessons');
    const exerciseCount = await pool.query('SELECT COUNT(*) FROM exercises');
    const testCaseCount = await pool.query('SELECT COUNT(*) FROM test_cases');
    
    console.log(`📊 Database populated successfully:
    - ${lessonCount.rows[0].count} lessons (complete with rich content)
    - ${exerciseCount.rows[0].count} exercises (across all lessons)
    - ${testCaseCount.rows[0].count} test cases for auto-grading`);
    
    console.log('✅ All lesson content and exercises loaded from existing HTML files!');
    
  } catch (error) {
    console.error('❌ Population failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  populateCompleteContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { populateCompleteContent };