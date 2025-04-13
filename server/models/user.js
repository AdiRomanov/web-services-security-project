const db = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = {
  create: async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          err ? reject(err) : resolve(this.lastID);
        }
      );
    });
  },
  
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        err ? reject(err) : resolve(row);
      });
    });
  }
};