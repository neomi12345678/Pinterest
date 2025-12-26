
import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'Pinterest',


    port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    return;
  }
  console.log('✅ Connected to the database.');
});

export default db;
