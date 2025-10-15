-- Update lesson content with comprehensive teaching material

UPDATE lessons SET content_html = '
<div class="lesson-content">
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
</div>
' WHERE lesson_number = 1;

UPDATE lessons SET content_html = '
<div class="lesson-content">
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
</div>
' WHERE lesson_number = 2;

UPDATE lessons SET content_html = '
<div class="lesson-content">
  <h2>Text Formatting & Links</h2>
  
  <h3>Text Formatting Elements</h3>
  <p>HTML provides various tags to format text and convey meaning:</p>

  <h4>Bold Text:</h4>
  <ul>
    <li><code>&lt;strong&gt;</code> - Important text (semantic emphasis)</li>
    <li><code>&lt;b&gt;</code> - Bold text (visual only)</li>
  </ul>
  <p>Example: <code>&lt;strong&gt;This is important!&lt;/strong&gt;</code></p>

  <h4>Italic Text:</h4>
  <ul>
    <li><code>&lt;em&gt;</code> - Emphasized text (semantic emphasis)</li>
    <li><code>&lt;i&gt;</code> - Italic text (visual only)</li>
  </ul>
  <p>Example: <code>&lt;em&gt;This is emphasized&lt;/em&gt;</code></p>

  <h4>Other Formatting:</h4>
  <ul>
    <li><code>&lt;mark&gt;</code> - Highlighted text</li>
    <li><code>&lt;small&gt;</code> - Smaller text</li>
    <li><code>&lt;del&gt;</code> - Deleted text (strikethrough)</li>
    <li><code>&lt;ins&gt;</code> - Inserted text (underlined)</li>
    <li><code>&lt;sub&gt;</code> - Subscript text</li>
    <li><code>&lt;sup&gt;</code> - Superscript text</li>
  </ul>

  <h3>Line Breaks and Spacing</h3>
  <ul>
    <li><code>&lt;br&gt;</code> - Line break (starts new line)</li>
    <li><code>&lt;hr&gt;</code> - Horizontal rule (divider line)</li>
  </ul>

  <h3>Example Usage:</h3>
  <pre><code>&lt;p&gt;This is a paragraph with &lt;strong&gt;bold text&lt;/strong&gt; and &lt;em&gt;italic text&lt;/em&gt;.&lt;/p&gt;
&lt;p&gt;You can also have &lt;mark&gt;highlighted text&lt;/mark&gt; for emphasis.&lt;/p&gt;
&lt;p&gt;Line 1&lt;br&gt;Line 2&lt;br&gt;Line 3&lt;/p&gt;
&lt;hr&gt;
&lt;p&gt;This is after the horizontal rule.&lt;/p&gt;</code></pre>

  <h3>Semantic vs Visual</h3>
  <p>Choose semantic tags when possible:</p>
  <ul>
    <li>Use <code>&lt;strong&gt;</code> instead of <code>&lt;b&gt;</code> for important text</li>
    <li>Use <code>&lt;em&gt;</code> instead of <code>&lt;i&gt;</code> for emphasis</li>
    <li>Screen readers understand semantic meaning better</li>
  </ul>
</div>
' WHERE lesson_number = 3;

UPDATE lessons SET content_html = '
<div class="lesson-content">
  <h2>Images & Multimedia</h2>
  
  <h3>Working with Images</h3>
  <p>Images are essential for modern web pages. The &lt;img&gt; tag embeds images into your HTML document.</p>

  <h4>Basic Image Syntax:</h4>
  <pre><code>&lt;img src="path/to/image.jpg" alt="Description of image"&gt;</code></pre>

  <h4>Image Attributes:</h4>
  <ul>
    <li><strong>src</strong> - Source URL or path to the image</li>
    <li><strong>alt</strong> - Alternative text (crucial for accessibility)</li>
    <li><strong>width</strong> - Image width in pixels</li>
    <li><strong>height</strong> - Image height in pixels</li>
    <li><strong>title</strong> - Tooltip text on hover</li>
  </ul>

  <h3>Image Sources</h3>
  <ul>
    <li><strong>Relative paths:</strong> <code>src="images/photo.jpg"</code></li>
    <li><strong>Absolute URLs:</strong> <code>src="https://example.com/image.jpg"</code></li>
  </ul>

  <h3>Image Formats</h3>
  <ul>
    <li><strong>JPEG (.jpg)</strong> - Best for photos with many colors</li>
    <li><strong>PNG (.png)</strong> - Best for graphics, supports transparency</li>
    <li><strong>GIF (.gif)</strong> - Supports animation, limited colors</li>
    <li><strong>WebP</strong> - Modern format, smaller file sizes</li>
  </ul>

  <h3>Accessibility & Best Practices</h3>
  <ul>
    <li>Always include meaningful alt text</li>
    <li>Alt text should describe the image content</li>
    <li>Use empty alt="" for decorative images</li>
    <li>Optimize image sizes for web</li>
  </ul>

  <h3>Figure and Caption</h3>
  <p>For images with captions, use the figure element:</p>
  <pre><code>&lt;figure&gt;
  &lt;img src="photo.jpg" alt="Sunset over mountains"&gt;
  &lt;figcaption&gt;Beautiful sunset in the Rocky Mountains&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>

  <h3>Example Gallery Structure:</h3>
  <pre><code>&lt;div class="gallery"&gt;
  &lt;figure&gt;
    &lt;img src="photo1.jpg" alt="City skyline" width="300" height="200"&gt;
    &lt;figcaption&gt;Downtown skyline at night&lt;/figcaption&gt;
  &lt;/figure&gt;
  
  &lt;figure&gt;
    &lt;img src="photo2.jpg" alt="Mountain lake" width="300" height="200"&gt;
    &lt;figcaption&gt;Serene mountain lake&lt;/figcaption&gt;
  &lt;/figure&gt;
