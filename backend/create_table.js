const { Pool } = require('pg');
const pool = new Pool({ connectionString: require('dotenv').config().parsed.DATABASE_URL });
const createTable = "CREATE TABLE IF NOT EXISTS impact_reports (report_id SERIAL PRIMARY KEY, problem_code VARCHAR(255), generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, title VARCHAR(255), summary TEXT, key_metrics TEXT, challenges_overcome TEXT);";
pool.query(createTable).then(() => { console.log('Table created'); pool.end(); }).catch(e => { console.error(e); pool.end(); });
