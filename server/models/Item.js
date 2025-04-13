const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  create: (itemData) => {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      db.run(
        'INSERT INTO items (id, name, description, createdAt) VALUES (?, ?, ?, ?)',
        [id, itemData.name, itemData.description || '', createdAt],
        (err) => err ? reject(err) : resolve({ id, ...itemData, createdAt })
      );
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM items', (err, rows) => err ? reject(err) : resolve(rows));
    });
  },

  update: (id, itemData) => {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString();
      db.run(
        'UPDATE items SET name = ?, description = ?, updatedAt = ? WHERE id = ?',
        [itemData.name, itemData.description || '', updatedAt, id],
        function(err) {
          err ? reject(err) : resolve({ id, ...itemData, updatedAt });
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM items WHERE id = ?', [id], (err) => 
        err ? reject(err) : resolve(true)
      );
    });
  }
};