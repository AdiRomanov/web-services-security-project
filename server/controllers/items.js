const db = require('../config/database');

module.exports = {
  createItem: async (req, res) => {
    try {
      const { title, description } = req.body;
      const userId = req.userId;

      // Validate input
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Create item
      const { lastID } = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO items (title, description, userId) VALUES (?, ?, ?)',
          [title, description, userId],
          function(err) {
            if (err) reject(err);
            resolve(this);
          }
        );
      });

      res.status(201).json({ id: lastID, title, description });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getItems: async (req, res) => {
    try {
      const userId = req.userId;
      
      // Get all items for user
      const items = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM items WHERE userId = ?', [userId], (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });

      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      const { title, description } = req.body;
      const { id } = req.params;
      const userId = req.userId;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const changes = await new Promise((resolve, reject) => {
        db.run(
          'UPDATE items SET title = ?, description = ? WHERE id = ? AND userId = ?',
          [title, description, id, userId],
          function(err) {
            if (err) reject(err);
            resolve(this.changes);
          }
        );
      });

      if (changes === 0) {
        return res.status(404).json({ error: 'Item not found or not owned by user' });
      }

      res.json({ id, title, description });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const changes = await new Promise((resolve, reject) => {
        db.run(
          'DELETE FROM items WHERE id = ? AND userId = ?',
          [id, userId],
          function(err) {
            if (err) reject(err);
            resolve(this.changes);
          }
        );
      });

      if (changes === 0) {
        return res.status(404).json({ error: 'Item not found or not owned by user' });
      }

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};