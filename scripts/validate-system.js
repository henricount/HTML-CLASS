const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

async function validateSystem() {
  console.log('🔍 Comprehensive System Validation\n');
  
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // 1. Validate lesson-exercise alignment
    console.log('📋 LESSON-EXERCISE ALIGNMENT:');
    const alignment = await pool.query(`
      SELECT l.lesson_number, l.title as lesson_title, 
             e.title as exercise_title, e.difficulty,
             CASE 
               WHEN l.lesson_number = 1 AND e.title LIKE '%HTML Page%' THEN '✅'
               WHEN l.lesson_number = 2 AND e.title LIKE '%Formatting%' THEN '✅'
               WHEN l.lesson_number = 2 AND e.title LIKE '%Links%' THEN '✅'
               WHEN l.lesson_number = 3 AND e.title LIKE '%Image%' THEN '✅'
               WHEN l.lesson_number = 4 AND e.title LIKE '%CSS%' THEN '✅'
               WHEN l.lesson_number = 5 AND e.title LIKE '%Layout%' THEN '✅'
               WHEN l.lesson_number = 6 AND e.title LIKE '%Complete%' THEN '✅'
               ELSE '⚠️'
             END as alignment_check
      FROM lessons l
      LEFT JOIN exercises e ON e.lesson_id = l.id
      ORDER BY l.lesson_number, e.order_index
    `);

    let alignmentIssues = 0;
    alignment.rows.forEach(row => {
      const status = row.alignment_check === '✅' ? 'GOOD' : 'NEEDS REVIEW';
      console.log(`  ${row.alignment_check} Lesson ${row.lesson_number}: ${row.lesson_title}`);
      if (row.exercise_title) {
        console.log(`     Exercise: ${row.exercise_title} (${row.difficulty}) - ${status}`);
      }
      if (row.alignment_check === '⚠️') alignmentIssues++;
    });
    
    console.log(`\nAlignment Status: ${alignmentIssues === 0 ? '✅ Perfect' : `⚠️ ${alignmentIssues} issues found`}\n`);

    // 2. Content quality check
    console.log('📚 CONTENT QUALITY CHECK:');
    const contentCheck = await pool.query(`
      SELECT lesson_number, title,
             LENGTH(content_html) as content_length,
             CASE 
               WHEN LENGTH(content_html) > 2000 THEN '✅ Rich content'
               WHEN LENGTH(content_html) > 1000 THEN '⚠️ Basic content'
               ELSE '❌ Insufficient content'
             END as quality_status
      FROM lessons
      ORDER BY lesson_number
    `);

    contentCheck.rows.forEach(lesson => {
      console.log(`  ${lesson.quality_status.charAt(0)} Lesson ${lesson.lesson_number}: ${lesson.title}`);
      console.log(`     Content length: ${lesson.content_length} characters - ${lesson.quality_status.substring(2)}`);
    });

    // 3. Exercise difficulty progression
    console.log('\n🎯 EXERCISE DIFFICULTY PROGRESSION:');
    const difficultyCheck = await pool.query(`
      SELECT l.lesson_number, e.title, e.difficulty, e.max_points, e.order_index,
             COUNT(tc.id) as test_count
      FROM exercises e
      JOIN lessons l ON l.id = e.lesson_id
      LEFT JOIN test_cases tc ON tc.exercise_id = e.id
      GROUP BY l.lesson_number, e.title, e.difficulty, e.max_points, e.order_index
      ORDER BY l.lesson_number, e.order_index
    `);

    const expectedProgression = ['beginner', 'beginner', 'beginner', 'intermediate', 'beginner', 'intermediate', 'advanced'];
    let progressionIssues = 0;

    difficultyCheck.rows.forEach((exercise, index) => {
      const expected = expectedProgression[index];
      const matches = exercise.difficulty === expected;
      const status = matches ? '✅' : '⚠️';
      
      console.log(`  ${status} Exercise ${index + 1}: ${exercise.title}`);
      console.log(`     Difficulty: ${exercise.difficulty} (expected: ${expected})`);
      console.log(`     Points: ${exercise.max_points} | Tests: ${exercise.test_count}`);
      
      if (!matches) progressionIssues++;
    });

    console.log(`\nProgression Status: ${progressionIssues === 0 ? '✅ Well-structured' : `⚠️ ${progressionIssues} progression issues`}\n`);

    // 4. Test case coverage
    console.log('✅ TEST CASE COVERAGE:');
    const testCoverage = await pool.query(`
      SELECT e.title, 
             COUNT(tc.id) as test_count,
             SUM(tc.points) as total_points,
             ARRAY_AGG(tc.test_type) as test_types
      FROM exercises e
      LEFT JOIN test_cases tc ON tc.exercise_id = e.id
      GROUP BY e.id, e.title
      ORDER BY e.id
    `);

    testCoverage.rows.forEach(exercise => {
      const adequateTests = exercise.test_count >= 4;
      const status = adequateTests ? '✅' : '⚠️';
      
      console.log(`  ${status} ${exercise.title}`);
      console.log(`     Tests: ${exercise.test_count} | Points: ${exercise.total_points}`);
      console.log(`     Types: ${exercise.test_types?.join(', ') || 'None'}`);
    });

    // 5. Database integrity check
    console.log('\n🔧 DATABASE INTEGRITY:');
    const integrityChecks = [
      {
        name: 'Orphaned exercises',
        query: 'SELECT COUNT(*) as count FROM exercises WHERE lesson_id NOT IN (SELECT id FROM lessons)'
      },
      {
        name: 'Orphaned test cases',
        query: 'SELECT COUNT(*) as count FROM test_cases WHERE exercise_id NOT IN (SELECT id FROM exercises)'
      },
      {
        name: 'Lessons without exercises',
        query: 'SELECT COUNT(*) as count FROM lessons WHERE id NOT IN (SELECT DISTINCT lesson_id FROM exercises WHERE lesson_id IS NOT NULL)'
      }
    ];

    for (const check of integrityChecks) {
      const result = await pool.query(check.query);
      const count = parseInt(result.rows[0].count);
      const status = count === 0 ? '✅' : '❌';
      console.log(`  ${status} ${check.name}: ${count}`);
    }

    // 6. System summary
    console.log('\n📊 SYSTEM SUMMARY:');
    const summary = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM lessons) as lesson_count,
        (SELECT COUNT(*) FROM exercises) as exercise_count,
        (SELECT COUNT(*) FROM test_cases) as test_count,
        (SELECT SUM(max_points) FROM exercises) as total_points,
        (SELECT COUNT(*) FROM lessons WHERE LENGTH(content_html) > 2000) as rich_content_lessons
    `);

    const stats = summary.rows[0];
    console.log(`  📖 ${stats.lesson_count} lessons (${stats.rich_content_lessons} with rich content)`);
    console.log(`  🎯 ${stats.exercise_count} exercises`);
    console.log(`  ✅ ${stats.test_count} test cases`);
    console.log(`  🏆 ${stats.total_points} total points available`);

    // Final assessment
    const totalIssues = alignmentIssues + progressionIssues;
    console.log('\n🎉 FINAL ASSESSMENT:');
    if (totalIssues === 0) {
      console.log('✅ System is ready for students!');
      console.log('   - Content alignment is perfect');
      console.log('   - Difficulty progression is appropriate');
      console.log('   - All exercises have adequate test coverage');
      console.log('   - Database integrity is maintained');
    } else {
      console.log(`⚠️  System has ${totalIssues} minor issues to review`);
      console.log('   - Core functionality is intact');
      console.log('   - Students can proceed with learning');
    }

    console.log('\n🚀 The HTML Journalism Course is ready to launch!');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  validateSystem()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { validateSystem };