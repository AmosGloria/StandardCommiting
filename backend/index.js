const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./database.js');
require('dotenv').config();

const app = express();
const port = 3000;

const cors = require('cors');

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Set up view engine
app.set('view engine', 'ejs');

// Default route
app.get('/', (req, res) => {
  res.send('Hello backend');
});

// Example route to get data from the database
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).send('Error querying the database.');
  }
});

// Registration endpoint
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  // console.log('ReqBod: ', req.body);

  // Check if required fields are present
  if (!username || !email || !password) {
    return res.status(400).send('Please enter username, email, and password.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.status(201).json("Registration Successful, please login");
  } catch (err) {
    // Check if the error is due to duplicate entry for 'email'
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({ message: 'Email already exists. Please use a different email.'});
    }
    console.error('Error creating user:', err);
    res.status(500).send({ message: 'Error creating user.'});
  }
});

// Login endpoint
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if required fields are present
  if (!email || !password) {
    return res.status(400).send({ message: 'Please enter email and password.'});
    
  }
// { message: }
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).send({ message: "Email doesn't exit please sign Up" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.'});
    }

    // Generate a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in.');
  }
});

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'No token provided' }); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired. Please log in again.' });
      }
      return res.status(403).json({ message: 'Invalid token' }); // Invalid token
    }
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};

// create a new expense endpoint
app.post('/api/expenses', authenticateToken, async (req, res) => {
  const { amount, date, category } = req.body;
  const userId = req.user.id;

  // Check if required fields are present
  if (!amount || !date || !category) {
    return res.status(400).json({ message: 'Please enter amount, date, and category.' });
  }

  try {
    // Insert the expense into the database
    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, amount, date, category) VALUES (?, ?, ?, ?)',
      [userId, amount, date, category]
    );

    // Retrieve the inserted expense
    const [rows] = await pool.query(
      'SELECT * FROM expenses WHERE id = ?',
      [result.insertId]
    );

    // Send the inserted expense as JSON response
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Error adding expense.' });
  }
});

// view all expenses
app.get('/api/expenses', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM expenses WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving expenses:', err);
    res.status(500).send('Error retrieving expenses.');
  }
});

// update expenses
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  const expenseId = req.params.id;
  const { amount, date, category } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);
    if (rows.length === 0) return res.status(404).send('Expense not found.');

    await pool.query('UPDATE expenses SET amount = ?, date = ?, category = ? WHERE id = ?', [amount, date, category, expenseId]);
    res.json('Expense updated successfully.');
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).send('Error updating expense.');
  }
});


app.get('/api/expenses/:id', authenticateToken, async (req, res) => {
  const expenseId = req.params.id;

  try {
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    if (rows.length === 0) {
      res.status(404).send('Expense not found.');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error('Error retrieving expense:', err);
    res.status(500).send('Error retrieving expense.');
  }
});


// Endpoint to delete an expense by its ID
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  const expenseId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if the expense exists and belongs to the authenticated user
    const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ? AND user_id = ?', [expenseId, userId]);

    // If the expense is not found or does not belong to the user, return 404
    if (rows.length === 0) {
      return res.status(404).send('Expense not found.');
    }

    // Delete the expense
    await pool.query('DELETE FROM expenses WHERE id = ?', [expenseId]);

    // Send a success response
    res.send('Expense deleted successfully.');
  } catch (err) {
    // Log the error and send a 500 response
    console.error('Error deleting expense:', err);
    res.status(500).send('Error deleting expense.');
  }
});


// Route for the main page
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
