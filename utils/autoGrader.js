const cheerio = require('cheerio');

/**
 * Auto-grading system for HTML/CSS exercises
 * Tests student code against predefined criteria
 */

class AutoGrader {
  constructor(code, testCases) {
    this.code = code;
    this.testCases = testCases;
    this.$ = null;
    this.results = [];
    this.totalPoints = 0;
    this.earnedPoints = 0;
  }

  /**
   * Run all test cases and return results
   */
  async grade() {
    try {
      // Parse HTML with cheerio
      this.$ = cheerio.load(this.code, {
        xml: {
          xmlMode: false
        }
      });

      // Calculate total possible points
      this.totalPoints = this.testCases.reduce((sum, test) => sum + test.points, 0);

      // Run each test case
      for (const testCase of this.testCases) {
        const result = await this.runTest(testCase);
        this.results.push(result);
        if (result.passed) {
          this.earnedPoints += testCase.points;
        }
      }

      return {
        score: this.earnedPoints,
        maxScore: this.totalPoints,
        percentage: Math.round((this.earnedPoints / this.totalPoints) * 100),
        passed: this.earnedPoints === this.totalPoints,
        results: this.results,
        feedback: this.generateFeedback()
      };

    } catch (error) {
      console.error('Grading error:', error);
      return {
        score: 0,
        maxScore: this.totalPoints,
        percentage: 0,
        passed: false,
        error: 'Failed to grade submission',
        results: []
      };
    }
  }

  /**
   * Run individual test case
   */
  async runTest(testCase) {
    const { test_type, test_config, points, error_message } = testCase;

    let passed = false;
    let message = '';

    try {
      switch (test_type) {
        case 'html_tag_exists':
          passed = this.checkTagExists(test_config);
          message = passed
            ? `✓ Found required <${test_config.tag}> tag`
            : error_message || `✗ Missing required <${test_config.tag}> tag`;
          break;

        case 'html_tag_count':
          passed = this.checkTagCount(test_config);
          message = passed
            ? `✓ Correct number of <${test_config.tag}> tags`
            : error_message || `✗ Expected ${test_config.count} <${test_config.tag}> tag(s)`;
          break;

        case 'attribute_exists':
          passed = this.checkAttributeExists(test_config);
          message = passed
            ? `✓ Found ${test_config.attribute} attribute`
            : error_message || `✗ Missing ${test_config.attribute} attribute on <${test_config.tag}>`;
          break;

        case 'attribute_value':
          passed = this.checkAttributeValue(test_config);
          message = passed
            ? `✓ Correct ${test_config.attribute} value`
            : error_message || `✗ Incorrect ${test_config.attribute} value`;
          break;

        case 'css_property':
          passed = this.checkCSSProperty(test_config);
          message = passed
            ? `✓ CSS property ${test_config.property} found`
            : error_message || `✗ Missing CSS: ${test_config.property}`;
          break;

        case 'text_content':
          passed = this.checkTextContent(test_config);
          message = passed
            ? `✓ Required text content found`
            : error_message || `✗ Missing required text content`;
          break;

        case 'class_exists':
          passed = this.checkClassExists(test_config);
          message = passed
            ? `✓ Class "${test_config.className}" found`
            : error_message || `✗ Missing class: ${test_config.className}`;
          break;

        case 'id_exists':
          passed = this.checkIdExists(test_config);
          message = passed
            ? `✓ ID "${test_config.id}" found`
            : error_message || `✗ Missing ID: ${test_config.id}`;
          break;

        case 'nested_structure':
          passed = this.checkNestedStructure(test_config);
          message = passed
            ? `✓ Correct nesting structure`
            : error_message || `✗ Incorrect element nesting`;
          break;

        case 'semantic_html':
          passed = this.checkSemanticHTML(test_config);
          message = passed
            ? `✓ Semantic HTML used correctly`
            : error_message || `✗ Use semantic HTML elements`;
          break;

        default:
          message = `Unknown test type: ${test_type}`;
      }

    } catch (error) {
      console.error('Test error:', error);
      message = 'Error running test';
    }

    return {
      testType: test_type,
      passed,
      points: passed ? points : 0,
      maxPoints: points,
      message
    };
  }

  /**
   * Test implementations
   */

  checkTagExists(config) {
    const { tag, minCount = 1 } = config;
    const count = this.$(tag).length;
    return count >= minCount;
  }