&lt;/div&gt;</code></pre>
</div>
' WHERE lesson_number = 4;

UPDATE lessons SET content_html = '
<div class="lesson-content">
  <h2>Introduction to CSS</h2>
  
  <h3>What is CSS?</h3>
  <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and positioning of HTML elements.</p>

  <h3>Three Ways to Add CSS</h3>
  
  <h4>1. Inline CSS</h4>
  <p>Applied directly to HTML elements using the style attribute:</p>
  <pre><code>&lt;h1 style="color: blue; font-size: 24px;"&gt;Blue Heading&lt;/h1&gt;</code></pre>

  <h4>2. Internal CSS</h4>
  <p>Placed in the &lt;head&gt; section using &lt;style&gt; tags:</p>
  <pre><code>&lt;head&gt;
  &lt;style&gt;
    h1 {
      color: blue;
      font-size: 24px;
    }
  &lt;/style&gt;
&lt;/head&gt;</code></pre>

  <h4>3. External CSS</h4>
  <p>Separate .css file linked to HTML:</p>
  <pre><code>&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;</code></pre>

  <h3>CSS Syntax</h3>
  <pre><code>selector {
  property: value;
  property: value;
}</code></pre>

  <h3>Common CSS Properties</h3>
  
  <h4>Text Properties:</h4>
  <ul>
    <li><code>color</code> - Text color</li>
    <li><code>font-family</code> - Font type</li>
    <li><code>font-size</code> - Text size</li>
    <li><code>font-weight</code> - Text thickness (bold)</li>
    <li><code>text-align</code> - Text alignment</li>
  </ul>

  <h4>Background Properties:</h4>
  <ul>
    <li><code>background-color</code> - Background color</li>
    <li><code>background-image</code> - Background image</li>
  </ul>

  <h3>CSS Selectors</h3>
  <ul>
    <li><strong>Element:</strong> <code>h1 { }</code> - Selects all h1 elements</li>
    <li><strong>Class:</strong> <code>.intro { }</code> - Selects elements with class="intro"</li>
    <li><strong>ID:</strong> <code>#header { }</code> - Selects element with id="header"</li>
  </ul>

  <h3>Example:</h3>
  <pre><code>&lt;style&gt;
  h1 {
    color: navy;
    text-align: center;
    font-family: Arial, sans-serif;
  }
  
  .highlight {
    background-color: yellow;
    padding: 10px;
  }
&lt;/style&gt;</code></pre>
</div>
' WHERE lesson_number = 5;

UPDATE lessons SET content_html = '
<div class="lesson-content">
  <h2>CSS Layout & Design</h2>
  
  <h3>The CSS Box Model</h3>
  <p>Every HTML element is essentially a box. The box model consists of:</p>
  
  <ul>
    <li><strong>Content</strong> - The actual content (text, images)</li>
    <li><strong>Padding</strong> - Space around content, inside border</li>
    <li><strong>Border</strong> - Line around padding and content</li>
    <li><strong>Margin</strong> - Space outside border, separates from other elements</li>
  </ul>

  <h3>Box Model Properties</h3>
  
  <h4>Padding:</h4>
  <pre><code>padding: 10px;           /* All sides */
padding: 10px 20px;      /* Top/bottom, left/right */
padding: 10px 20px 15px 25px; /* Top, right, bottom, left */</code></pre>

  <h4>Margin:</h4>
  <pre><code>margin: 10px;           /* All sides */
