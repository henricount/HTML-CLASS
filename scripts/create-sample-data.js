const { pool } = require('../db/db');

async function createSampleData() {
  console.log('🔧 Creating sample data...\n');

  try {
    // Check if exercises already exist
    const exerciseCount = await pool.query('SELECT COUNT(*) FROM exercises');
    
    if (parseInt(exerciseCount.rows[0].count) > 0) {
      console.log('✅ Exercises already exist, skipping creation');
    } else {
      // Create basic exercises for each lesson
      console.log('📝 Creating exercises...');
      
      for (let lessonId = 1; lessonId <= 6; lessonId++) {
        await pool.query(`
          INSERT INTO exercises (lesson_id, title, description, difficulty, starter_code, instructions, max_points, order_index)
          VALUES ($1, $2, $3, 'beginner', $4, $5, 20, 1)
        `, [
          lessonId,
          `Lesson ${lessonId} Exercise`,
          `Practice exercise for lesson ${lessonId}`,
          '<!DOCTYPE html>\n<html>\n<head>\n  <title>Exercise</title>\n</head>\n<body>\n  <!-- Write your code here -->\n</body>\n</html>',
          `<h3>Requirements:</h3><ul><li>Complete the HTML structure</li><li>Add appropriate content</li></ul>`
        ]);
      }
      
      console.log('✅ Exercises created');
    }

    // Check if achievements exist
    const achievementCount = await pool.query('SELECT COUNT(*) FROM achievements');
    console.log(`📊 Achievements in database: ${achievementCount.rows[0].count}`);

    // Create some sample user progress for the logged-in user
    console.log('✅ Sample data setup complete!');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Sample data creation failed:', error);
    process.exit(1);
  }
}

// Run creation
createSampleData();