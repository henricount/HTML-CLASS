const { pool } = require('../db/db');

async function createSampleProgress() {
  console.log('🔧 Creating sample user progress...\n');

  try {
    // Get the first user (most recent registration)
    const users = await pool.query('SELECT id, email FROM users ORDER BY id DESC LIMIT 1');
    
    if (users.rows.length === 0) {
      console.log('❌ No users found. Please register a user first.');
      process.exit(1);
    }
    
    const userId = users.rows[0].id;
    console.log(`👤 Creating progress for user: ${users.rows[0].email}`);
    
    // Create progress for lessons 1-3 (started)
    for (let lessonId = 1; lessonId <= 3; lessonId++) {
      await pool.query(`
        INSERT INTO user_progress (user_id, lesson_id, started_at, time_spent_seconds, is_complete)
        VALUES ($1, $2, CURRENT_TIMESTAMP - INTERVAL '${lessonId} days', $3, $4)
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
          time_spent_seconds = EXCLUDED.time_spent_seconds,
          is_complete = EXCLUDED.is_complete
      `, [
        userId,
        lessonId,
        Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
        lessonId === 1 // Mark lesson 1 as complete
      ]);
    }
    
    // Create some sample submissions
    const exercises = await pool.query('SELECT id, lesson_id FROM exercises LIMIT 3');
    
    for (const exercise of exercises.rows) {
      await pool.query(`
        INSERT INTO submissions (user_id, exercise_id, code, is_complete, score, max_score, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP - INTERVAL '1 day')
        ON CONFLICT DO NOTHING
      `, [
        userId,
        exercise.id,
        '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>',
        true,
        Math.floor(Math.random() * 20) + 15, // Score between 15-35
        20 // Max score
      ]);
    }
    
    console.log('✅ Sample progress created successfully!');
    console.log('📊 Created data:');
    console.log('   - 3 lesson progress records');
    console.log('   - 1 completed lesson');
    console.log('   - 3 exercise submissions');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Sample progress creation failed:', error);
    process.exit(1);
  }
}

// Run creation
createSampleProgress();