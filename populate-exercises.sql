-- Populate HTML Journalism Course with Comprehensive Exercises

-- ======================
-- LESSON 1: HTML Basics & Structure
-- ======================

-- Exercise 1.1: Your First HTML Page
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  1,
  'Your First HTML Page',
  'Create a basic HTML page structure with DOCTYPE, html, head, and body tags',
  'beginner',
  '<!-- Write your HTML code here -->',
  '<h3>Requirements:</h3>
<ul>
  <li>Add a DOCTYPE declaration at the top</li>
  <li>Create opening and closing &lt;html&gt; tags</li>
  <li>Add a &lt;head&gt; section with a &lt;title&gt;</li>
  <li>Add a &lt;body&gt; section</li>
  <li>Add an &lt;h1&gt; heading inside the body with your name</li>
</ul>
<p><strong>Hint:</strong> Every HTML document starts with <code>&lt;!DOCTYPE html&gt;</code></p>',
  20,
  1
);

-- Test cases for Exercise 1.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists', '{"tag": "html"}', 5, 'Missing <html> tag'),

((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists', '{"tag": "head"}', 5, 'Missing <head> tag'),

((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists', '{"tag": "title"}', 3, 'Missing <title> tag in <head>'),

((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists', '{"tag": "body"}', 5, 'Missing <body> tag'),

((SELECT id FROM exercises WHERE title = 'Your First HTML Page'),
 'html_tag_exists', '{"tag": "h1"}', 2, 'Missing <h1> heading in the body');


-- Exercise 1.2: Headings Hierarchy
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  1,
  'Understanding Headings',
  'Practice using different heading levels from h1 to h6',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>My Headings</title>
</head>
<body>
  <!-- Add your headings here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add an &lt;h1&gt; heading: "My First Article"</li>
  <li>Add an &lt;h2&gt; heading: "Introduction"</li>
  <li>Add an &lt;h3&gt; heading: "What is HTML?"</li>
  <li>Add an &lt;h2&gt; heading: "Conclusion"</li>
</ul>
<p><strong>Remember:</strong> h1 is the most important, h6 is the least important</p>',
  15,
  2
);

-- Test cases for Exercise 1.2
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Understanding Headings'),
 'html_tag_exists', '{"tag": "h1"}', 4, 'Missing <h1> heading'),

((SELECT id FROM exercises WHERE title = 'Understanding Headings'),
 'html_tag_count', '{"tag": "h2", "count": 2, "operator": "gte"}', 6, 'You need at least 2 <h2> headings'),

((SELECT id FROM exercises WHERE title = 'Understanding Headings'),
 'html_tag_exists', '{"tag": "h3"}', 5, 'Missing <h3> heading');


-- Exercise 1.3: Paragraphs
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  1,
  'Writing Paragraphs',
  'Learn to structure content with paragraph tags',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>About Me</title>
</head>
<body>
  <h1>About Me</h1>
  <!-- Add paragraphs here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add at least 3 paragraphs using &lt;p&gt; tags</li>
  <li>First paragraph: Introduce yourself (name, where you''re from)</li>
  <li>Second paragraph: What you want to learn about web design</li>
  <li>Third paragraph: Your goals as a journalist</li>
</ul>
<p><strong>Tip:</strong> Use <code>&lt;p&gt;Your text here&lt;/p&gt;</code></p>',
  15,
  3
);

-- Test cases for Exercise 1.3
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Writing Paragraphs'),
 'html_tag_count', '{"tag": "p", "count": 3, "operator": "gte"}', 15, 'Add at least 3 paragraphs using <p> tags');


-- ======================
-- LESSON 2: HTML Attributes & Elements
-- ======================

-- Exercise 2.1: Links with Attributes
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  2,
  'Creating Hyperlinks',
  'Learn to create links using the href attribute',
  'beginner',
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
  '<h3>Requirements:</h3>
<ul>
  <li>Create a link to Google: <code>&lt;a href="https://www.google.com"&gt;Google&lt;/a&gt;</code></li>
  <li>Create a link to a news website of your choice</li>
  <li>Create a link to your university website</li>
  <li>Add target="_blank" to make links open in new tabs</li>
</ul>
<p><strong>Remember:</strong> Links need the href attribute!</p>',
  20,
  1
);

-- Test cases for Exercise 2.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Creating Hyperlinks'),
 'html_tag_count', '{"tag": "a", "count": 3, "operator": "gte"}', 10, 'Create at least 3 links using <a> tags'),

