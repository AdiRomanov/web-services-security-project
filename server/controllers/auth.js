const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', username);
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Check if user exists
      const userExists = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
          if (err) reject(err);
          resolve(!!row);
        });
      });

      if (userExists) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const { lastID } = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          function(err) {
            if (err) reject(err);
            resolve(this);
          }
        );
      });

      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Get user
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
};