  checkTagCount(config) {
    const { tag, count, operator = 'eq' } = config;
    const actualCount = this.$(tag).length;

    switch (operator) {
      case 'eq': return actualCount === count;
      case 'gte': return actualCount >= count;
      case 'lte': return actualCount <= count;
      case 'gt': return actualCount > count;
      case 'lt': return actualCount < count;
      default: return false;
    }
  }

  checkAttributeExists(config) {
    const { tag, attribute } = config;
    const elements = this.$(tag);

    if (elements.length === 0) return false;

    // Check if at least one element has the attribute
    let hasAttribute = false;
    elements.each((i, el) => {
      if (this.$(el).attr(attribute)) {
        hasAttribute = true;
      }
    });

    return hasAttribute;
  }

  checkAttributeValue(config) {
    const { tag, attribute, value, matchType = 'exact' } = config;
    const elements = this.$(tag);

    if (elements.length === 0) return false;

    let matches = false;
    elements.each((i, el) => {
      const attrValue = this.$(el).attr(attribute);
      if (!attrValue) return;

      switch (matchType) {
        case 'exact':
          if (attrValue === value) matches = true;
          break;
        case 'contains':
          if (attrValue.includes(value)) matches = true;
          break;
        case 'starts':
          if (attrValue.startsWith(value)) matches = true;
          break;
        case 'ends':
          if (attrValue.endsWith(value)) matches = true;
          break;
        case 'regex':
          if (new RegExp(value).test(attrValue)) matches = true;
          break;
      }
    });

    return matches;
  }

  checkCSSProperty(config) {
    const { selector, property, value } = config;

    // Extract CSS from style tags
    const styleTags = this.$('style');
    let cssText = '';
    styleTags.each((i, el) => {
      cssText += this.$(el).html();
    });

    // Simple CSS parsing (basic check)
    // For production, consider using a CSS parser library
    const selectorRegex = new RegExp(selector.replace('.', '\\.').replace('#', '\\#') + '\\s*{[^}]*' + property, 'i');

    if (!selectorRegex.test(cssText)) return false;

    // If specific value required, check for it
    if (value) {
      const valueRegex = new RegExp(property + '\\s*:\\s*[^;]*' + value, 'i');
      return valueRegex.test(cssText);
    }

    return true;
  }

  checkTextContent(config) {
    const { tag, text, matchType = 'contains' } = config;
    const elements = this.$(tag);

    if (elements.length === 0) return false;

    let matches = false;
    elements.each((i, el) => {
      const content = this.$(el).text().trim();

      switch (matchType) {
        case 'exact':
          if (content === text) matches = true;
          break;
        case 'contains':
          if (content.includes(text)) matches = true;
          break;
        case 'regex':
          if (new RegExp(text, 'i').test(content)) matches = true;
          break;
      }
    });

    return matches;
  }

  checkClassExists(config) {
    const { className } = config;
    return this.$(`.${className}`).length > 0;
  }

  checkIdExists(config) {
    const { id } = config;
    return this.$(`#${id}`).length > 0;
  }

  checkNestedStructure(config) {
    const { parent, child } = config;
    return this.$(`${parent} ${child}`).length > 0;
  }

  checkSemanticHTML(config) {
    const { requiredTags = [] } = config;

    for (const tag of requiredTags) {
      if (this.$(tag).length === 0) return false;
    }

    return true;
  }

  /**
   * Generate human-readable feedback
   */
  generateFeedback() {
    const feedback = {
      summary: '',
      suggestions: [],
      achievements: []
    };

    const passedCount = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;

    // Summary
    if (passedCount === totalTests) {
      feedback.summary = '🎉 Perfect! You passed all tests!';
      feedback.achievements.push('All requirements met');
    } else if (passedCount >= totalTests * 0.8) {
      feedback.summary = '👍 Great work! Just a few more improvements needed.';
    } else if (passedCount >= totalTests * 0.5) {
      feedback.summary = '💪 Good start! Keep working on the requirements.';
    } else {
      feedback.summary = '📝 Keep trying! Review the instructions carefully.';
    }

    // Suggestions based on failed tests
    const failedTests = this.results.filter(r => !r.passed);
    feedback.suggestions = failedTests.map(t => t.message);

    // Achievement messages
    if (this.earnedPoints === this.totalPoints) {
      feedback.achievements.push('Perfect Score Achievement Unlocked!');
    }
    if (passedCount >= totalTests * 0.5) {
      feedback.achievements.push('Halfway There!');
    }

    return feedback;
  }
}

module.exports = AutoGrader;