((SELECT id FROM exercises WHERE title = 'Creating Hyperlinks'),
 'attribute_exists', '{"tag": "a", "attribute": "href"}', 10, 'Links must have href attribute');


-- Exercise 2.2: Images with Alt Text
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  2,
  'Adding Images',
  'Practice adding images with proper alt attributes',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>My Photo Gallery</title>
</head>
<body>
  <h1>Photo Gallery</h1>
  <!-- Add images here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add an image using &lt;img&gt; tag with src attribute</li>
  <li>Use this image URL: <code>https://picsum.photos/400/300</code></li>
  <li>Add alt attribute: "Sample photo"</li>
  <li>Add width attribute: 400</li>
  <li>Add height attribute: 300</li>
</ul>
<p><strong>Note:</strong> Alt text helps screen readers and shows when image fails to load</p>',
  20,
  2
);

-- Test cases for Exercise 2.2
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Adding Images'),
 'html_tag_exists', '{"tag": "img"}', 5, 'Missing <img> tag'),

((SELECT id FROM exercises WHERE title = 'Adding Images'),
 'attribute_exists', '{"tag": "img", "attribute": "src"}', 5, 'Image must have src attribute'),

((SELECT id FROM exercises WHERE title = 'Adding Images'),
 'attribute_exists', '{"tag": "img", "attribute": "alt"}', 10, 'Image must have alt attribute for accessibility');


-- Exercise 2.3: Lists
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  2,
  'Creating Lists',
  'Learn to create ordered and unordered lists',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>My Lists</title>
</head>
<body>
  <h1>Things I Need to Learn</h1>
  <!-- Add your lists here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Create an unordered list (&lt;ul&gt;) with at least 3 items (&lt;li&gt;)</li>
  <li>Add heading "Skills to Master" before the list</li>
  <li>List items: "HTML", "CSS", "JavaScript"</li>
  <li>Create an ordered list (&lt;ol&gt;) with 3 learning steps</li>
</ul>
<p><strong>Tip:</strong> &lt;ul&gt; for bullet points, &lt;ol&gt; for numbered lists</p>',
  20,
  3
);

-- Test cases for Exercise 2.3
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Creating Lists'),
 'html_tag_exists', '{"tag": "ul"}', 5, 'Missing unordered list <ul>'),

((SELECT id FROM exercises WHERE title = 'Creating Lists'),
 'html_tag_exists', '{"tag": "ol"}', 5, 'Missing ordered list <ol>'),

((SELECT id FROM exercises WHERE title = 'Creating Lists'),
 'html_tag_count', '{"tag": "li", "count": 6, "operator": "gte"}', 10, 'Add at least 6 list items total (3 in each list)');


-- ======================
-- LESSON 3: Text Formatting & Links
-- ======================

-- Exercise 3.1: Text Formatting
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  3,
  'Formatting Text',
  'Use bold, italic, and other text formatting tags',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>News Article</title>
</head>
<body>
  <h1>Breaking News</h1>
  <!-- Format text here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Create a paragraph with <strong>bold text</strong> using &lt;strong&gt;</li>
  <li>Create a paragraph with <em>italic text</em> using &lt;em&gt;</li>
  <li>Add text with both bold and italic</li>
  <li>Use &lt;mark&gt; to highlight important text</li>
</ul>
<p><strong>Remember:</strong> &lt;strong&gt; for bold, &lt;em&gt; for italic</p>',
  20,
  1
);

-- Test cases for Exercise 3.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Formatting Text'),
 'html_tag_exists', '{"tag": "strong"}', 7, 'Use <strong> for bold text'),

