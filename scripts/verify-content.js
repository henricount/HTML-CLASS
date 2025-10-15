const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

async function verifyContent() {
  console.log('🔍 Verifying database content...\n');
  
  try {
    // Check lessons
    console.log('📚 LESSONS:');
    const lessons = await pool.query(`
      SELECT lesson_number, title, 
             CASE 
               WHEN content_html IS NOT NULL THEN 'Has content'
               ELSE 'No content'
             END as content_status,
             LENGTH(content_html) as content_length
      FROM lessons 
      ORDER BY lesson_number
    `);
    
    lessons.rows.forEach(lesson => {
      console.log(`  ${lesson.lesson_number}. ${lesson.title}`);
      console.log(`     Content: ${lesson.content_status} (${lesson.content_length || 0} chars)`);
    });
    
    // Check exercises
    console.log('\n🏋️ EXERCISES:');
    const exercises = await pool.query(`
      SELECT e.lesson_id, e.title, e.difficulty, e.max_points,
             COUNT(tc.id) as test_count
      FROM exercises e
      LEFT JOIN test_cases tc ON tc.exercise_id = e.id
      GROUP BY e.id, e.lesson_id, e.title, e.difficulty, e.max_points
      ORDER BY e.lesson_id, e.order_index
    `);
    
    exercises.rows.forEach(exercise => {
      console.log(`  Lesson ${exercise.lesson_id}: ${exercise.title}`);
      console.log(`     Difficulty: ${exercise.difficulty} | Points: ${exercise.max_points} | Tests: ${exercise.test_count}`);
    });
    
    // Summary statistics
    console.log('\n📊 SUMMARY:');
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM lessons) as lesson_count,
        (SELECT COUNT(*) FROM exercises) as exercise_count,
        (SELECT COUNT(*) FROM test_cases) as test_count,
        (SELECT SUM(max_points) FROM exercises) as total_points
    `);
    
    const summary = stats.rows[0];
    console.log(`  📖 ${summary.lesson_count} lessons loaded`);
    console.log(`  🎯 ${summary.exercise_count} exercises created`);
    console.log(`  ✅ ${summary.test_count} test cases configured`);
    console.log(`  🏆 ${summary.total_points} total points available`);
    
    // Check for any lessons missing content
    const emptyLessons = await pool.query(`
      SELECT lesson_number, title 
      FROM lessons 
      WHERE content_html IS NULL OR content_html = ''
    `);
    
    if (emptyLessons.rows.length > 0) {
      console.log('\n⚠️  LESSONS MISSING CONTENT:');
      emptyLessons.rows.forEach(lesson => {
        console.log(`  Lesson ${lesson.lesson_number}: ${lesson.title}`);
      });
    } else {
      console.log('\n✅ All lessons have content!');
    }
    
    console.log('\n🎉 Database verification complete!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  verifyContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { verifyContent };