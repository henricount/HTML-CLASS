const fs = require('fs');
const path = require('path');
const { pool } = require('../db/db');

async function populateExercises() {
  console.log('🔧 Populating exercises...\n');

  try {
    // Read exercises SQL file
    const sqlPath = path.join(__dirname, '..', 'populate-exercises.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Executing exercises SQL...');
    await pool.query(sql);
    console.log('✅ Exercises populated successfully\n');

    // Check how many exercises were created
    const exercises = await pool.query('SELECT COUNT(*) FROM exercises');
    const testCases = await pool.query('SELECT COUNT(*) FROM test_cases');

    console.log('📊 Data created:');
    console.log(`   - Exercises: ${exercises.rows[0].count}`);
    console.log(`   - Test Cases: ${testCases.rows[0].count}`);
    console.log();

    console.log('🎉 Exercise population complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Exercise population failed:', error);
    process.exit(1);
  }
}

// Run population
populateExercises();