((SELECT id FROM exercises WHERE title = 'Formatting Text'),
 'html_tag_exists', '{"tag": "em"}', 7, 'Use <em> for italic text'),

((SELECT id FROM exercises WHERE title = 'Formatting Text'),
 'html_tag_exists', '{"tag": "mark"}', 6, 'Use <mark> to highlight text');


-- Exercise 3.2: Line Breaks and Horizontal Rules
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  3,
  'Line Breaks and Dividers',
  'Practice using br and hr tags',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>Article Sections</title>
</head>
<body>
  <h1>Weather Report</h1>
  <!-- Add content here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Write an address using &lt;br&gt; for line breaks</li>
  <li>Add a horizontal rule &lt;hr&gt; to separate sections</li>
  <li>Create at least 2 sections separated by &lt;hr&gt;</li>
  <li>Use at least 3 line breaks with &lt;br&gt;</li>
</ul>
<p><strong>Note:</strong> &lt;br&gt; and &lt;hr&gt; are self-closing tags</p>',
  15,
  2
);

-- Test cases for Exercise 3.2
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Line Breaks and Dividers'),
 'html_tag_count', '{"tag": "br", "count": 3, "operator": "gte"}', 8, 'Use at least 3 <br> tags for line breaks'),

((SELECT id FROM exercises WHERE title = 'Line Breaks and Dividers'),
 'html_tag_count', '{"tag": "hr", "count": 1, "operator": "gte"}', 7, 'Add at least one <hr> horizontal rule');


-- ======================
-- LESSON 4: Images & Multimedia
-- ======================

-- Exercise 4.1: Image Gallery
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  4,
  'Build an Image Gallery',
  'Create a photo gallery with multiple images',
  'intermediate',
  '<!DOCTYPE html>
<html>
<head>
  <title>Photo Gallery</title>
</head>
<body>
  <h1>My Photo Gallery</h1>
  <!-- Add images here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add at least 4 images using &lt;img&gt; tags</li>
  <li>Use these URLs: https://picsum.photos/300/200?random=1, random=2, random=3, random=4</li>
  <li>Each image must have alt text</li>
  <li>Add a caption under each image using &lt;p&gt;</li>
  <li>Set width="300" and height="200" on all images</li>
</ul>',
  25,
  1
);

-- Test cases for Exercise 4.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Build an Image Gallery'),
 'html_tag_count', '{"tag": "img", "count": 4, "operator": "gte"}', 15, 'Add at least 4 images'),

((SELECT id FROM exercises WHERE title = 'Build an Image Gallery'),
 'attribute_exists', '{"tag": "img", "attribute": "alt"}', 10, 'All images must have alt attributes');


-- ======================
-- LESSON 5: Introduction to CSS
-- ======================

-- Exercise 5.1: Inline Styles
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  5,
  'Your First CSS Styles',
  'Apply inline CSS styles to HTML elements',
  'beginner',
  '<!DOCTYPE html>
<html>
<head>
  <title>Styled Page</title>
</head>
<body>
  <h1>My Styled Heading</h1>
  <p>This is a paragraph.</p>
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add style attribute to &lt;h1&gt; with color: blue</li>
  <li>Add style to &lt;p&gt; with color: green and font-size: 18px</li>
  <li>Add background-color to body: lightgray</li>
</ul>
<p><strong>Syntax:</strong> <code>style="property: value;"</code></p>',
  20,
  1
);

-- Test cases for Exercise 5.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Your First CSS Styles'),
 'attribute_exists', '{"tag": "h1", "attribute": "style"}', 7, 'Add style attribute to <h1>'),

((SELECT id FROM exercises WHERE title = 'Your First CSS Styles'),
 'attribute_exists', '{"tag": "p", "attribute": "style"}', 7, 'Add style attribute to <p>'),

((SELECT id FROM exercises WHERE title = 'Your First CSS Styles'),
 'attribute_exists', '{"tag": "body", "attribute": "style"}', 6, 'Add style attribute to <body>');


-- Exercise 5.2: Internal CSS
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  5,
  'Using Style Tags',
  'Create internal CSS using the style tag',
  'intermediate',
  '<!DOCTYPE html>
