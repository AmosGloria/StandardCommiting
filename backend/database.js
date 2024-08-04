// database.js
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',       
  user: 'root',       
  password: 'your password', 
  database: 'expense_tracker', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
