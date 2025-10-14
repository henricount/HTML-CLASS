const fs = require('fs');
const path = require('path');
const { pool } = require('../db/db');

async function initializeDatabase() {
  console.log('🔧 Initializing database...\n');

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Executing schema...');
    await pool.query(schema);
    console.log('✅ Schema created successfully\n');

    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Tables created:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log();

    // Check if admin user exists
    const adminCheck = await pool.query(
      'SELECT COUNT(*) FROM users WHERE role = $1',
      ['admin']
    );

    if (parseInt(adminCheck.rows[0].count) === 0) {
      console.log('⚠️  No admin user found. Please create one through registration.');
    } else {
      console.log(`✅ Admin users: ${adminCheck.rows[0].count}`);
    }

    console.log('\n🎉 Database initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Register as a teacher');
    console.log('4. Start adding lesson content\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();