<html>
<head>
  <title>Internal CSS</title>
  <!-- Add style tag here -->
</head>
<body>
  <h1>Welcome</h1>
  <p class="intro">This is the introduction.</p>
  <p>This is a regular paragraph.</p>
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add &lt;style&gt; tag in the &lt;head&gt;</li>
  <li>Style all h1 elements: color red, text-align center</li>
  <li>Style .intro class: font-weight bold, color blue</li>
  <li>Style all p elements: font-family Arial</li>
</ul>',
  25,
  2
);

-- Test cases for Exercise 5.2
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Using Style Tags'),
 'html_tag_exists', '{"tag": "style"}', 10, 'Add <style> tag in the <head> section'),

((SELECT id FROM exercises WHERE title = 'Using Style Tags'),
 'attribute_exists', '{"tag": "p", "attribute": "class"}', 15, 'Add class="intro" to the first paragraph');


-- ======================
-- LESSON 6: CSS Layout & Design
-- ======================

-- Exercise 6.1: Box Model
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  6,
  'Understanding the Box Model',
  'Apply padding, margin, and border to elements',
  'intermediate',
  '<!DOCTYPE html>
<html>
<head>
  <title>Box Model</title>
  <style>
    .box {
      background-color: lightblue;
      /* Add more styles here */
    }
  </style>
</head>
<body>
  <div class="box">
    <p>This is a box</p>
  </div>
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Add padding: 20px to .box</li>
  <li>Add margin: 10px to .box</li>
  <li>Add border: 2px solid black to .box</li>
  <li>Add width: 300px to .box</li>
</ul>',
  25,
  1
);

-- Test cases for Exercise 6.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Understanding the Box Model'),
 'html_tag_exists', '{"tag": "style"}', 10, 'Keep the <style> tag'),

((SELECT id FROM exercises WHERE title = 'Understanding the Box Model'),
 'attribute_exists', '{"tag": "div", "attribute": "class"}', 15, 'Keep class="box" on the div');


-- ======================
-- LESSON 7: Build a News Article Page
-- ======================

-- Exercise 7.1: Complete News Article
INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
VALUES (
  7,
  'Final Project: News Article',
  'Build a complete, styled news article page',
  'advanced',
  '<!DOCTYPE html>
<html>
<head>
  <title>News Article</title>
  <style>
    /* Add your CSS here */
  </style>
</head>
<body>
  <!-- Build your article here -->
</body>
</html>',
  '<h3>Requirements:</h3>
<ul>
  <li>Article headline using &lt;h1&gt;</li>
  <li>Byline (author name and date)</li>
  <li>At least 3 paragraphs of content</li>
  <li>At least one image with caption</li>
  <li>A pull quote (highlighted quote)</li>
  <li>Subheadings using &lt;h2&gt;</li>
  <li>Links to related articles</li>
  <li>Styled with CSS (colors, fonts, spacing)</li>
  <li>Professional news layout</li>
</ul>
<p><strong>This is your final project!</strong> Show all the skills you''ve learned.</p>',
  50,
  1
);

-- Test cases for Exercise 7.1
INSERT INTO test_cases (exercise_id, test_type, test_config, points, error_message)
VALUES
((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_exists', '{"tag": "h1"}', 5, 'Add article headline using <h1>'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_count', '{"tag": "p", "count": 3, "operator": "gte"}', 10, 'Write at least 3 paragraphs'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_exists', '{"tag": "img"}', 5, 'Include at least one image'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_exists', '{"tag": "a"}', 5, 'Add links to related articles'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_exists', '{"tag": "style"}', 10, 'Style your article with CSS'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'html_tag_count', '{"tag": "h2", "count": 1, "operator": "gte"}', 5, 'Use subheadings with <h2>'),

((SELECT id FROM exercises WHERE title = 'Final Project: News Article'),
 'attribute_exists', '{"tag": "img", "attribute": "alt"}', 10, 'Images must have alt text');

-- Success message
SELECT 'Exercises and test cases added successfully!' AS status;