margin: 0 auto;         /* Center horizontally */</code></pre>

  <h4>Border:</h4>
  <pre><code>border: 2px solid black;
border-width: 2px;
border-style: solid;    /* solid, dashed, dotted */
border-color: black;</code></pre>

  <h3>Width and Height</h3>
  <pre><code>width: 300px;
height: 200px;
max-width: 100%;        /* Responsive */</code></pre>

  <h3>Display Types</h3>
  <ul>
    <li><code>display: block;</code> - Full width, stacks vertically</li>
    <li><code>display: inline;</code> - Only as wide as content</li>
    <li><code>display: inline-block;</code> - Inline but accepts width/height</li>
    <li><code>display: flex;</code> - Flexible layout</li>
  </ul>

  <h3>Flexbox Basics</h3>
  <p>Flexbox makes it easy to align and distribute space:</p>
  <pre><code>.container {
  display: flex;
  justify-content: center;  /* Horizontal alignment */
  align-items: center;      /* Vertical alignment */
  gap: 20px;               /* Space between items */
}</code></pre>

  <h3>Example Layout:</h3>
  <pre><code>&lt;style&gt;
  .card {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    max-width: 300px;
  }
  
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
&lt;/style&gt;</code></pre>
</div>
' WHERE lesson_number = 6;

UPDATE lessons SET content_html = '
<div class="lesson-content">
  <h2>Build a News Article Page</h2>
  
  <h3>Final Project Overview</h3>
  <p>You will create a complete, professional news article page that demonstrates all the skills you have learned throughout this course.</p>

  <h3>Project Requirements</h3>
  
  <h4>HTML Structure:</h4>
  <ul>
    <li>Proper HTML5 document structure</li>
    <li>Semantic elements (article, section, header, etc.)</li>
    <li>Article headline using h1</li>
    <li>Author byline and publication date</li>
    <li>Multiple paragraphs of content</li>
    <li>Subheadings using h2 and h3</li>
    <li>At least one image with proper alt text</li>
    <li>Pull quotes or blockquotes</li>
    <li>Links to related articles</li>
  </ul>

  <h4>CSS Styling:</h4>
  <ul>
    <li>Professional typography</li>
    <li>Consistent color scheme</li>
    <li>Proper spacing and layout</li>
    <li>Responsive design considerations</li>
    <li>Image styling and captions</li>
  </ul>

  <h3>Article Structure Template:</h3>
  <pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;h1&gt;Article Headline&lt;/h1&gt;
    &lt;div class="byline"&gt;
      &lt;span class="author"&gt;By [Author Name]&lt;/span&gt;
      &lt;span class="date"&gt;Published [Date]&lt;/span&gt;
    &lt;/div&gt;
  &lt;/header&gt;
  
  &lt;section class="content"&gt;
    &lt;p&gt;Opening paragraph...&lt;/p&gt;
    
    &lt;figure&gt;
      &lt;img src="image.jpg" alt="Description"&gt;
      &lt;figcaption&gt;Image caption&lt;/figcaption&gt;
    &lt;/figure&gt;
    
    &lt;h2&gt;Section Heading&lt;/h2&gt;
    &lt;p&gt;More content...&lt;/p&gt;
    
    &lt;blockquote&gt;
      &lt;p&gt;"This is a pull quote that highlights important information."&lt;/p&gt;
    &lt;/blockquote&gt;
  &lt;/section&gt;
&lt;/article&gt;</code></pre>

  <h3>CSS Styling Guide:</h3>
  <pre><code>/* Typography */
body {
  font-family: Georgia, serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.byline {
  color: #666;
  font-style: italic;
  margin-bottom: 2em;
}

blockquote {
  border-left: 4px solid #007cba;
  padding-left: 20px;
  font-style: italic;
  font-size: 1.2em;
}</code></pre>

  <h3>Grading Criteria:</h3>
  <ul>
    <li>HTML structure and semantics (20 points)</li>
    <li>Content quality and completeness (15 points)</li>
    <li>CSS styling and layout (10 points)</li>
    <li>Accessibility (alt text, proper headings) (5 points)</li>
  </ul>

  <p><strong>Tips for Success:</strong></p>
  <ul>
    <li>Choose a real news topic you are interested in</li>
    <li>Write engaging, well-structured content</li>
    <li>Pay attention to typography and visual hierarchy</li>
    <li>Test your article on different screen sizes</li>
    <li>Validate your HTML and CSS</li>
  </ul>
</div>
' WHERE lesson_number = 7;

SELECT 'Lesson content updated successfully!' AS status;